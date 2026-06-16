import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const [
      statsRes, cobradores, clientes, contratos, pagos, mora, ultimosPagos
    ] = await Promise.all([
      // Stats generales
      sql`SELECT
        COUNT(CASE WHEN c.activo = true AND c.estado != 'liquidado' THEN 1 END) as "totalContratos",
        COALESCE(SUM(CASE WHEN c.activo = true AND c.estado != 'liquidado' THEN c.saldo_pendiente END), 0) as "totalSaldo",
        COUNT(CASE WHEN c.dias_mora > 0 AND c.estado = 'atrasado' THEN 1 END) as "conMora"
        FROM (
          SELECT c.*,
            GREATEST(0, EXTRACT(DAY FROM NOW() - (c.fecha_inicio + INTERVAL '1 month' * c.meses_pagados))::int) as dias_mora
          FROM contratos c
        ) c`,

      // Cobrado este mes
      sql`SELECT COALESCE(SUM(monto), 0) as total
        FROM pagos
        WHERE DATE_TRUNC('month', fecha) = DATE_TRUNC('month', NOW())`,

      // Cobradores con stats
      sql`SELECT cb.*,
        COUNT(DISTINCT ct.id) as total_contratos,
        COUNT(DISTINCT CASE WHEN ct.estado = 'atrasado' THEN ct.id END) as con_mora
        FROM cobradores cb
        LEFT JOIN contratos ct ON ct.cobrador_id = cb.id AND ct.activo = true
        WHERE cb.activo = true
        GROUP BY cb.id ORDER BY cb.nombre`,

      // Clientes con cobrador
      sql`SELECT cl.*, cb.nombre as cobrador_nombre
        FROM clientes cl
        LEFT JOIN cobradores cb ON cb.id = cl.cobrador_id
        WHERE cl.activo = true ORDER BY cl.nombre`,

      // Contratos con cliente, plan y cobrador
      sql`SELECT ct.*, cl.nombre as cliente_nombre, cl.telefono,
        p.clave as plan_clave, p.nombre as plan_nombre,
        cb.nombre as cobrador_nombre
        FROM contratos ct
        LEFT JOIN clientes cl ON cl.id = ct.cliente_id
        LEFT JOIN planes p ON p.id = ct.plan_id
        LEFT JOIN cobradores cb ON cb.id = ct.cobrador_id
        WHERE ct.activo = true
        ORDER BY ct.created_at DESC`,

      // Pagos recientes
      sql`SELECT pg.*, cl.nombre as cliente_nombre, cb.nombre as cobrador_nombre, ct.ncontrato
        FROM pagos pg
        LEFT JOIN clientes cl ON cl.id = pg.cliente_id
        LEFT JOIN cobradores cb ON cb.id = pg.cobrador_id
        LEFT JOIN contratos ct ON ct.id = pg.contrato_id
        ORDER BY pg.fecha DESC LIMIT 30`,

      // Mora
      sql`SELECT ct.*, cl.nombre as cliente_nombre, p.clave as plan_clave,
        GREATEST(0, EXTRACT(DAY FROM NOW() - (ct.fecha_inicio + INTERVAL '1 month' * ct.meses_pagados))::int) as dias_mora
        FROM contratos ct
        LEFT JOIN clientes cl ON cl.id = ct.cliente_id
        LEFT JOIN planes p ON p.id = ct.plan_id
        WHERE ct.estado = 'atrasado' AND ct.activo = true
        ORDER BY dias_mora DESC`,

      // Ultimos pagos para dashboard
      sql`SELECT pg.*, cl.nombre as cliente_nombre, cb.nombre as cobrador_nombre
        FROM pagos pg
        LEFT JOIN clientes cl ON cl.id = pg.cliente_id
        LEFT JOIN cobradores cb ON cb.id = pg.cobrador_id
        ORDER BY pg.fecha DESC LIMIT 5`,
    ])

    const stats = statsRes[0] || {}

    return NextResponse.json({
      data: {
        totalContratos: stats.totalContratos || 0,
        totalSaldo: stats.totalSaldo || 0,
        cobradoMes: (cobradores as any)[0]?.total || 0,
        conMora: stats.conMora || 0,
        cobradores,
        clientes,
        contratos,
        pagos,
        mora,
        ultimosPagos,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
