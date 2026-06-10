import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function getContratos() {
  return await sql`SELECT * FROM contratos ORDER BY created_at DESC LIMIT 20`
}

export async function getClientes() {
  return await sql`SELECT * FROM clientes ORDER BY nombre ASC LIMIT 20`
}

export async function getCobradores() {
  return await sql`SELECT * FROM cobradores ORDER BY nombre ASC`
}

export async function getPagos() {
  return await sql`SELECT p.*, c.nombre as cliente_nombre, co.nombre as cobrador_nombre 
    FROM pagos p 
    LEFT JOIN clientes c ON p.cliente_id = c.id
    LEFT JOIN cobradores co ON p.cobrador_id = co.id
    ORDER BY p.fecha DESC LIMIT 30`
}

export async function getStats() {
  const [contratos] = await sql`SELECT COUNT(*) as total, SUM(monto_mensual) as recaudacion FROM contratos WHERE activo = true`
  const [pendientes] = await sql`SELECT COUNT(*) as total FROM contratos WHERE activo = true AND saldo_pendiente > 0`
  const [cobrados_hoy] = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE(fecha) = CURRENT_DATE`
  return { contratos, pendientes, cobrados_hoy }
}

export { sql }
