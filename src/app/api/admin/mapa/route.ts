import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET — todos los clientes geolocalizados con su estado de pago y cobrador
export async function GET() {
  try {
    const clientes = await sql`
      SELECT cl.id, cl.nombre, cl.lat, cl.lng, cl.domicilio AS direccion, cl.colonia,
        cl.cobrador_id, cb.nombre AS cobrador_nombre, cb.zona,
        COALESCE(SUM(ct.saldo_pendiente) FILTER (WHERE ct.activo),0) AS saldo,
        COALESCE(bool_or(ct.estado='atrasado') FILTER (WHERE ct.activo), false) AS atrasado,
        COUNT(ct.id) FILTER (WHERE ct.activo) AS num_contratos
      FROM clientes cl
      LEFT JOIN cobradores cb ON cb.id = cl.cobrador_id
      LEFT JOIN contratos ct ON ct.cliente_id = cl.id
      WHERE cl.lat IS NOT NULL AND cl.lng IS NOT NULL AND cl.activo = true
      GROUP BY cl.id, cb.nombre, cb.zona
      ORDER BY cl.nombre`
    const cobradores = await sql`SELECT id, nombre, zona FROM cobradores WHERE activo = true ORDER BY nombre`
    return NextResponse.json({ clientes, cobradores })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
