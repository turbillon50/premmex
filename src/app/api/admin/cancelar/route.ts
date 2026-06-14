import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const { contrato_id, motivo } = await req.json()
    await sql`UPDATE contratos SET activo=false,estado='cancelado',notas=${motivo||''} WHERE id=${contrato_id}`
    return NextResponse.json({ok:true})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
