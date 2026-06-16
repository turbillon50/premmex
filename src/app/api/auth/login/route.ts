// src/app/api/auth/login/route.ts
import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  const { telefono, password } = await req.json()

  // Buscar en admins
  const admins = await sql`
    SELECT id, nombre, telefono, 'admin' as rol FROM admins
    WHERE telefono = ${telefono} AND password = ${password}
    LIMIT 1`

  if (admins.length > 0) {
    return NextResponse.json({ ok: true, rol: 'admin', user: admins[0] })
  }

  // Buscar en cobradores
  const cobradores = await sql`
    SELECT id, nombre, telefono, zona, 'cobrador' as rol FROM cobradores
    WHERE telefono = ${telefono} AND password = ${password} AND activo = true AND registrado = true
    LIMIT 1`

  if (cobradores.length > 0) {
    return NextResponse.json({ ok: true, rol: 'cobrador', user: cobradores[0] })
  }

  return NextResponse.json({ ok: false, error: 'Teléfono o contraseña incorrectos' })
}
