import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET() {
  const [stats] = await sql`
    SELECT
      COUNT(DISTINCT ct.id) FILTER (WHERE ct.activo AND ct.estado!='liquidado') as contratos_activos,
      COALESCE(SUM(ct.saldo_pendiente) FILTER (WHERE ct.activo AND ct.estado!='liquidado'),0) as saldo_total,
      COALESCE(SUM(p.monto) FILTER (WHERE DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW())),0) as cobrado_mes,
      COUNT(DISTINCT ct.id) FILTER (WHERE ct.estado='atrasado') as en_mora,
      COUNT(DISTINCT cb.id) FILTER (WHERE cb.activo) as cobradores_activos
    FROM contratos ct
    LEFT JOIN pagos p ON p.contrato_id=ct.id AND p.monto>0
    LEFT JOIN cobradores cb ON cb.id=ct.cobrador_id`
  const cobradores = await sql`
    SELECT cb.id,cb.nombre,cb.zona,
      COUNT(ct.id) as contratos,
      COALESCE(SUM(p.monto) FILTER (WHERE DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW())),0) as cobrado_mes
    FROM cobradores cb
    LEFT JOIN contratos ct ON ct.cobrador_id=cb.id AND ct.activo
    LEFT JOIN pagos p ON p.cobrador_id=cb.id AND p.monto>0
    WHERE cb.activo GROUP BY cb.id ORDER BY cb.nombre`
  const mora = await sql`
    SELECT ct.ncontrato,cl.nombre,ct.saldo_pendiente,ct.estado,
      GREATEST(0,EXTRACT(DAY FROM NOW()-(ct.fecha_inicio+INTERVAL '1 month'*ct.meses_pagados))::int) as dias_mora
    FROM contratos ct JOIN clientes cl ON cl.id=ct.cliente_id
    WHERE ct.estado='atrasado' AND ct.activo ORDER BY dias_mora DESC LIMIT 10`
  const ultimos_pagos = await sql`
    SELECT p.monto,p.metodo,p.fecha,cl.nombre as cliente,cb.nombre as cobrador,ct.ncontrato
    FROM pagos p
    JOIN clientes cl ON cl.id=p.cliente_id
    JOIN cobradores cb ON cb.id=p.cobrador_id
    JOIN contratos ct ON ct.id=p.contrato_id
    WHERE p.monto>0 ORDER BY p.fecha DESC LIMIT 8`
  return NextResponse.json({ stats,cobradores,mora,ultimos_pagos })
}
