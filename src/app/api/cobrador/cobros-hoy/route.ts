import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'
const sql = neon(process.env.DATABASE_URL!)
export async function GET(req: NextRequest) {
  const cobrador_id = new URL(req.url).searchParams.get('cobrador_id')
  const cobros = await sql`
    SELECT pg.*, cl.nombre as cliente_nombre, ct.ncontrato
    FROM pagos pg
    LEFT JOIN clientes cl ON cl.id = pg.cliente_id
    LEFT JOIN contratos ct ON ct.id = pg.contrato_id
    WHERE pg.cobrador_id = ${cobrador_id} AND DATE(pg.fecha) = CURRENT_DATE
    ORDER BY pg.fecha DESC`
  return NextResponse.json({ data: cobros })
}