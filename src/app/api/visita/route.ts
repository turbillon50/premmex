import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const { contrato_id, cobrador_id, resultado, notas='' } = await req.json()
  await sql`INSERT INTO pagos (contrato_id, cobrador_id, monto, metodo, notas)
    SELECT ${contrato_id}, ${cobrador_id}, 0, 'visita', ${resultado||''} || ' ' || ${notas}
    FROM contratos WHERE id=${contrato_id}`
  return NextResponse.json({ ok:true })
}
