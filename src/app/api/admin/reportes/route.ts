import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Resumen global de cobranza
    const [resumen] = await sql`
      SELECT
        COALESCE(SUM(monto) FILTER (WHERE DATE(fecha)=CURRENT_DATE AND monto>0),0) AS cobrado_hoy,
        COALESCE(SUM(monto) FILTER (WHERE fecha>=NOW()-INTERVAL '7 days' AND monto>0),0) AS cobrado_semana,
        COALESCE(SUM(monto) FILTER (WHERE DATE_TRUNC('month',fecha)=DATE_TRUNC('month',NOW()) AND monto>0),0) AS cobrado_mes
      FROM pagos`

    // Cobranza por cobrador: hoy / semana / mes
    const cobranza_cobrador = await sql`
      SELECT cb.id, cb.nombre, cb.zona,
        COALESCE(SUM(p.monto) FILTER (WHERE DATE(p.fecha)=CURRENT_DATE AND p.monto>0),0) AS hoy,
        COALESCE(SUM(p.monto) FILTER (WHERE p.fecha>=NOW()-INTERVAL '7 days' AND p.monto>0),0) AS semana,
        COALESCE(SUM(p.monto) FILTER (WHERE DATE_TRUNC('month',p.fecha)=DATE_TRUNC('month',NOW()) AND p.monto>0),0) AS mes,
        COUNT(DISTINCT ct.id) FILTER (WHERE ct.activo AND ct.estado NOT IN ('liquidado','cancelado')) AS contratos_activos
      FROM cobradores cb
      LEFT JOIN pagos p ON p.cobrador_id=cb.id
      LEFT JOIN contratos ct ON ct.cobrador_id=cb.id
      WHERE cb.activo
      GROUP BY cb.id ORDER BY mes DESC`

    // Contratos atrasados: dias de atraso + monto vencido (aportaciones vencidas segun dia de pago)
    const atrasados = await sql`
      SELECT ct.id, ct.ncontrato AS folio, ct.saldo_pendiente, ct.monto_cuota, ct.dia_pago,
        cl.nombre AS cliente, cl.telefono, cb.nombre AS cobrador,
        GREATEST(0, EXTRACT(DAY FROM NOW()-(ct.fecha_inicio+INTERVAL '1 month'*ct.meses_pagados))::int) AS dias_atraso,
        GREATEST(0, EXTRACT(DAY FROM NOW()-(ct.fecha_inicio+INTERVAL '1 month'*ct.meses_pagados))::int / 30) * ct.monto_cuota AS monto_vencido
      FROM contratos ct
      LEFT JOIN clientes cl ON cl.id=ct.cliente_id
      LEFT JOIN cobradores cb ON cb.id=ct.cobrador_id
      WHERE ct.activo AND ct.estado='atrasado'
      ORDER BY dias_atraso DESC`

    // Proyeccion de ingresos por aportaciones pactadas (contratos activos por cobrar)
    const [proy] = await sql`
      SELECT
        COALESCE(SUM(monto_cuota) FILTER (WHERE tipo_aportacion='mensual'),0)
          + COALESCE(SUM(monto_cuota*4) FILTER (WHERE tipo_aportacion='semanal'),0)
          + COALESCE(SUM(monto_cuota*2) FILTER (WHERE tipo_aportacion='quincenal'),0) AS proyeccion_mensual,
        COALESCE(SUM(saldo_pendiente),0) AS total_por_cobrar,
        COUNT(*) AS contratos_por_cobrar
      FROM contratos
      WHERE activo AND estado NOT IN ('liquidado','cancelado') AND saldo_pendiente>0`

    // Estado de cartera
    const cartera = await sql`
      SELECT estado, COUNT(*) AS total, COALESCE(SUM(saldo_pendiente),0) AS saldo
      FROM contratos WHERE activo GROUP BY estado ORDER BY total DESC`

    return NextResponse.json({
      resumen: resumen || {},
      cobranza_cobrador,
      atrasados,
      proyeccion: proy || {},
      cartera,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
