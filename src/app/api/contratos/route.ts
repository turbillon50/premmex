import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET — devuelve meta para el formulario + último ncontrato y solicitud
export async function GET() {
  try {
    const planes     = await sql`SELECT id, clave, nombre FROM planes WHERE activo = true ORDER BY id`
    const cobradores = await sql`SELECT id, nombre, zona FROM cobradores WHERE activo = true ORDER BY nombre`

    // Último número de contrato (formato PMX-YYYY-NNN → extraer el número)
    const [lastC] = await sql`
      SELECT ncontrato FROM contratos ORDER BY created_at DESC LIMIT 1`
    const lastContrato = lastC?.ncontrato ?? null

    // Último número de solicitud (numérico puro)
    const [lastS] = await sql`
      SELECT solicitud FROM contratos
      WHERE solicitud IS NOT NULL AND solicitud != ''
      ORDER BY created_at DESC LIMIT 1`
    const lastSolicitud = lastS?.solicitud ?? null

    return NextResponse.json({ planes, cobradores, lastContrato, lastSolicitud })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — crear contrato
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nombre, telefono, domicilio, colonia, municipio, estado_civil, ocupacion,
      cobrador_id, plan_id, beneficiario, dia_pago,
      ncontrato, solicitud,
      inversion_inicial, bonificacion, monto_cuota, num_cuotas,
      lat, lng
    } = body
    const latNum = lat !== undefined && lat !== null && String(lat).trim() !== '' ? parseFloat(lat) : null
    const lngNum = lng !== undefined && lng !== null && String(lng).trim() !== '' ? parseFloat(lng) : null

    // Validar ncontrato único
    const [dupN] = await sql`SELECT id FROM contratos WHERE ncontrato = ${ncontrato}`
    if (dupN) throw new Error(`El n° de contrato ${ncontrato} ya fue registrado`)

    // Validar solicitud única si viene
    if (solicitud) {
      const [dupS] = await sql`SELECT id FROM contratos WHERE solicitud = ${solicitud}`
      if (dupS) throw new Error(`La solicitud con esta numeración ya fue registrada`)
    }

    // Crear cliente
    const [cliente] = await sql`
      INSERT INTO clientes (nombre, telefono, domicilio, colonia, municipio, estado_civil, ocupacion, cobrador_id, lat, lng)
      VALUES (${nombre}, ${telefono}, ${domicilio||''}, ${colonia||''}, ${municipio||'Capilla de Guadalupe'}, ${estado_civil||null}, ${ocupacion||null}, ${cobrador_id}, ${latNum}, ${lngNum})
      RETURNING id`

    // Calcular financiero
    const inv    = parseFloat(inversion_inicial) || 0
    const boni   = parseFloat(bonificacion)      || 0
    const cuota  = parseFloat(monto_cuota)       || 0
    const cuotas = parseInt(num_cuotas)          || 10
    const total  = inv + boni + (cuota * cuotas)
    const saldo  = total - inv - boni

    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() + cuotas)

    const [contrato] = await sql`
      INSERT INTO contratos (
        ncontrato, solicitud, cliente_id, plan_id, beneficiario, dia_pago,
        inversion_total, inversion_inicial, bonificacion, saldo_pendiente,
        num_cuotas, monto_cuota, cobrador_id, fecha_limite
      ) VALUES (
        ${ncontrato}, ${solicitud||null}, ${cliente.id}, ${parseInt(plan_id)}, ${beneficiario||null}, ${parseInt(dia_pago)||1},
        ${total}, ${inv}, ${boni}, ${saldo},
        ${cuotas}, ${cuota}, ${cobrador_id}, ${fechaLimite.toISOString().split('T')[0]}
      )
      RETURNING id, ncontrato`

    await sql`UPDATE cobradores SET contratos_asignados = contratos_asignados + 1 WHERE id = ${cobrador_id}`

    return NextResponse.json({ ok: true, ncontrato: contrato.ncontrato, contrato_id: contrato.id })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
