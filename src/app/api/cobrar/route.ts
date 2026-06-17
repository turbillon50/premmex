import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const { contrato_id, cobrador_id, monto, metodo='efectivo', notas='' } = await req.json()
  const folio = 'REC-' + Date.now()
  const ct = await sql`SELECT cliente_id, saldo_pendiente FROM contratos WHERE id=${contrato_id} LIMIT 1`
  if (!ct.length) return NextResponse.json({ error:'Contrato no encontrado' },{status:404})
  const cliente_id = ct[0].cliente_id
  const nuevoSaldo = Math.max(0, parseFloat(ct[0].saldo_pendiente) - parseFloat(monto))
  const [pago] = await sql`
    INSERT INTO pagos (contrato_id, cliente_id, cobrador_id, monto, metodo, notas)
    VALUES (${contrato_id}, ${cliente_id}, ${cobrador_id}, ${monto}, ${metodo}, ${notas})
    RETURNING id`
  await sql`UPDATE contratos SET
    saldo_pendiente=${nuevoSaldo},
    meses_pagados=meses_pagados+1,
    estado=CASE WHEN ${nuevoSaldo}<=0 THEN 'liquidado' ELSE 'al_corriente' END,
    updated_at=NOW()
    WHERE id=${contrato_id}`
  await sql`INSERT INTO recibos (folio,pago_id,contrato_id,cliente_id,monto) VALUES (${folio},${pago.id},${contrato_id},${cliente_id},${monto})`
  return NextResponse.json({ ok:true, folio, recibo:{ folio, monto, metodo, fecha: new Date().toISOString() } })
}
