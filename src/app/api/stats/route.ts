import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const contratos = await sql`SELECT COUNT(*) as total FROM contratos WHERE activo = true`
    const pendientes = await sql`SELECT COALESCE(SUM(saldo_pendiente),0) as total FROM contratos WHERE activo = true AND saldo_pendiente > 0`
    const cobrado_mes = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)`
    return NextResponse.json({
      contratos: contratos[0].total,
      pendientes: pendientes[0].total,
      cobrado_mes: cobrado_mes[0].total
    })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
