import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon(process.env.DATABASE_URL!)
export async function POST(req: Request) {
  const { contrato_id, cliente_id, cobrador_id, monto, metodo } = await req.json()
  const folio = 'REC-' + Date.now()
  const [pago] = await sql`
    INSERT INTO pagos (contrato_id, cliente_id, cobrador_id, monto, metodo)
    VALUES (${contrato_id}, ${cliente_id}, ${cobrador_id}, ${monto}, ${metodo})
    RETURNING id`
  await sql`
    UPDATE contratos SET
      saldo_pendiente = GREATEST(0, saldo_pendiente - ${monto}),
      meses_pagados = meses_pagados + 1,
      estado = CASE WHEN (saldo_pendiente - ${monto}) <= 0 THEN 'liquidado' ELSE 'al_corriente' END,
      updated_at = NOW()
    WHERE id = ${contrato_id}`
  await sql`INSERT INTO recibos (folio, pago_id, contrato_id, cliente_id, monto)
    VALUES (${folio}, ${pago.id}, ${contrato_id}, ${cliente_id}, ${monto})`
  return NextResponse.json({ ok: true, folio })
}