import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const num = searchParams.get('num')
  if (!num) return NextResponse.json({error:'num requerido'},{status:400})
  try {
    const rows = await sql`SELECT p.*,cl.nombre as cliente,cl.telefono,co.nombre as cobrador,ct.folio,ct.saldo_pendiente,pk.nombre as paquete FROM pagos p JOIN clientes cl ON p.cliente_id=cl.id JOIN cobradores co ON p.cobrador_id=co.id JOIN contratos ct ON p.contrato_id=ct.id JOIN paquetes pk ON ct.paquete_id=pk.id WHERE p.recibo_num=${num} LIMIT 1`
    if (!rows.length) return NextResponse.json({error:'No encontrado'},{status:404})
    return NextResponse.json(rows[0])
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
