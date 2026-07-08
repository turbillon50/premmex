import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cliente_id = searchParams.get('cliente_id')
  if (!cliente_id) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })
  try {
    const contratos = await sql`
      SELECT ct.id, ct.ncontrato AS folio, ct.estado, ct.dia_pago, ct.beneficiario,
        ct.monto_cuota AS monto_mensual, ct.saldo_pendiente, ct.inversion_total AS monto_total,
        p.nombre AS paquete
      FROM contratos ct LEFT JOIN planes p ON p.id = ct.plan_id
      WHERE ct.cliente_id = ${cliente_id} AND ct.activo = true
      ORDER BY ct.created_at DESC`

    // Historial de pagos con folio de recibo (para ver/descargar)
    const pagos = await sql`
      SELECT p.id, p.monto, p.metodo, p.fecha, co.nombre AS cobrador, r.folio AS recibo_num
      FROM pagos p
      LEFT JOIN cobradores co ON p.cobrador_id = co.id
      LEFT JOIN recibos r ON r.pago_id = p.id
      WHERE p.cliente_id = ${cliente_id} AND p.monto > 0
      ORDER BY p.fecha DESC LIMIT 30`

    return NextResponse.json({ contratos, pagos, beneficiarios: [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
