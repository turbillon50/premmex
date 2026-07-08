import { sql } from '@/lib/db'
import { pesosALetras, numeroALetras } from '@/lib/numeroletras'

// Vista imprimible (HTML + @media print carta) fiel a la plantilla del plan.
// El usuario usa "Imprimir / Guardar como PDF" del navegador.

const esc = (s: any) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

const MESES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']

// Beneficios que cambian por plan (clausula CUARTA b y c). El resto es comun.
const PLAN_BENEF: Record<string, { b: string; c: string }> = {
  ECOMMEX: {
    b: 'Recolección y traslado de cualquier unidad médica en <b>50</b> K.M. en CAPILLA DE GUADALUPE, JALISCO.',
    c: 'Ataúd de madera TAPIZADA ECONÓMICO ó METÁLICO ECONÓMICO.',
  },
  PREMMEDIO: {
    b: 'Recolección y traslado de cualquier unidad médica en <b>50</b> K.M. en CAPILLA DE GUADALUPE, JALISCO.',
    c: 'Ataúd de madera de pino <b>TAPA PLANA</b>.',
  },
  SUPREMMEX: {
    b: 'Recolección y traslado de cualquier unidad médica en <b>100</b> K.M. en CAPILLA DE GUADALUPE, JALISCO.',
    c: 'Ataúd de madera de pino <b>EN BÓVEDA</b>.',
  },
  SUPREMMEX_MAX: {
    b: 'Recolección y traslado de cualquier unidad médica en <b>100</b> K.M. en CAPILLA DE GUADALUPE, o de las localidades de TEPATITLÁN Y GUADALAJARA, JALISCO, Sin costo <b>SIEMPRE Y CUANDO ESTÉ AL CORRIENTE EN SUS APORTACIONES.</b>',
    c: 'Ataúd de madera de pino <b>EN BÓVEDA</b> con opción a cremación y urna básica y en este caso se prestará ataúd para su velación.',
  },
}

const COMUNES: [string, string][] = [
  ['a', 'Personal profesional y capacitado.'],
  ['d', 'Asesoría y pago en trámites de certificado médico, acta de defunción y permiso para sepultar.'],
  ['e', 'Arreglo personal del cuerpo <b>(NO INCLUYE EMBALSAMADO)</b>.'],
  ['f', 'Carroza (siempre y cuando el camino esté apto para el servicio).'],
  ['g', 'Solicitud en toque de agonías y misa ante nuestras autoridades eclesiásticas correspondientes.'],
  ['h', 'Coro santa Cecilia, santa teresita, lolita (sujetos a disponibilidad).'],
  ['i', 'Esquelas y recuerdos (siempre y cuando sean solicitados).'],
  ['j', 'Camión (sujeto a disponibilidad).'],
  ['k', 'Seguro por defunción accidental, desempleo, enfermedad o al solicitar el servicio.'],
]

const SEGUROS: [string, string][] = [
  ['a', 'Por defunción del titular en caso de muerte accidental instantánea. (condonación del 100%) <b>(NO INCLUYE EN SUICIDIO)</b>.'],
  ['b', 'Por defunción del titular a consecuencia posterior de accidente, condonación del 50% del saldo liquidando inmediatamente o seguir con las mismas aportaciones y plazo estipulado para la persona o familiar que solicite el servicio.'],
  ['c', 'Por desempleo o enfermedad 2 prórrogas de 3 meses cada una. Favor de notificar por escrito para mantener su servicio activo y congelado.'],
  ['d', 'Por solicitar este servicio para cualquier persona, podrá seguir con las mismas aportaciones y plazo estipulado.'],
]

