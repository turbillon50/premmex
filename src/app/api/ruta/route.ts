import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cobradorId = searchParams.get('cobrador_id')
  if (!cobradorId) return NextResponse.json({ error: 'cobrador_id requerido' }, { status: 400 })
  try {
    const ruta = await sql`
      SELECT c.id as contrato_id, c.folio, c.monto_mensual, c.saldo_pendiente, c.estado,
             cl.id as cliente_id, cl.nombre, cl.telefono, cl.direccion, cl.colonia, cl.lat, cl.lng,
             p.nombre as paquete,
             (SELECT COUNT(*) FROM pagos pg WHERE pg.contrato_id = c.id
               AND DATE_TRUNC('month', pg.fecha) = DATE_TRUNC('month', CURRENT_DATE)) as pagos_este_mes
      FROM contratos c
      JOIN clientes cl ON c.cliente_id = cl.id
      JOIN paquetes p ON c.paquete_id = p.id
      WHERE cl.cobrador_id = ${cobradorId} AND c.activo = true
      ORDER BY c.estado DESC, cl.nombre ASC
    `
    return NextResponse.json({ ruta })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
