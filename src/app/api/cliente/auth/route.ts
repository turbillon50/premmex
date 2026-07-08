import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// Login del socio: por telefono o por numero de contrato (folio),
// con PIN = ultimos 4 digitos de su telefono registrado.
export async function POST(req: Request) {
  try {
    const { telefono, folio, pin } = await req.json()
    if (!pin || String(pin).length < 4) return NextResponse.json({ error: 'PIN inválido' }, { status: 400 })

    let cliente
    if (folio) {
      const [row] = await sql`
        SELECT DISTINCT cl.id, cl.nombre, cl.telefono
        FROM clientes cl JOIN contratos ct ON ct.cliente_id = cl.id
        WHERE ct.ncontrato = ${folio} AND cl.activo = true LIMIT 1`
      cliente = row
    } else {
      const tel = String(telefono || '').replace(/\D/g, '')
      const [row] = await sql`
        SELECT id, nombre, telefono FROM clientes
        WHERE regexp_replace(telefono, '\\D', '', 'g') = ${tel} AND activo = true LIMIT 1`
      cliente = row
    }

    if (!cliente) return NextResponse.json({ error: 'No encontramos tus datos. Verifica e intenta de nuevo.' }, { status: 401 })

    const ult4 = String(cliente.telefono || '').replace(/\D/g, '').slice(-4)
    if (ult4 !== String(pin)) return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 })

    const contratos = await sql`
      SELECT ct.id, ct.ncontrato AS folio, ct.estado, ct.dia_pago, ct.beneficiario,
        ct.monto_cuota AS monto_mensual, ct.saldo_pendiente, ct.inversion_total AS monto_total,
        p.nombre AS paquete
      FROM contratos ct LEFT JOIN planes p ON p.id = ct.plan_id
      WHERE ct.cliente_id = ${cliente.id} AND ct.activo = true
      ORDER BY ct.created_at DESC`

    return NextResponse.json({
      ok: true,
      socio: { id: cliente.id, nombre: cliente.nombre, cliente_id: cliente.id, telefono: cliente.telefono },
      contratos,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
