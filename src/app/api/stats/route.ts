import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [contratos] = await sql`SELECT COUNT(*) as total FROM contratos WHERE activo = true`
    const [pendientes] = await sql`SELECT COALESCE(SUM(saldo_pendiente),0) as total FROM contratos WHERE activo = true AND saldo_pendiente > 0`
    const [cobrado_mes] = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)`
    const [cobrado_hoy] = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE(fecha) = CURRENT_DATE`
    const cobradores = await sql`SELECT id, nombre, zona, contratos_asignados, cobrado_mes FROM cobradores ORDER BY cobrado_mes DESC`
    const pagos_recientes = await sql`
      SELECT p.id, p.monto, p.metodo, p.recibo_num, p.fecha,
             cl.nombre as cliente, co.nombre as cobrador
      FROM pagos p
      LEFT JOIN clientes cl ON p.cliente_id = cl.id
      LEFT JOIN cobradores co ON p.cobrador_id = co.id
      ORDER BY p.fecha DESC LIMIT 10`
    const contratos_list = await sql`
      SELECT c.folio, c.estado, c.monto_mensual, c.saldo_pendiente,
             cl.nombre as cliente, p.nombre as paquete
      FROM contratos c
      JOIN clientes cl ON c.cliente_id = cl.id
      JOIN paquetes p ON c.paquete_id = p.id
      WHERE c.activo = true
      ORDER BY c.estado, cl.nombre LIMIT 30`
    return NextResponse.json({
      contratos: contratos.total,
      pendientes: pendientes.total,
      cobrado_mes: cobrado_mes.total,
      cobrado_hoy: cobrado_hoy.total,
      cobradores,
      pagos_recientes,
      contratos_list
    })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
