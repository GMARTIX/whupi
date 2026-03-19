import { NextResponse } from "next/server";
import { db, pediclubDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Obtener datos básicos de Whupi
    const [orders]: any = await db.execute(
      "SELECT status, customer_address, customer_lat, customer_lng FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const order = orders[0];
    let riderLocation = null;

    // 2. Intentar buscar ubicación del rider en Pediclub
    // Solo mostramos la ubicación si el estado en Whupi es 'DELIVERING'
    if (order.status === 'DELIVERING') {
      try {
        const [pediclubOrders]: any = await pediclubDb.execute(
          "SELECT ped_rep_id, ped_estado FROM fi_pedidos WHERE ped_comentarios LIKE ? ORDER BY ped_id DESC LIMIT 1",
          [`%Whupi Order: ${id}%`]
        );

        if (pediclubOrders.length > 0 && pediclubOrders[0].ped_rep_id > 0) {
          const riderId = pediclubOrders[0].ped_rep_id;
          
          const [riders]: any = await pediclubDb.execute(
            "SELECT latlong FROM fi_usuario WHERE usua_id = ?",
            [riderId]
          );

          if (riders.length > 0 && riders[0].latlong && riders[0].latlong.includes(',')) {
            const [lat, lng] = riders[0].latlong.split(',').map((c: string) => parseFloat(c.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              riderLocation = { lat, lng };
            }
          }
        }
      } catch (pcError) {
        console.error("Error fetching rider location from Pediclub:", pcError);
      }
    }

    return NextResponse.json({
      id,
      status: order.status,
      customer_address: order.customer_address,
      customer_location: (order.customer_lat && order.customer_lng) ? { lat: order.customer_lat, lng: order.customer_lng } : null,
      rider_location: riderLocation
    });
  } catch (error) {
    console.error("Track API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
