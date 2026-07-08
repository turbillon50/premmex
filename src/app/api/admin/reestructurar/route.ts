import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST — reestructura el contrato: nueva aportacion y/o dia de pago.
// Recalcula el numero de aportaciones restantes segun el saldo pendiente.
export async function POST(req: Request) {
  try {
    const { contrato_id, nuevo_mensual, dia_pago } = await req.json()
    if (!contrato_id) return NextResponse.json({ error: 'contrato_id requerido' }, { status: 400 })

    const [ct] = await sql`SELECT saldo_pendiente, monto_cuota, num_cuotas, dia_pago FROM contratos WHERE id=${contrato_id}`
    if (!ct) return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })

    const saldo = parseFloat(ct.saldo_pendiente) || 0
    const nuevaCuota = parseFloat(nuevo_mensual) > 0 ? parseFloat(nuevo_mensual) : (parseFloat(ct.monto_cuota) || 0)
    const nuevasCuotas = nuevaCuota > 0 && saldo > 0 ? Math.ceil(saldo / nuevaCuota) : (parseInt(ct.num_cuotas) || 1)
    const nuevoDia = dia_pago ? parseInt(dia_pago) : (parseInt(ct.dia_pago) || 1)

    await sql`UPDATE contratos SET
      monto_cuota = ${nuevaCuota},
      num_cuotas = ${nuevasCuotas},
      dia_pago = ${nuevoDia},
      estado = 'al_corriente', activo = true, updated_at = NOW()
      WHERE id = ${contrato_id}`

    return NextResponse.json({ ok: true, monto_cuota: nuevaCuota, num_cuotas: nuevasCuotas })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
