import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { pin, adminPass } = await req.json()
    if (adminPass) {
      if (adminPass === (process.env.ADMIN_PASS || 'premmex2025')) {
        return NextResponse.json({ ok: true, role: 'admin', nombre: 'Administrador' })
      }
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }
    if (!pin) return NextResponse.json({ error: 'PIN requerido' }, { status: 400 })
    const rows = await sql`SELECT id, nombre, zona FROM cobradores WHERE pin = ${pin} AND activo = true LIMIT 1`
    if (rows.length === 0) return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 })
    return NextResponse.json({ ok: true, role: 'cobrador', cobrador: rows[0] })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
