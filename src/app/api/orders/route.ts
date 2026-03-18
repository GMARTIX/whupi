import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Soporte para ambos formatos (Manual y Storefront)
    const merchantId = body.merchant_id || body.merchantId || "m-lodejacinto";
    const phone = body.customer_phone || body.phone;
    const address = body.customer_address || body.address;
    const amount = body.total_amount || body.amount;
    const paymentMethod = body.payment_method || body.paymentMethod || "CASH";
    const items = body.items || [];

    const orderId = uuidv4();

    await db.execute(
      `INSERT INTO orders (id, merchant_id, customer_phone, customer_address, total_amount, payment_method, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId, 
        merchantId, 
        phone, 
        address, 
        typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, "") || "0") : amount, 
        paymentMethod, 
        "PENDING"
      ]
    );

    // Si hay items, los insertamos en order_items
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await db.execute(
          `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) 
           VALUES (?, ?, ?, ?, ?)`,
          [uuidv4(), orderId, item.id, item.quantity, item.price]
        );
      }
    }

    return NextResponse.json({ success: true, id: orderId });
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
