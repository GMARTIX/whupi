import { NextResponse } from "next/server";
import { db, pediclubDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Obtener datos actuales de Whupi
    const [orders]: any = await db.execute(
      `SELECT o.*, m.store_name, r.vehicle_type 
       FROM orders o 
       LEFT JOIN merchants m ON o.merchant_id = m.id 
       LEFT JOIN riders r ON o.rider_id = r.id 
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
    }

    let order = orders[0];

    // 2. BACK-SYNC: Consultar a Pediclub para ver si hubo avances del repartidor
    if (order.status !== 'COMPLETED' && order.status !== 'CANCELLED') {
      try {
        const [pediclubOrders]: any = await pediclubDb.execute(
          "SELECT ped_estado FROM fi_pedidos WHERE ped_comentarios LIKE ? ORDER BY ped_id DESC LIMIT 1",
          [`%Whupi Order: ${id}%`]
        );

        if (pediclubOrders.length > 0) {
          const pcStatus = pediclubOrders[0].ped_estado;
          let newWhupiStatus = null;

          if (pcStatus === 3 && order.status !== 'DELIVERING') {
            newWhupiStatus = 'DELIVERING';
          } else if (pcStatus === 4 && order.status !== 'COMPLETED') {
            newWhupiStatus = 'COMPLETED';
          }

          if (newWhupiStatus) {
            console.log(`Back-sync: Updating order ${id} status to ${newWhupiStatus} based on Pediclub.`);
            await db.execute("UPDATE orders SET status = ? WHERE id = ?", [newWhupiStatus, id]);
            order.status = newWhupiStatus;
          }
        }
      } catch (e: any) {
        console.error("Back-sync error:", e.message);
      }
    }

    // 3. Obtener items
    const [items]: any = await db.execute(
      `SELECT oi.*, p.name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    return NextResponse.json({ ...order, items });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, riderId } = body;

    // 1. Actualizar en Whupi DB
    if (riderId) {
      await db.execute(
        "UPDATE orders SET status = ?, rider_id = ? WHERE id = ?",
        [status, riderId, id]
      );
    } else {
      await db.execute(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id]
      );
    }

    // 2. Sincronizar con Pediclub (Rider App)
    if (status === 'ACCEPTED') {
      console.log(`Synchronizing new order ${id} to Pediclub...`);
      try {
        const [rows]: any = await db.execute(
          `SELECT o.*, m.pediclub_id, m.store_name 
           FROM orders o 
           JOIN merchants m ON o.merchant_id = m.id 
           WHERE o.id = ?`,
          [id]
        );

        if (rows.length > 0) {
          const order = rows[0];
          const pediclubId = order.pediclub_id;
          
          if (pediclubId) {
            await pediclubDb.execute(
              `INSERT INTO fi_pedidos (
                ped_fecha, nombre_del_cliente, ped_com_id, ped_estado, 
                ped_es_take_away, ped_direccion_entrega, ped_importe_total, 
                ped_rep_id, ped_forma_de_pago, ped_comentarios
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                order.customer_name || 'Cliente Whupi',
                pediclubId,
                2, // Estado 2: Pendiente
                0,
                order.customer_address || 'Dirección no especificada',
                order.total_amount,
                0,
                1,
                `Whupi Order: ${id}`
              ]
            );
          }
        }
      } catch (e: any) { console.error("Sync Error (ACCEPTED):", e.message); }
    } else if (status === 'DELIVERING') {
      console.log(`Updating order ${id} to DELIVERING in Pediclub...`);
      try {
        await pediclubDb.execute(
          "UPDATE fi_pedidos SET ped_estado = 3 WHERE ped_comentarios LIKE ?",
          [`%Whupi Order: ${id}%`]
        );
      } catch (e: any) { console.error("Sync Error (DELIVERING):", e.message); }
    } else if (status === 'COMPLETED') {
      try {
        await pediclubDb.execute(
          "UPDATE fi_pedidos SET ped_estado = 4 WHERE ped_comentarios LIKE ?",
          [`%Whupi Order: ${id}%`]
        );
      } catch (e: any) { console.error("Sync Error (COMPLETED):", e.message); }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar pedido" }, { status: 500 });
  }
}
