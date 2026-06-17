import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
const sql = neon('postgresql://neondb_owner:npg_n0apxAbS4FUm@ep-empty-frost-anstbj07-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require')
export async function POST(req: Request) {
  const { nombre, telefono, zona } = await req.json()
  const [cob] = await sql`
    INSERT INTO cobradores (nombre,telefono,zona,registrado)
    VALUES (${nombre},${telefono},${zona},false)
    ON CONFLICT (telefono) DO UPDATE SET nombre=EXCLUDED.nombre,zona=EXCLUDED.zona
    RETURNING id`
  const token = crypto.randomBytes(16).toString('hex')
  await sql`INSERT INTO invitaciones (cobrador_id,token) VALUES (${cob.id},${token}) ON CONFLICT DO NOTHING`
  return NextResponse.json({ ok:true, token, cobrador_id:cob.id })
}
