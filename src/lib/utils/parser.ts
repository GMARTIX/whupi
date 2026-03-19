export interface ParsedOrder {
  address: string;
  phone: string;
  paymentMethod: string;
  customerName?: string;
  total?: number;
  deliveryPrice?: number;
}

export function parseWhatsAppMessage(text: string): ParsedOrder {
  const result: ParsedOrder = {
    address: "",
    phone: "",
    paymentMethod: "Efectivo",
    deliveryPrice: 0
  };

  // Dirección
  const addressMatch = text.match(/Direcci[oó]n:\s*([^~\n]+)/i);
  if (addressMatch) result.address = addressMatch[1].trim();

  // Teléfono
  const phoneMatch = text.match(/Tel[eé]fono:\s*([\d\s-]+)/i);
  if (phoneMatch) result.phone = phoneMatch[1].replace(/[^\d+]/g, "").trim();

  // Forma de pago
  const paymentMatch = text.match(/Forma de pago:\s*([^\n]+)/i);
  if (paymentMatch) result.paymentMethod = paymentMatch[1].trim();

  // Costo de envio (Regex for "Envio: $500" or "Costo envio $600")
  const deliveryMatch = text.match(/(?:Env[ií]o|Costo env[ií]o):\s*\$?\s*([\d.]+)/i);
  if (deliveryMatch) {
    result.deliveryPrice = parseFloat(deliveryMatch[1].replace(/\./g, ''));
  }

  // Fallback for simple single-line messages (ej: "Taqueria zapioala 870 para Lago del desierto 354 pagado")
  if (!result.address) {
    const fallbackMatch = text.match(/para\s+([^,]+)/i);
    if (fallbackMatch) result.address = fallbackMatch[1].trim();
  }

  return result;
}
