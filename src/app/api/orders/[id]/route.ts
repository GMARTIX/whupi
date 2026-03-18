import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.execute(
      `SELECT o.*, m.store_name, r.vehicle_type 
       FROM orders o 
       LEFT JOIN merchants m ON o.merchant_id = m.id 
       LEFT JOIN riders r ON o.rider_id = r.id 
       WHERE o.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar pedido" }, { status: 500 });
  }
}
