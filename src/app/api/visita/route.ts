import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const { contrato_id, cobrador_id, resultado, nota, lat, lng } = await req.json()
    await sql`INSERT INTO visitas (contrato_id,cobrador_id,resultado,nota,lat_visita,lng_visita) VALUES (${contrato_id},${cobrador_id},${resultado},${nota||null},${lat||null},${lng||null})`
    return NextResponse.json({ok:true})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
