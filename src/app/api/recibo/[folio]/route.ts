import { sql } from '@/lib/db'

// Vista imprimible del recibo (HTML + @media print). Se abre en pestaña nueva.
const esc = (s: any) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
const money = (v: any) => `$${parseFloat(v || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

export async function GET(_req: Request, { params }: { params: { folio: string } }) {
  try {
    const [r] = await sql`
      SELECT rc.folio, rc.monto, rc.created_at,
        cl.nombre AS cliente, cl.telefono,
        ct.ncontrato, ct.saldo_pendiente,
        p.metodo, p.fecha,
        pl.nombre AS plan_nombre,
        cb.nombre AS cobrador
      FROM recibos rc
      LEFT JOIN contratos ct ON ct.id = rc.contrato_id
      LEFT JOIN clientes cl ON cl.id = rc.cliente_id
      LEFT JOIN pagos p ON p.id = rc.pago_id
      LEFT JOIN planes pl ON pl.id = ct.plan_id
      LEFT JOIN cobradores cb ON cb.id = p.cobrador_id
      WHERE rc.folio = ${params.folio} LIMIT 1`

    if (!r) return new Response('Recibo no encontrado', { status: 404 })

    const fecha = new Date(r.fecha || r.created_at)
    const fechaStr = fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

    const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Recibo ${esc(r.folio)}</title>
<style>
  @page { size: 80mm auto; margin: 6mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; color: #111; margin: 0; background: #e9e9e9; }
  .ticket { background: #fff; max-width: 360px; margin: 18px auto; padding: 22px 24px; box-shadow: 0 6px 24px rgba(0,0,0,.15); }
  .center { text-align: center; }
  .brand { font-size: 20px; font-weight: bold; letter-spacing: .15em; }
  .sub { font-size: 10px; color: #555; margin-top: 2px; }
  hr { border: none; border-top: 1px dashed #999; margin: 12px 0; }
  .row { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
  .row .l { color: #555; }
  .row .v { font-weight: bold; text-align: right; }
  .tot { font-size: 17px; font-weight: bold; }
  .foot { text-align: center; font-size: 10px; color: #666; margin-top: 14px; }
  .toolbar { text-align: center; padding: 10px; }
  .toolbar button { background: #15a07f; color: #fff; border: none; padding: 10px 22px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: system-ui, sans-serif; }
  @media print { .toolbar { display: none; } body { background: #fff; } .ticket { box-shadow: none; margin: 0; max-width: none; } }
</style></head>
<body>
<div class="toolbar"><button onclick="window.print()">🖨️ Imprimir recibo</button></div>
<div class="ticket">
  <div class="center">
    <div class="brand">PREMMEX</div>
    <div class="sub">Previsión Mutual de México</div>
    <div class="sub">Vicente Guerrero #134 · Tel. 378 138 26 70</div>
  </div>
  <hr/>
  <div class="center" style="font-size:13px;font-weight:bold">RECIBO DE APORTACIÓN</div>
  <div class="center sub">${esc(r.folio)}</div>
  <hr/>
  <div class="row"><span class="l">Fecha</span><span class="v">${esc(fechaStr)}</span></div>
  <div class="row"><span class="l">Cliente</span><span class="v">${esc(r.cliente)}</span></div>
  <div class="row"><span class="l">Contrato</span><span class="v">${esc(r.ncontrato)}</span></div>
  <div class="row"><span class="l">Plan</span><span class="v">${esc(r.plan_nombre || '—')}</span></div>
  <div class="row"><span class="l">Método</span><span class="v">${esc(r.metodo || 'efectivo')}</span></div>
  ${r.cobrador ? `<div class="row"><span class="l">Recibió</span><span class="v">${esc(r.cobrador)}</span></div>` : ''}
  <hr/>
  <div class="row tot"><span>APORTACIÓN</span><span>${money(r.monto)}</span></div>
  <div class="row"><span class="l">Saldo restante</span><span class="v">${money(r.saldo_pendiente)}</span></div>
  <hr/>
  <div class="foot">Gracias por su preferencia.<br/>Conserve este comprobante.</div>
</div>
</body></html>`

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (e: any) {
    return new Response('Error: ' + e.message, { status: 500 })
  }
}
