import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, address, amount, paymentMethod, merchantId } = body;

    const orderId = uuidv4();

    await db.execute(
      `INSERT INTO orders (id, merchant_id, customer_phone, customer_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, 
        merchantId || "m-lodejacinto", // Hardcoded for now
        phone, 
        address, 
        parseFloat(amount.replace(/[^0-9.]/g, "") || "0"), 
        paymentMethod, 
        "PENDING"
      ]
    );

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Error al crear el pedido" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 10"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Error al obtener pedidos" }, { status: 500 });
  }
}
