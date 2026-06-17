import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const { pin, telefono, password } = await req.json()
  // Admin por telefono+password
  if (telefono && password) {
    const r = await sql`SELECT id,nombre,telefono,'admin' as rol FROM admins WHERE telefono=${telefono} AND password=${password} LIMIT 1`
    if (r.length) return NextResponse.json({ ok:true, rol:'admin', cobrador:r[0] })
  }
  // Cobrador por PIN (últimos 4 dígitos del teléfono)
  if (pin) {
    const r = await sql`SELECT id,nombre,telefono,zona FROM cobradores WHERE password=${pin} AND activo=true AND registrado=true LIMIT 1`
    if (r.length) return NextResponse.json({ cobrador:r[0] })
    return NextResponse.json({ error:'PIN incorrecto' }, { status:401 })
  }
  return NextResponse.json({ error:'Datos inválidos' }, { status:400 })
}
