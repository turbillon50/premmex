import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET() {
  try {
    const por_cobrador = await sql`SELECT co.id,co.nombre,co.zona,co.contratos_asignados,COALESCE(co.cobrado_mes,0) as cobrado_mes,COALESCE(co.contratos_asignados*2000,20000) as meta FROM cobradores co ORDER BY co.cobrado_mes DESC`
    const cartera = await sql`SELECT estado,COUNT(*) as total,COALESCE(SUM(saldo_pendiente),0) as saldo FROM contratos GROUP BY estado`
    const mes_actual = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE_TRUNC('month',fecha)=DATE_TRUNC('month',CURRENT_DATE)`
    const mes_anterior = await sql`SELECT COALESCE(SUM(monto),0) as total FROM pagos WHERE DATE_TRUNC('month',fecha)=DATE_TRUNC('month',CURRENT_DATE-INTERVAL '1 month')`
    const riesgo = await sql`SELECT ct.folio,cl.nombre,cl.telefono,ct.monto_mensual,co.nombre as cobrador FROM contratos ct JOIN clientes cl ON ct.cliente_id=cl.id JOIN cobradores co ON cl.cobrador_id=co.id WHERE ct.estado='atrasado' AND ct.activo=true ORDER BY ct.saldo_pendiente DESC LIMIT 10`
    return NextResponse.json({por_cobrador,cartera,mes_actual:mes_actual[0]?.total||0,mes_anterior:mes_anterior[0]?.total||0,riesgo})
  } catch(e:any) { return NextResponse.json({error:e.message},{status:500}) }
}
