import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const contratos = await sql`SELECT COUNT(*) as total FROM contratos`
    const pagos = await sql`SELECT COUNT(*) as total FROM pagos`
    const clientes = await sql`SELECT COUNT(*) as total FROM clientes`
    return NextResponse.json({ ok: true, data: { contratos: contratos[0].total, pagos: pagos[0].total, clientes: clientes[0].total } })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
