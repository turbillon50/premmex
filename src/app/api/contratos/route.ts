import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { nombre, telefono, direccion, colonia, cobrador_id, paquete_id, beneficiario, dia_pago } = await req.json()
    // Crear cliente
    const [cliente] = await sql`
      INSERT INTO clientes (nombre, telefono, direccion, colonia, cobrador_id)
      VALUES (${nombre}, ${telefono}, ${direccion}, ${colonia}, ${cobrador_id})
      RETURNING id`
    // Obtener paquete
    const [paquete] = await sql`SELECT precio, nombre as pnom FROM paquetes WHERE id = ${paquete_id}`
    const monto_mensual = Math.round(paquete.precio / 10) // 10 meses
    // Generar folio
    const [{ count }] = await sql`SELECT COUNT(*) as count FROM contratos`
    const folio = 'PMX-' + new Date().getFullYear() + '-' + String(parseInt(count)+1).padStart(3,'0')
    const fecha_venc = new Date(); fecha_venc.setFullYear(fecha_venc.getFullYear()+2)
    const [contrato] = await sql`
      INSERT INTO contratos (folio, cliente_id, paquete_id, monto_total, monto_mensual, saldo_pendiente, beneficiario, dia_pago, fecha_vencimiento)
      VALUES (${folio}, ${cliente.id}, ${paquete_id}, ${paquete.precio}, ${monto_mensual}, ${paquete.precio}, ${beneficiario}, ${dia_pago||5}, ${fecha_venc.toISOString().split('T')[0]})
      RETURNING id, folio`
    // Actualizar contador cobrador
    await sql`UPDATE cobradores SET contratos_asignados = contratos_asignados + 1 WHERE id = ${cobrador_id}`
    return NextResponse.json({ ok: true, folio: contrato.folio, contrato_id: contrato.id })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const paquetes = await sql`SELECT * FROM paquetes WHERE activo = true ORDER BY precio ASC`
    const cobradores = await sql`SELECT id, nombre, zona FROM cobradores WHERE activo = true ORDER BY nombre`
    return NextResponse.json({ paquetes, cobradores })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
