import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'
const sql = neon(process.env.DATABASE_URL!)
export async function GET(req: NextRequest) {
  const cobrador_id = new URL(req.url).searchParams.get('cobrador_id')
  const ruta = await sql`
    SELECT ct.id as contrato_id, ct.ncontrato, ct.monto_cuota, ct.saldo_pendiente, ct.estado,
      ct.dia_pago, ct.meses_pagados, ct.fecha_inicio,
      cl.id as cliente_id, cl.nombre as cliente_nombre, cl.telefono, cl.domicilio, cl.colonia,
      p.clave as plan_clave,
      GREATEST(0, EXTRACT(DAY FROM NOW() - (ct.fecha_inicio + INTERVAL '1 month' * ct.meses_pagados))::int) as dias_mora
    FROM contratos ct
    LEFT JOIN clientes cl ON cl.id = ct.cliente_id
    LEFT JOIN planes p ON p.id = ct.plan_id
    WHERE ct.cobrador_id = ${cobrador_id}
      AND ct.activo = true AND ct.estado != 'liquidado' AND ct.saldo_pendiente > 0
    ORDER BY cl.nombre ASC`
  return NextResponse.json({ data: ruta })
}