const money = (v: number) => `$${(v || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
const conLetra = (v: number) => `${pesosALetras(v)} (${money(v)})`

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const [c] = await sql`
      SELECT ct.*, cl.nombre AS cliente, cl.domicilio, cl.colonia, cl.municipio, cl.estado AS estado_cliente,
        cl.estado_civil, cl.ocupacion, p.clave AS plan_clave, p.nombre AS plan_nombre
      FROM contratos ct
      LEFT JOIN clientes cl ON cl.id = ct.cliente_id
      LEFT JOIN planes p ON p.id = ct.plan_id
      WHERE ct.id = ${params.id} LIMIT 1`

    if (!c) return new Response('Contrato no encontrado', { status: 404 })

    const fecha = c.fecha_inicio ? new Date(c.fecha_inicio) : new Date(c.created_at)
    const dia = String(fecha.getUTCDate())
    const mes = MESES[fecha.getUTCMonth()]
    const anio = String(fecha.getUTCFullYear())
    const anioLetra = numeroALetras(fecha.getUTCFullYear())

    const total = parseFloat(c.inversion_total) || 0
    const inicial = parseFloat(c.inversion_inicial) || 0
    const boni = parseFloat(c.bonificacion) || 0
    const saldo = parseFloat(c.saldo_pendiente) || 0
    const cuota = parseFloat(c.monto_cuota) || 0
    const cuotas = parseInt(c.num_cuotas) || 0
    const tipo = c.tipo_aportacion || 'mensual'

    const benef = PLAN_BENEF[c.plan_clave] || PLAN_BENEF.SUPREMMEX
    const beneficios: [string, string][] = [
      ['a', COMUNES[0][1]],
      ['b', benef.b],
      ['c', benef.c],
      ...COMUNES.slice(1),
    ]

    const liRow = (letra: string, txt: string) =>
      `<tr><td class="k">${letra})</td><td>${txt}</td></tr>`

    const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Contrato ${esc(c.ncontrato)} — ${esc(c.cliente)}</title>
<style>
  @page { size: letter; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Georgia, serif; color: #111; font-size: 11.2px; line-height: 1.45; margin: 0; background: #eee; }
  .sheet { background: #fff; max-width: 800px; margin: 18px auto; padding: 26px 30px; box-shadow: 0 6px 30px rgba(0,0,0,.18); }
  .tel { text-align: right; font-weight: bold; font-size: 13px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border: 1.5px solid #111; padding: 8px 10px; margin: 6px 0 10px; }
  .head .plan { font-weight: bold; font-size: 15px; }
  .head .meta { text-align: right; font-size: 11px; font-weight: bold; }
  .brand { text-align:center; font-size: 10px; color:#555; margin-bottom: 8px; letter-spacing:.06em; }
  h2 { font-size: 12px; text-align: center; letter-spacing: .1em; margin: 12px 0 8px; }
  p { margin: 7px 0; text-align: justify; }
  .cl { font-weight: bold; }
  table.b { width: 100%; border-collapse: collapse; margin: 6px 0 10px; }
  table.b td { border: 1px solid #333; padding: 5px 8px; vertical-align: top; font-size: 10.6px; }
  table.b td.k { width: 26px; text-align: center; font-weight: bold; }
  .firmas { display: flex; justify-content: space-between; gap: 20px; margin-top: 34px; }
  .firma { flex: 1; text-align: center; border-top: 1px solid #111; padding-top: 5px; font-weight: bold; font-size: 10.5px; }
  .entrega { border: 1px solid #333; padding: 8px 10px; margin-top: 16px; font-size: 10px; line-height: 1.6; }
  .toolbar { position: sticky; top: 0; text-align: center; padding: 10px; background: #0a0814; }
  .toolbar button { background: linear-gradient(135deg,#15a07f,#0f766e); color:#fff; border:none; padding:11px 26px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; font-family: system-ui, sans-serif; }
  @media print { .toolbar { display: none; } body { background: #fff; } .sheet { box-shadow: none; margin: 0; max-width: none; padding: 0; } }
</style></head>
<body>
<div class="toolbar"><button onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button></div>
<div class="sheet">
  <div class="tel">378 138 26 70</div>
  <div class="brand">PREMMEX · Previsión Mutual de México · Vicente Guerrero #134, Capilla de Guadalupe, Jalisco</div>
  <div class="head">
    <div class="plan">SERVICIO A PREVISIÓN ${esc(c.plan_nombre)}</div>
    <div class="meta">CONTRATO ${esc(c.ncontrato)}<br/>SOLICITUD ${esc(c.solicitud || '—')}</div>
  </div>

  <p>En Capilla de Guadalupe Municipio de Tepatitlán de Morelos, Jalisco, a los <b>${esc(dia)}</b> días de <b>${esc(mes)}</b> del año <b>${esc(anio)} (${esc(anioLetra)})</b> comparecen por una parte <b>PREMMEX</b> con domicilio Vicente Guerrero #134 como prestador de servicios a previsión y por la otra parte, <span class="cl">${esc((c.cliente || '').toUpperCase())}</span> con domicilio en <b>${esc((c.domicilio || '').toUpperCase())}</b> de la colonia <b>${esc((c.colonia || '').toUpperCase())}</b> del municipio <b>${esc((c.municipio || '').toUpperCase())}</b>, de estado civil <b>${esc((c.estado_civil || '—').toUpperCase())}</b> y de ocupación <b>${esc((c.ocupacion || '—').toUpperCase())}</b> en calidad de titular, manifestando ambas partes su conformidad para celebrar este documento bajo las siguientes</p>

  <h2>CLÁUSULAS Y CONDICIONES</h2>

  <p><b>PRIMERA.-</b> El titular adquiere el servicio <b>${esc((c.plan_nombre || '').toUpperCase())}</b> y se conviene que la inversión total del mismo será de <b>${esc(conLetra(total))}</b> con una inversión inicial de <b>${esc(conLetra(inicial))}</b> más bonificación de <b>${esc(conLetra(boni))}</b>, debiendo cubrir la cantidad de <b>${esc(conLetra(saldo))}</b> en <b>${esc(numeroALetras(cuotas))} (${esc(String(cuotas))})</b> aportaciones de <b>${esc(conLetra(cuota))}</b> de manera <b>${esc(tipo.toUpperCase())}</b>, teniendo hasta 2.3 años para cubrir el costo total sin ningún cargo de interés.</p>

  <p><b>SEGUNDA.-</b> La recolección de sus aportaciones a domicilio por el personal designado para ello, es un servicio adicional el cual podría ser suspendido y el <b>TITULAR SE COMPROMETE</b> a reportar y pasar a llevar su inversión a las oficinas físicas de <b>PREMMEX</b> para mantenerse al corriente y tener las ventajas y beneficios activos.</p>

  <p><b>TERCERA.-</b> Solo por motivos de causa mayor y en una sola ocasión podrán ser suspendidas sus aportaciones por un plazo no mayor a 3 (tres) meses consecutivos o 6 (seis) acumulados, informando el motivo por escrito o de lo contrario y no hacerlo se podría descongelar el costo aquí convenido y en caso de cancelación convienen que la cantidad invertida quede como depósito a favor del titular la cual será bonificada al solicitar el servicio a futuro debiendo cubrir la diferencia al precio actual vigente.</p>

  <p><b>CUARTA.-</b> Este documento ampara los siguientes beneficios y son 100% transferibles para cualquier persona que el titular indique:</p>
  <table class="b">${beneficios.map(([l, t]) => liRow(l, t)).join('')}</table>

  <p><b>QUINTA.–</b> DEFINICIÓN DE LOS SEGUROS LOS CUALES ESTARÁN ACTIVOS DESPUÉS DE 6 (SEIS) MESES DE ELABORADO ESTE DOCUMENTO Y POSTERIORMENTE VIGENTES ÚNICAMENTE POR ESTAR AL CORRIENTE EN SUS APORTACIONES.</p>
  <table class="b">${SEGUROS.map(([l, t]) => liRow(l, t)).join('')}</table>

  <p><b>SEXTA.-</b> Este servicio no incluye propiedad en el panteón <b>NI PAGOS MUNICIPALES</b> por trabajos de EXHUMACIÓN(ES).</p>

  <p><b>SÉPTIMA.-</b> Se puede solicitar este servicio de manera telefónica o bien presentarse en las oficinas directamente con este documento. (En caso de hacerlo telefónicamente el titular se deberá presentar posteriormente para dar fe y seguimiento a este servicio).</p>

  <p><b>OCTAVA.-</b> Si este servicio es solicitado antes de 6 meses, deberá cubrir la mitad del saldo pendiente y se otorgará un plazo de hasta 12 mensualidades para cubrir el saldo restante, <b>SIEMPRE Y CUANDO EL TITULAR ESTÉ AL CORRIENTE EN SUS APORTACIONES</b>, caso contrario se tendrá que liquidar la totalidad antes de la inhumación del mismo.</p>

  <p><b>NOVENA.-</b> En mi carácter de titular, yo <span class="cl">${esc((c.cliente || '').toUpperCase())}</span> reconozco que se me leyó y aclaró y tendré 7 (siete) días a partir de la recepción del mismo para cancelarlo y solicitar el reembolso del 100% de lo invertido (reconociendo la importancia de este documento me responsabilizo de <b>NO</b> entregarlo a nadie ajeno a <b>PREMMEX</b>) con lo cual doy fe y testimonio que no existe dolo por parte de <b>PREVISIÓN MUTUAL DE MÉXICO.</b></p>

  <h2>FIRMAS DE CONFORMIDAD</h2>
  <div class="firmas">
    <div class="firma">JOSE PRUDENCIO GARCIA GONZALEZ</div>
    <div class="firma">J. GUADALUPE GONZALEZ AGUILERA</div>
    <div class="firma">${esc((c.cliente || '').toUpperCase())}<br/><span style="font-weight:normal">NOMBRE, FIRMA Y FECHA</span></div>
  </div>

  <div class="entrega">
    SERVICIO ENTREGADO DE CONFORMIDAD PARA __________________________________ EL DÍA ____ DEL MES DE ______________ DEL AÑO ______ CON EL CUAL QUEDA FINIQUITADO EL SERVICIO AQUÍ PACTADO. NOMBRE DEL SOLICITANTE ________________________ PARENTESCO ____________ <b>OBSERVACIONES</b> _____________________________________________
    <div class="firmas" style="margin-top:24px">
      <div class="firma" style="font-weight:normal">FIRMA DEL SOLICITANTE</div>
      <div class="firma" style="font-weight:normal">PREMMEX</div>
    </div>
  </div>
</div>
</body></html>`

    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (e: any) {
    return new Response('Error: ' + e.message, { status: 500 })
  }
}
