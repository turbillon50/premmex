import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const { telefono, folio, pin } = await req.json()
    let rows
    if (folio) {
      rows = await sql`SELECT us.*, cl.nombre, cl.id as cliente_id FROM usuarios_socio us JOIN clientes cl ON us.cliente_id=cl.id JOIN contratos ct ON ct.cliente_id=cl.id WHERE ct.folio=${folio} AND us.pin=${pin} LIMIT 1`
    } else {
      rows = await sql`SELECT us.*, cl.nombre, cl.id as cliente_id FROM usuarios_socio us JOIN clientes cl ON us.cliente_id=cl.id WHERE us.telefono=${telefono} AND us.pin=${pin} AND us.activo=true LIMIT 1`
    }
    if (!rows.length) return NextResponse.json({error:'PIN incorrecto'},{status:401})
    const s = rows[0]
    const contratos = await sql`SELECT c.*,p.nombre as paquete,p.servicios FROM contratos c JOIN paquetes p ON c.paquete_id=p.id WHERE c.cliente_id=${s.cliente_id} AND c.activo=true ORDER BY c.created_at DESC`
    return NextResponse.json({ok:true,socio:{id:s.id,nombre:s.nombre,cliente_id:s.cliente_id,telefono:s.telefono},contratos})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
