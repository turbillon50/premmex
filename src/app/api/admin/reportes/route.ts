import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET() {
  try {
    const por_mes = await sql`
      SELECT TO_CHAR(DATE_TRUNC('month',p.fecha),'Mon YYYY') as mes,
        COALESCE(SUM(p.monto) FILTER (WHERE p.monto>0),0) as cobrado,
        COUNT(p.id) FILTER (WHERE p.monto>0) as cobros
      FROM pagos p
      WHERE p.fecha >= NOW()-INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month',p.fecha) ORDER BY DATE_TRUNC('month',p.fecha)`

    const por_paquete = await sql`
      SELECT pl.clave,pl.nombre,
        COUNT(ct.id) as contratos,
        COALESCE(SUM(ct.inversion_total),0) as total_vendido
      FROM planes pl LEFT JOIN contratos ct ON ct.plan_id=pl.id AND ct.activo
      GROUP BY pl.id ORDER BY contratos DESC`

    const cobrado_semana = await sql`
      SELECT COALESCE(SUM(monto) FILTER (WHERE monto>0),0) as total
      FROM pagos WHERE fecha>=NOW()-INTERVAL '7 days'`

    return NextResponse.json({ por_mes, por_paquete, cobrado_semana:cobrado_semana[0]?.total||0 })
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500})
  }
}
