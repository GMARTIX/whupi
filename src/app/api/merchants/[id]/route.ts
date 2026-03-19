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
    const { 
      store_name, address, whatsapp_number, logo_url, lat, lng,
      accepts_cash, accepts_transfer, accepts_mercadopago,
      base_shipping_cost, per_meter_cost,
      category, city, email, stock_display_mode,
      enable_pickup, enable_delivery, enable_tips,
      tip_percentage, tax_mode, service_hours,
      notify_cash_drawer, sound_on_sale,
      bank_alias, bank_details
    } = await req.json();

    await db.execute(
      `UPDATE merchants 
       SET store_name = ?, address = ?, whatsapp_number = ?, logo_url = ?, lat = ?, lng = ?,
           accepts_cash = ?, accepts_transfer = ?, accepts_mercadopago = ?,
           base_shipping_cost = ?, per_meter_cost = ?,
           category = ?, city = ?, email = ?, stock_display_mode = ?,
           enable_pickup = ?, enable_delivery = ?, enable_tips = ?,
           tip_percentage = ?, tax_mode = ?, service_hours = ?,
           notify_cash_drawer = ?, sound_on_sale = ?,
           bank_alias = ?, bank_details = ?
       WHERE id = ?`,
      [
        store_name, address, whatsapp_number, logo_url, lat || null, lng || null,
        accepts_cash ? 1 : 0, accepts_transfer ? 1 : 0, accepts_mercadopago ? 1 : 0,
        base_shipping_cost, per_meter_cost,
        category, city, email, stock_display_mode,
        enable_pickup ? 1 : 0, enable_delivery ? 1 : 0, enable_tips ? 1 : 0,
        tip_percentage, tax_mode, JSON.stringify(service_hours || {}),
        notify_cash_drawer ? 1 : 0, sound_on_sale ? 1 : 0,
        bank_alias, bank_details,
        id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating merchant:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
