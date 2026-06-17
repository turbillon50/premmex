import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const { contrato_id, nuevo_monto, nuevas_cuotas } = await req.json()
  await sql`UPDATE contratos SET monto_cuota=${nuevo_monto},num_cuotas=${nuevas_cuotas},estado='al_corriente',updated_at=NOW() WHERE id=${contrato_id}`
  return NextResponse.json({ ok:true })
}
