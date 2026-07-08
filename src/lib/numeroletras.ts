// Convierte un numero a letras en español (mayusculas), estilo contrato/factura.
// Soporta hasta cientos de millones. Devuelve solo la parte entera en letras.

const UNIDADES = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
const ESPECIALES: Record<number, string> = {
  10: 'DIEZ', 11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE',
  16: 'DIECISÉIS', 17: 'DIECISIETE', 18: 'DIECIOCHO', 19: 'DIECINUEVE',
  20: 'VEINTE', 21: 'VEINTIUNO', 22: 'VEINTIDÓS', 23: 'VEINTITRÉS', 24: 'VEINTICUATRO',
  25: 'VEINTICINCO', 26: 'VEINTISÉIS', 27: 'VEINTISIETE', 28: 'VEINTIOCHO', 29: 'VEINTINUEVE',
}
const DECENAS = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
const CENTENAS = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
  'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

function menorDeCien(n: number): string {
  if (n < 10) return UNIDADES[n]
  if (ESPECIALES[n]) return ESPECIALES[n]
  const d = Math.floor(n / 10), u = n % 10
  return u === 0 ? DECENAS[d] : `${DECENAS[d]} Y ${UNIDADES[u]}`
}

function menorDeMil(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'CIEN'
  const c = Math.floor(n / 100), r = n % 100
  const centStr = CENTENAS[c]
  const resto = menorDeCien(r)
  return [centStr, resto].filter(Boolean).join(' ')
}

export function numeroALetras(num: number): string {
  const entero = Math.floor(Math.abs(num))
  if (entero === 0) return 'CERO'

  const millones = Math.floor(entero / 1_000_000)
  const miles = Math.floor((entero % 1_000_000) / 1000)
  const resto = entero % 1000

  const partes: string[] = []
  if (millones > 0) partes.push(millones === 1 ? 'UN MILLÓN' : `${menorDeMil(millones)} MILLONES`)
  if (miles > 0) partes.push(miles === 1 ? 'MIL' : `${menorDeMil(miles)} MIL`)
  if (resto > 0) partes.push(menorDeMil(resto))

  return partes.join(' ').trim()
}

// Formato moneda en letras: "DIECIOCHO MIL PESOS 00/100 M.N."
export function pesosALetras(num: number): string {
  const n = Math.abs(num)
  const entero = Math.floor(n)
  const centavos = Math.round((n - entero) * 100)
  const letras = numeroALetras(entero)
  const pesos = entero === 1 ? 'PESO' : 'PESOS'
  return `${letras} ${pesos} ${String(centavos).padStart(2, '0')}/100 M.N.`
}
