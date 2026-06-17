import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function GET(req: NextRequest) {
  try {
    const cobrador_id = new URL(req.url).searchParams.get('cobrador_id')
    const ruta = await sql`
      SELECT ct.id as contrato_id, ct.ncontrato, ct.monto_cuota as monto_mensual,
        ct.saldo_pendiente, ct.estado, ct.dia_pago, ct.tipo_aportacion as frecuencia,
        cl.id as cliente_id, cl.nombre, cl.telefono, cl.domicilio as direccion,
        cl.colonia, cl.municipio,
        p.clave as paquete, p.nombre as paquete_nombre,
        GREATEST(0, EXTRACT(DAY FROM NOW()-(ct.fecha_inicio+INTERVAL '1 week'*ct.meses_pagados))::int) as dias_mora,
        ct.meses_pagados as semanas_pagadas,
        NULL::float as lat, NULL::float as lng
      FROM contratos ct
      JOIN clientes cl ON cl.id=ct.cliente_id
      JOIN planes p ON p.id=ct.plan_id
      WHERE ct.cobrador_id=${cobrador_id}
        AND ct.activo AND ct.estado!='liquidado' AND ct.estado!='cancelado'
        AND ct.saldo_pendiente>0
      ORDER BY CASE ct.estado WHEN 'atrasado' THEN 0 ELSE 1 END, cl.nombre ASC`
    return NextResponse.json({ ruta })
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500})
  }
}
