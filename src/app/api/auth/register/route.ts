import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { storeName, phone } = await req.json();
    
    const userId = uuidv4();
    const merchantId = uuidv4();

    // 1. Crear Usuario
    await db.execute(
      "INSERT INTO users (id, phone, role) VALUES (?, ?, 'MERCHANT')",
      [userId, phone]
    );

    // 2. Crear Comercio
    await db.execute(
      "INSERT INTO merchants (id, user_id, store_name, whatsapp_number) VALUES (?, ?, ?, ?)",
      [merchantId, userId, storeName, phone]
    );

    return NextResponse.json({ success: true, merchantId });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Error al registrarse" }, { status: 500 });
  }
}
