import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST — nuevo lead desde la landing pública
export async function POST(req: Request) {
  try {
    const { nombre, telefono, domicilio, mensaje } = await req.json()
    if (!nombre || !nombre.trim()) return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    const [lead] = await sql`
      INSERT INTO leads (nombre, telefono, domicilio, mensaje)
      VALUES (${nombre.trim()}, ${telefono || ''}, ${domicilio || ''}, ${mensaje || ''})
      RETURNING id`
    return NextResponse.json({ ok: true, id: lead.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// GET — lista de leads (admin)
export async function GET() {
  try {
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`
    return NextResponse.json({ leads })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PATCH — cambiar estado de un lead
export async function PATCH(req: Request) {
  try {
    const { id, estado } = await req.json()
    const validos = ['nuevo', 'contactado', 'convertido', 'descartado']
    if (!id || !validos.includes(estado)) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    await sql`UPDATE leads SET estado = ${estado} WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
