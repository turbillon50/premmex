import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cliente_id = searchParams.get('cliente_id')
  if (!cliente_id) return NextResponse.json({error:'cliente_id requerido'},{status:400})
  try {
    const contratos = await sql`SELECT c.*,p.nombre as paquete FROM contratos c JOIN paquetes p ON c.paquete_id=p.id WHERE c.cliente_id=${cliente_id} AND c.activo=true ORDER BY c.created_at DESC`
    const pagos = await sql`SELECT p.*,co.nombre as cobrador FROM pagos p LEFT JOIN cobradores co ON p.cobrador_id=co.id WHERE p.cliente_id=${cliente_id} ORDER BY p.fecha DESC LIMIT 20`
    const bens = await sql`SELECT b.* FROM beneficiarios b JOIN contratos c ON b.contrato_id=c.id WHERE c.cliente_id=${cliente_id} LIMIT 10`
    return NextResponse.json({contratos,pagos,beneficiarios:bens})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
