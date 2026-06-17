import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const body = await req.json()
  const { pin, adminPass, telefono, password } = body

  // Admin por password directo
  if (adminPass || (telefono && password)) {
    const pass = adminPass || password
    const tel = telefono || '3916100449'
    const r = await sql`SELECT id,nombre,telefono FROM admins WHERE (telefono=${tel} OR ${!telefono}) AND password=${pass} LIMIT 1`
    if (r.length) return NextResponse.json({ ok:true, rol:'admin', cobrador:r[0] })
    return NextResponse.json({ error:'Contraseña incorrecta' }, { status:401 })
  }

  // Cobrador por PIN
  if (pin) {
    const r = await sql`SELECT id,nombre,telefono,zona FROM cobradores WHERE password=${pin} AND activo=true AND registrado=true LIMIT 1`
    if (r.length) return NextResponse.json({ cobrador:r[0] })
    return NextResponse.json({ error:'PIN incorrecto' }, { status:401 })
  }

  return NextResponse.json({ error:'Datos inválidos' }, { status:400 })
}
