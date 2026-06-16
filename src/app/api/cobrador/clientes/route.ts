import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'
const sql = neon(process.env.DATABASE_URL!)
export async function GET(req: NextRequest) {
  const cobrador_id = new URL(req.url).searchParams.get('cobrador_id')
  const clientes = await sql`
    SELECT cl.*, p.clave as plan_clave, ct.monto_cuota, ct.estado, ct.saldo_pendiente, ct.ncontrato
    FROM clientes cl
    LEFT JOIN contratos ct ON ct.cliente_id = cl.id AND ct.activo = true
    LEFT JOIN planes p ON p.id = ct.plan_id
    WHERE cl.cobrador_id = ${cobrador_id} AND cl.activo = true
    ORDER BY cl.nombre ASC`
  return NextResponse.json({ data: clientes })
}