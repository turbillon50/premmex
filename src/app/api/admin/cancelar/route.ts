import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST — cambia el estado del contrato: cancelar / suspender / reactivar
// Regla de negocio (clausula tercera): al cancelar, lo invertido queda como
// deposito a favor del titular (inversion inicial + aportaciones pagadas).
export async function POST(req: Request) {
  try {
    const { contrato_id, motivo = '', accion = 'cancelar' } = await req.json()
    if (!contrato_id) return NextResponse.json({ error: 'contrato_id requerido' }, { status: 400 })

    if (accion === 'suspender') {
      await sql`UPDATE contratos SET estado='suspendido', motivo_cancelacion=${motivo}, updated_at=NOW() WHERE id=${contrato_id}`
      return NextResponse.json({ ok: true, estado: 'suspendido' })
    }

    if (accion === 'reactivar') {
      await sql`UPDATE contratos SET estado='al_corriente', activo=true, motivo_cancelacion=NULL, updated_at=NOW() WHERE id=${contrato_id}`
      return NextResponse.json({ ok: true, estado: 'al_corriente' })
    }

    // Cancelar: calcular deposito a favor
    const [ct] = await sql`SELECT inversion_inicial FROM contratos WHERE id=${contrato_id}`
    if (!ct) return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 })
    const [pg] = await sql`SELECT COALESCE(SUM(monto),0) AS pagado FROM pagos WHERE contrato_id=${contrato_id} AND monto>0`
    const deposito = (parseFloat(ct.inversion_inicial) || 0) + (parseFloat(pg?.pagado) || 0)

    await sql`UPDATE contratos SET estado='cancelado', activo=false, motivo_cancelacion=${motivo},
      deposito_favor=${deposito}, updated_at=NOW() WHERE id=${contrato_id}`

    return NextResponse.json({ ok: true, estado: 'cancelado', deposito_favor: deposito })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
