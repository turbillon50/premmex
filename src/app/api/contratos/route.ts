import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET — meta para el formulario + lista de contratos + numeraciones existentes (validacion en vivo)
export async function GET() {
  try {
    const planes     = await sql`SELECT id, clave, nombre FROM planes WHERE activo = true ORDER BY id`
    const cobradores = await sql`SELECT id, nombre, zona FROM cobradores WHERE activo = true ORDER BY nombre`

    // Lista de contratos con datos de cliente, plan y cobrador (forma que consume AdminApp)
    const contratos = await sql`
      SELECT ct.id, ct.ncontrato AS folio, ct.solicitud, ct.estado, ct.dia_pago,
        ct.monto_cuota AS monto_mensual, ct.saldo_pendiente,
        ct.inversion_total AS monto_total, ct.inversion_inicial, ct.bonificacion,
        ct.num_cuotas, ct.tipo_aportacion, ct.beneficiario, ct.deposito_favor,
        ct.motivo_cancelacion, ct.created_at,
        cl.nombre AS cliente, cl.telefono, cl.domicilio AS direccion, cl.colonia, cl.municipio,
        p.clave AS plan_clave, p.nombre AS paquete,
        cb.nombre AS cobrador, cb.zona
      FROM contratos ct
      LEFT JOIN clientes cl ON cl.id = ct.cliente_id
      LEFT JOIN planes p ON p.id = ct.plan_id
      LEFT JOIN cobradores cb ON cb.id = ct.cobrador_id
      ORDER BY ct.created_at DESC`

    // Numeraciones existentes para validacion de duplicado en tiempo real
    const nums = await sql`SELECT ncontrato, solicitud FROM contratos`
    const ncontratos = nums.map((r: any) => r.ncontrato).filter(Boolean)
    const solicitudes = nums.map((r: any) => String(r.solicitud)).filter((s: string) => s && s !== 'null')

    // Ultimos para sugerir el siguiente
    const [lastC] = await sql`SELECT ncontrato FROM contratos ORDER BY created_at DESC LIMIT 1`
    const [lastS] = await sql`SELECT solicitud FROM contratos WHERE solicitud IS NOT NULL AND solicitud != '' ORDER BY created_at DESC LIMIT 1`

    return NextResponse.json({
      planes, cobradores, contratos,
      existentes: { ncontratos, solicitudes },
      lastContrato: lastC?.ncontrato ?? null,
      lastSolicitud: lastS?.solicitud ?? null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — crear contrato con matematica financiera blindada:
//   saldo = inversion_total - (inversion_inicial + bonificacion)
//   aportacion = saldo / num_cuotas
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      nombre, telefono, domicilio, colonia, municipio, estado_civil, ocupacion,
      cobrador_id, plan_id, beneficiario, dia_pago,
      ncontrato, solicitud,
      inversion_total, inversion_inicial, bonificacion, num_cuotas, tipo_aportacion,
      lat, lng
    } = body

    if (!ncontrato || !String(ncontrato).trim()) throw new Error('El n° de contrato es requerido')

    // Validar ncontrato único
    const [dupN] = await sql`SELECT id FROM contratos WHERE ncontrato = ${ncontrato}`
    if (dupN) throw new Error(`El n° de contrato ${ncontrato} ya fue registrado`)

    // Validar solicitud única si viene
    if (solicitud) {
      const [dupS] = await sql`SELECT id FROM contratos WHERE solicitud = ${solicitud}`
      if (dupS) throw new Error(`La solicitud ${solicitud} ya fue registrada`)
    }

    // Matematica financiera (regla confirmada 18-jun)
    const total  = parseFloat(inversion_total)   || 0
    const inv    = parseFloat(inversion_inicial) || 0   // puede ser 0
    const boni   = parseFloat(bonificacion)      || 0
    const cuotas = parseInt(num_cuotas)          || 1
    if (total <= 0) throw new Error('La inversión total del plan es requerida')
    const saldo  = Math.max(0, total - inv - boni)
    const cuota  = cuotas > 0 ? Math.round((saldo / cuotas) * 100) / 100 : 0

    const latNum = lat !== undefined && lat !== null && String(lat).trim() !== '' ? parseFloat(lat) : null
    const lngNum = lng !== undefined && lng !== null && String(lng).trim() !== '' ? parseFloat(lng) : null

    // Crear cliente
    const [cliente] = await sql`
      INSERT INTO clientes (nombre, telefono, domicilio, colonia, municipio, estado_civil, ocupacion, cobrador_id, lat, lng)
      VALUES (${nombre}, ${telefono}, ${domicilio||''}, ${colonia||''}, ${municipio||'Capilla de Guadalupe'}, ${estado_civil||null}, ${ocupacion||null}, ${cobrador_id}, ${latNum}, ${lngNum})
      RETURNING id`

    const fechaLimite = new Date()
    fechaLimite.setMonth(fechaLimite.getMonth() + cuotas)

    const [contrato] = await sql`
      INSERT INTO contratos (
        ncontrato, solicitud, cliente_id, plan_id, beneficiario, dia_pago,
        inversion_total, inversion_inicial, bonificacion, saldo_pendiente,
        num_cuotas, monto_cuota, tipo_aportacion, cobrador_id, fecha_limite
      ) VALUES (
        ${ncontrato}, ${solicitud||null}, ${cliente.id}, ${parseInt(plan_id)}, ${beneficiario||null}, ${parseInt(dia_pago)||1},
        ${total}, ${inv}, ${boni}, ${saldo},
        ${cuotas}, ${cuota}, ${tipo_aportacion||'mensual'}, ${cobrador_id}, ${fechaLimite.toISOString().split('T')[0]}
      )
      RETURNING id, ncontrato`

    try { await sql`UPDATE cobradores SET contratos_asignados = COALESCE(contratos_asignados,0) + 1 WHERE id = ${cobrador_id}` } catch {}

    return NextResponse.json({ ok: true, ncontrato: contrato.ncontrato, contrato_id: contrato.id, saldo, monto_cuota: cuota })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
