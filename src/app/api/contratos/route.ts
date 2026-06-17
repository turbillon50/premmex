import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET() {
  const contratos = await sql`
    SELECT ct.*,cl.nombre as cliente_nombre,cl.telefono,
      p.clave as plan_clave,cb.nombre as cobrador_nombre,cb.zona
    FROM contratos ct
    JOIN clientes cl ON cl.id=ct.cliente_id
    JOIN planes p ON p.id=ct.plan_id
    LEFT JOIN cobradores cb ON cb.id=ct.cobrador_id
    WHERE ct.activo ORDER BY ct.created_at DESC`
  return NextResponse.json({ contratos })
}
