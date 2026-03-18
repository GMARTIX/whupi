import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get("merchantId");

    let query = "SELECT * FROM products ORDER BY created_at DESC";
    let params: any[] = [];

    if (merchantId) {
      query = "SELECT * FROM products WHERE merchant_id = ? ORDER BY created_at DESC";
      params = [merchantId];
    }

    const [rows] = await db.execute(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, stock, image_url, merchant_id } = body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO products (id, merchant_id, name, description, price, image_url, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, merchant_id, name, description, price, image_url || null, stock > 0]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
