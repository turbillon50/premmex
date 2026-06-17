import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET() {
  try {
    const [base] = await sql`
      SELECT
        COUNT(ct.id) FILTER (WHERE ct.activo AND ct.estado NOT IN ('liquidado','cancelado')) as contratos,
        COALESCE(SUM(p.monto) FILTER (WHERE DATE(p.fecha)=CURRENT_DATE AND p.monto>0),0) as cobrado_hoy,
        COALESCE(SUM(p.monto) FILTER (WHERE DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW()) AND p.monto>0),0) as cobrado_mes,
        COALESCE(SUM(ct.saldo_pendiente) FILTER (WHERE ct.activo AND ct.estado NOT IN ('liquidado','cancelado')),0) as pendientes
      FROM contratos ct LEFT JOIN pagos p ON p.contrato_id=ct.id`

    const cobradores = await sql`
      SELECT cb.id,cb.nombre,cb.telefono,cb.zona,
        COUNT(DISTINCT ct.id) as contratos_asignados,
        COALESCE(SUM(p.monto) FILTER (WHERE DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW()) AND p.monto>0),0) as cobrado_mes
      FROM cobradores cb
      LEFT JOIN contratos ct ON ct.cobrador_id=cb.id AND ct.activo
      LEFT JOIN pagos p ON p.cobrador_id=cb.id AND p.monto>0
      WHERE cb.activo GROUP BY cb.id ORDER BY cb.nombre`

    const pagos_recientes = await sql`
      SELECT p.monto,p.metodo,p.fecha,cl.nombre as cliente,cb.nombre as cobrador,
        r.folio as recibo_num
      FROM pagos p
      JOIN clientes cl ON cl.id=p.cliente_id
      JOIN cobradores cb ON cb.id=p.cobrador_id
      LEFT JOIN recibos r ON r.pago_id=p.id
      WHERE p.monto>0 ORDER BY p.fecha DESC LIMIT 8`

    return NextResponse.json({ ...base, cobradores, pagos_recientes })
  } catch(e:any) {
    return NextResponse.json({ error:e.message },{status:500})
  }
}
