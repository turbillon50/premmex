import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function POST(req: Request) {
  try {
    const { contrato_id, nuevo_mensual, dia_pago } = await req.json()
    await sql`UPDATE contratos SET monto_mensual=${nuevo_mensual},dia_pago=${dia_pago||5} WHERE id=${contrato_id}`
    return NextResponse.json({ok:true})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
