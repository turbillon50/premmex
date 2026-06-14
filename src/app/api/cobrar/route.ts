import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { contrato_id, cliente_id, cobrador_id, monto, metodo } = await req.json()
    // Generar numero de recibo
    const [{ nextval }] = await sql`SELECT NEXTVAL('recibo_seq') as nextval`
    const recibo_num = 'REC-' + String(nextval).padStart(5,'0')
    // Insertar pago
    await sql`INSERT INTO pagos (contrato_id, cliente_id, cobrador_id, monto, metodo, recibo_num)
      VALUES (${contrato_id}, ${cliente_id}, ${cobrador_id}, ${monto}, ${metodo}, ${recibo_num})`
    // Actualizar contrato
    await sql`UPDATE contratos SET
      saldo_pendiente = GREATEST(0, saldo_pendiente - ${monto}),
      meses_pagados = meses_pagados + 1,
      estado = CASE WHEN (saldo_pendiente - ${monto}) <= 0 THEN 'liquidado' ELSE 'al_corriente' END
      WHERE id = ${contrato_id}`
    // Actualizar cobrador
    await sql`UPDATE cobradores SET cobrado_mes = cobrado_mes + ${monto} WHERE id = ${cobrador_id}`
    return NextResponse.json({ ok: true, recibo_num })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
