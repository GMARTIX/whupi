import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await db.execute(
      "SELECT * FROM merchants WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Comercio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { store_name, address, whatsapp_number, logo_url, lat, lng } = await req.json();

    await db.execute(
      `UPDATE merchants 
       SET store_name = ?, address = ?, whatsapp_number = ?, logo_url = ?, lat = ?, lng = ?
       WHERE id = ?`,
      [store_name, address, whatsapp_number, logo_url, lat || null, lng || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating merchant:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
