import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET() {
  const por_cobrador = await sql`
    SELECT cb.nombre,cb.zona,
      COUNT(DISTINCT ct.id) as contratos,
      COALESCE(SUM(p.monto) FILTER (WHERE p.monto>0 AND DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW())),0) as cobrado_mes,
      COALESCE(SUM(ct.saldo_pendiente) FILTER (WHERE ct.activo AND ct.estado!='liquidado'),0) as saldo_pendiente
    FROM cobradores cb
    LEFT JOIN contratos ct ON ct.cobrador_id=cb.id
    LEFT JOIN pagos p ON p.cobrador_id=cb.id
    WHERE cb.activo GROUP BY cb.id ORDER BY cobrado_mes DESC`
  const por_plan = await sql`
    SELECT pl.clave,pl.nombre,COUNT(ct.id) as contratos,
      COALESCE(SUM(ct.saldo_pendiente) FILTER (WHERE ct.activo),0) as saldo_total
    FROM planes pl LEFT JOIN contratos ct ON ct.plan_id=pl.id AND ct.activo
    GROUP BY pl.id ORDER BY contratos DESC`
  return NextResponse.json({ por_cobrador,por_plan })
}
