import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')

export async function GET() {
  try {
    const contratos = await sql`
      SELECT ct.id,ct.ncontrato as folio,cl.nombre as cliente,cl.telefono,
        p.clave as paquete,p.nombre as paquete_nombre,
        ct.inversion_total as total,ct.inversion_inicial as enganche,
        ct.monto_cuota as monto_mensual,ct.tipo_aportacion as frecuencia,
        ct.num_cuotas,ct.meses_pagados as cuotas_pagadas,
        ct.saldo_pendiente,ct.dia_pago,ct.estado,ct.fecha_inicio,
        cb.nombre as cobrador,cb.zona,ct.cobrador_id,
        ct.beneficiario
      FROM contratos ct
      JOIN clientes cl ON cl.id=ct.cliente_id
      JOIN planes p ON p.id=ct.plan_id
      LEFT JOIN cobradores cb ON cb.id=ct.cobrador_id
      WHERE ct.activo ORDER BY ct.created_at DESC`
    const paquetes = await sql`SELECT id,clave,nombre,traslado,ataud FROM planes WHERE activo ORDER BY id`
    const cobradores = await sql`SELECT id,nombre,zona FROM cobradores WHERE activo AND registrado ORDER BY nombre`
    return NextResponse.json({ contratos_list:contratos, contratos, paquetes, cobradores })
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500})
  }
}

export async function POST(req: Request) {
  try {
    const f = await req.json()
    // Crear cliente si no existe
    let cliente_id = f.cliente_id
    if (!cliente_id) {
      const [cl] = await sql`
        INSERT INTO clientes (nombre,telefono,domicilio,colonia,municipio,cobrador_id)
        VALUES (${f.nombre},${f.telefono||''},${f.domicilio||''},${f.colonia||''},${f.municipio||'Capilla de Guadalupe'},${f.cobrador_id||null})
        RETURNING id`
      cliente_id = cl.id
    }

    const total = parseFloat(f.inversion_total||0)
    const enganche = parseFloat(f.enganche_pct||0)/100 * total
    const saldo = total - enganche - parseFloat(f.bonificacion||0)
    const cuotas = parseInt(f.num_cuotas||1)
    const monto_cuota = Math.ceil(saldo/cuotas)
    const ncontrato = 'PMX-' + Date.now().toString().slice(-6)

    const [plan] = await sql`SELECT id FROM planes WHERE clave=${f.paquete} LIMIT 1`

    const [ct] = await sql`
      INSERT INTO contratos (ncontrato,cliente_id,plan_id,beneficiario,cobrador_id,
        inversion_total,inversion_inicial,bonificacion,saldo_pendiente,
        num_cuotas,monto_cuota,tipo_aportacion,dia_pago,fecha_inicio,fecha_limite)
      VALUES (${ncontrato},${cliente_id},${plan?.id||1},${f.beneficiario||''},${f.cobrador_id||null},
        ${total},${enganche},${parseFloat(f.bonificacion||0)},${saldo},
        ${cuotas},${monto_cuota},${f.frecuencia||'semanal'},${parseInt(f.dia_pago||1)},
        CURRENT_DATE, CURRENT_DATE + (${cuotas} || ' weeks')::interval)
      RETURNING id,ncontrato`

    return NextResponse.json({ ok:true, folio:ct.ncontrato, id:ct.id })
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500})
  }
}
