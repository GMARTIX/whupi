import { NextResponse } from "next/server";
import { db, pediclubDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const [items]: any = await db.execute(
      `SELECT oi.*, p.name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    return NextResponse.json({ ...orders[0], items });
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

    // 2. Sincronizar con Pediclub (Rider App) si es Aceptado
    if (status === 'ACCEPTED') {
      console.log(`Synchronizing order ${id} to Pediclub...`);
      try {
        // Obtener detalles del pedido y el ID de pediclub del comercio
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
          
          if (!pediclubId) {
            console.warn(`Merchant ${order.store_name} does not have a pediclub_id. Sync skipped.`);
          } else {
            console.log(`Target Pediclub Merchant ID: ${pediclubId}`);

            // Insertar en fi_pedidos del sistema antiguo
            const [syncResult]: any = await pediclubDb.execute(
              `INSERT INTO fi_pedidos (
                ped_fecha, 
                nombre_del_cliente, 
                ped_com_id, 
                ped_estado, 
                ped_es_take_away, 
                ped_direccion_entrega, 
                ped_importe_total, 
                ped_rep_id, 
                ped_forma_de_pago,
                ped_comentarios
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                order.customer_name || 'Cliente Whupi',
                pediclubId,
                2, // Estado 2: Pendiente según PedidosPendientes.java
                0, // No es Take Away
                order.customer_address || 'Dirección no especificada',
                order.total_amount,
                0, // Sin repartidor asignado
                1, // 1 = Efectivo (por defecto)
                `Whupi Order: ${id}`
              ]
            );
            console.log(`Order ${id} successfully synced to Pediclub. Insert ID: ${syncResult.insertId}`);
          }
        } else {
          console.error(`Order ${id} not found in Whupi DB for sync.`);
        }
      } catch (syncError: any) {
        console.error("CRITICAL ERROR syncing to Pediclub:", syncError.message);
        console.error("Stack trace:", syncError.stack);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar pedido" }, { status: 500 });
  }
}
