import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const clientes = await sql`SELECT cl.*,co.nombre as cobrador_nombre,co.zona,COUNT(ct.id)::int as num_contratos FROM clientes cl LEFT JOIN cobradores co ON cl.cobrador_id=co.id LEFT JOIN contratos ct ON ct.cliente_id=cl.id GROUP BY cl.id,co.nombre,co.zona ORDER BY cl.nombre`
    return NextResponse.json({clientes})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
