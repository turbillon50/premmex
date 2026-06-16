'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ──────────────────────────────────────────
   TIPOS
────────────────────────────────────────── */
type Role = 'cobrador' | 'admin'
type Tab  = string

/* ──────────────────────────────────────────
   DATOS DEMO
────────────────────────────────────────── */
const USUARIOS = [
  { id: 'u1', nombre: 'Juan Pérez Gómez',    pin: '1234', rol: 'cobrador' as Role, zona: 'Centro' },
  { id: 'u2', nombre: 'Rosa Hernández',       pin: '5678', rol: 'cobrador' as Role, zona: 'Norte'  },
  { id: 'u3', nombre: 'José Prudencio García',pin: '0000', rol: 'admin'    as Role, zona: ''       },
]

const PLANES = ['ECOMMEX','PREMMEDIO','SUPREMMEX','SUPREMMEX MAX']

const CLIENTES = [
  { id:'c1', nombre:'María González Pérez',   tel:'3911000001', dir:'Av. Morelos 23, Centro',          cobrador:'u1', plan:'SUPREMMEX',    mensual:850,  saldo:6800,  dias_mora:0  },
  { id:'c2', nombre:'José Ramírez Luna',       tel:'3911000002', dir:'Calle Hidalgo 45, Centro',        cobrador:'u1', plan:'ECOMMEX',      mensual:420,  saldo:3360,  dias_mora:12 },
  { id:'c3', nombre:'Lucía Vázquez Torres',    tel:'3911000003', dir:'López Mateos 78, Guadalajara',    cobrador:'u1', plan:'PREMMEDIO',    mensual:600,  saldo:4800,  dias_mora:0  },
  { id:'c4', nombre:'Carlos Medina Ramos',     tel:'3911000004', dir:'Juárez 12, Capilla de Gdlpe',     cobrador:'u1', plan:'SUPREMMEX MAX',mensual:1200, saldo:9600,  dias_mora:5  },
  { id:'c5', nombre:'Ana Flores Ruiz',         tel:'3911000005', dir:'Insurgentes 34, Tepatitlán',      cobrador:'u2', plan:'SUPREMMEX',    mensual:850,  saldo:0,     dias_mora:0  },
  { id:'c6', nombre:'Roberto Sánchez Mora',    tel:'3911000006', dir:'Reforma 89, Capilla de Gdlpe',    cobrador:'u2', plan:'ECOMMEX',      mensual:420,  saldo:1260,  dias_mora:0  },
  { id:'c7', nombre:'Gloria Pérez Lara',       tel:'3911000007', dir:'Av. Juárez 201, Tepatitlán',      cobrador:'u2', plan:'PREMMEDIO',    mensual:600,  saldo:7200,  dias_mora:20 },
]

const PAGOS_HIST = [
  { id:'p1', cliente:'c1', cobrador:'u1', monto:850,  fecha:'2026-06-10', metodo:'Efectivo',     folio:'PMX-2001' },
  { id:'p2', cliente:'c2', cobrador:'u1', monto:420,  fecha:'2026-06-08', metodo:'Transferencia',folio:'PMX-2002' },
  { id:'p3', cliente:'c5', cobrador:'u2', monto:850,  fecha:'2026-06-12', metodo:'Efectivo',     folio:'PMX-2003' },
  { id:'p4', cliente:'c6', cobrador:'u2', monto:420,  fecha:'2026-06-11', metodo:'Efectivo',     folio:'PMX-2004' },
  { id:'p5', cliente:'c3', cobrador:'u1', monto:600,  fecha:'2026-06-05', metodo:'Efectivo',     folio:'PMX-2005' },
]

/* ──────────────────────────────────────────
   ICONOS SVG INLINE
────────────────────────────────────────── */
const IHome  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
const IMap   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
const ICheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IUser  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IUsers = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IFile  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IMoney = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
const IChart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const IPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const IWA    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.859L.073 23.27a.75.75 0 00.906.919l5.555-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.371l-.36-.213-3.708.976.992-3.617-.234-.374A9.818 9.818 0 0112 2.182c5.429 0 9.818 4.389 9.818 9.818S17.429 21.818 12 21.818z"/></svg>
const ILogout= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IGrid  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>

/* ──────────────────────────────────────────
   HELPERS
────────────────────────────────────────── */
const FI = ({ children, d = 0 }: { children: React.ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, delay: d, ease: 'easeOut' }}>
    {children}
  </motion.div>
)

const Badge = ({ label, type }: { label: string; type: 'ok' | 'warn' | 'danger' | 'neutral' }) => {
  const styles = {
    ok:      { bg: '#dcfce7', color: '#15803d' },
    warn:    { bg: '#fef9c3', color: '#854d0e' },
    danger:  { bg: '#fee2e2', color: '#b91c1c' },
    neutral: { bg: '#f1f5f9', color: '#475569' },
  }
  const s = styles[type]
  return (
    <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color }}>{label}</span>
  )
}

/* ──────────────────────────────────────────
   SPLASH
────────────────────────────────────────── */
function Splash() {
  const [v, setV] = useState(true)
  useEffect(() => { const t = setTimeout(() => setV(false), 2000); return () => clearTimeout(t) }, [])
  return (
    <AnimatePresence>
      {v && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f4f7f4' }}>
          <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#0f766e',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="18" y="6" width="4" height="28" rx="2" fill="white"/>
                <rect x="6" y="18" width="28" height="4" rx="2" fill="white"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 26,
              letterSpacing: '0.15em', color: '#16241f' }}>PREMMEX</div>
            <div style={{ fontSize: 11, color: '#5d6b64', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Sistema de Gestión
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ──────────────────────────────────────────
   LOGIN
────────────────────────────────────────── */
function Login({ onLogin }: { onLogin: (u: typeof USUARIOS[0]) => void }) {
  const [telefono, setTelefono] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      // En demo: buscar por pin simple
      const user = USUARIOS.find(u => u.pin === pin)
      if (user) {
        onLogin(user)
      } else {
        setError('PIN incorrecto. Contacta a tu administrador.')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f4', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      
      <FI>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: '#0f766e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect x="18" y="6" width="4" height="28" rx="2" fill="white"/>
              <rect x="6" y="18" width="28" height="4" rx="2" fill="white"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28,
            letterSpacing: '0.15em', color: '#16241f', marginBottom: 4 }}>PREMMEX</div>
          <div style={{ fontSize: 12, color: '#5d6b64' }}>
            Previsión Mutual de México · Sistema interno
          </div>
        </div>
      </FI>

      <FI d={0.1}>
        <div style={{ width: '100%', maxWidth: 360, background: '#fff', borderRadius: 20,
          padding: 28, boxShadow: '0 10px 30px rgba(15,118,110,0.08)',
          border: '1px solid rgba(15,118,110,0.1)' }}>
          
          <div style={{ fontSize: 18, fontWeight: 700, color: '#16241f', marginBottom: 4 }}>
            Acceso al sistema
          </div>
          <div style={{ fontSize: 13, color: '#5d6b64', marginBottom: 24 }}>
            Ingresa con tu número y PIN
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#5d6b64',
              textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              Teléfono registrado
            </label>
            <input
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="391 100 0000"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
                border: '1.5px solid rgba(15,118,110,0.2)', background: '#f4f7f4',
                color: '#16241f', outline: 'none', boxSizing: 'border-box' }}/>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#5d6b64',
              textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              PIN — últimos 4 dígitos de tu teléfono
            </label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value.slice(0, 4))}
              placeholder="• • • •"
              maxLength={4}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 18,
                border: '1.5px solid rgba(15,118,110,0.2)', background: '#f4f7f4',
                color: '#16241f', outline: 'none', letterSpacing: '0.3em',
                textAlign: 'center', boxSizing: 'border-box' }}/>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10,
              background: '#fee2e2', color: '#b91c1c', fontSize: 13 }}>{error}</div>
          )}

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700,
              background: 'linear-gradient(135deg, #0f766e, #15a07f)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {loading ? 'Verificando...' : 'Entrar →'}
          </motion.button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#5d6b64' }}>
            ¿Problemas de acceso?{' '}
            <a href="tel:+523916100449" style={{ color: '#0f766e', fontWeight: 600 }}>
              391 610 0449
            </a>
          </div>

          {/* Demo hints */}
          <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 10,
            background: '#f0fdf4', border: '1px solid rgba(15,118,110,0.15)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', marginBottom: 6 }}>
              ACCESOS DEMO
            </div>
            <div style={{ fontSize: 11, color: '#5d6b64', lineHeight: 1.6 }}>
              Cobrador → PIN: <b style={{color:'#16241f'}}>1234</b><br/>
              Cobrador 2 → PIN: <b style={{color:'#16241f'}}>5678</b><br/>
              Admin → PIN: <b style={{color:'#16241f'}}>0000</b>
            </div>
          </div>
        </div>
      </FI>
    </div>
  )
}

/* ──────────────────────────────────────────
   APP COBRADOR
────────────────────────────────────────── */
function AppCobrador({ usuario, onLogout }: { usuario: typeof USUARIOS[0]; onLogout: () => void }) {
  const [tab, setTab] = useState<'ruta' | 'clientes' | 'cobros' | 'perfil'>('ruta')
  const [cobrados, setCobrados] = useState<string[]>([])
  const [expandido, setExpandido] = useState<string | null>(null)
  const [showCobro, setShowCobro] = useState<typeof CLIENTES[0] | null>(null)
  const [metodo, setMetodo] = useState('efectivo')

  const misClientes = CLIENTES.filter(c => c.cobrador === usuario.id)
  const rutaHoy = misClientes.filter(c => c.saldo > 0)
  const totalCobrado = cobrados.reduce((a, id) => a + (misClientes.find(c => c.id === id)?.mensual ?? 0), 0)
  const totalPendiente = rutaHoy.filter(c => !cobrados.includes(c.id)).reduce((a, c) => a + c.mensual, 0)

  const confirmarCobro = (cliente: typeof CLIENTES[0]) => {
    setCobrados(p => [...p, cliente.id])
    setShowCobro(null)
  }

  const BRAND = '#0f766e'

  return (
    <>
      {/* MODAL COBRO */}
      <AnimatePresence>
        {showCobro && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(22,36,31,0.6)',
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end' }}
            onClick={() => setShowCobro(null)}>
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#fff',
                borderRadius: '24px 24px 0 0', padding: 24,
                boxShadow: '0 -10px 40px rgba(15,118,110,0.12)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#e2e8f0', margin: '0 auto 20px' }}/>
              <div style={{ fontSize: 12, color: '#5d6b64', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4 }}>REGISTRAR COBRO</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16241f', marginBottom: 2 }}>
                {showCobro.nombre}
              </div>
              <div style={{ fontSize: 13, color: '#5d6b64', marginBottom: 20 }}>
                Plan {showCobro.plan}
              </div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 700, color: BRAND }}>
                  ${showCobro.mensual.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#5d6b64' }}>mensualidad</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5d6b64', marginBottom: 10,
                textTransform: 'uppercase', letterSpacing: '0.06em' }}>Forma de pago</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                {['efectivo', 'transferencia', 'tarjeta'].map(m => (
                  <button key={m} onClick={() => setMetodo(m)}
                    style={{ padding: '10px 4px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      cursor: 'pointer', border: `1.5px solid ${metodo === m ? BRAND : '#e2e8f0'}`,
                      background: metodo === m ? `rgba(15,118,110,0.08)` : '#f8fafc',
                      color: metodo === m ? BRAND : '#94a3b8' }}>
                    {m === 'efectivo' ? '💵 Efectivo' : m === 'transferencia' ? '🏦 Transfer.' : '💳 Tarjeta'}
                  </button>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => confirmarCobro(showCobro)}
                style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${BRAND}, #15a07f)`, color: '#fff',
                  fontSize: 15, fontWeight: 700 }}>
                ✓ Confirmar cobro
              </motion.button>
              <button onClick={() => setShowCobro(null)}
                style={{ width: '100%', marginTop: 10, padding: 12, borderRadius: 12, border: 'none',
                  cursor: 'pointer', background: 'transparent', color: '#94a3b8', fontSize: 14 }}>
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ minHeight: '100vh', background: '#f4f7f4', paddingBottom: 80 }}>

        {/* HEADER */}
        <div style={{ padding: '16px 20px', background: '#fff', borderBottom: '1px solid rgba(15,118,110,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, letterSpacing: '0.1em', color: '#16241f' }}>
              PREMMEX
            </div>
            <div style={{ fontSize: 11, color: '#5d6b64' }}>
              {usuario.nombre} · Zona {usuario.zona}
            </div>
          </div>
          <button onClick={onLogout}
            style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
              background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#94a3b8' }}>
            <ILogout />
          </button>
        </div>

        {/* ── RUTA DEL DÍA ── */}
        {tab === 'ruta' && (
          <div style={{ padding: '16px 16px 0' }}>
            <FI>
              <div style={{ fontSize: 11, color: '#5d6b64', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4 }}>RUTA DE HOY</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#16241f', marginBottom: 16 }}>
                {rutaHoy.length} visitas pendientes
              </div>
            </FI>

            {/* KPIs */}
            <FI d={0.05}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px',
                  border: '1px solid rgba(15,118,110,0.1)' }}>
                  <div style={{ fontSize: 11, color: '#5d6b64', marginBottom: 4 }}>Cobrado hoy</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: BRAND, fontWeight: 700 }}>
                    ${totalCobrado.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#5d6b64' }}>{cobrados.length} cobros</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px',
                  border: '1px solid rgba(15,118,110,0.1)' }}>
                  <div style={{ fontSize: 11, color: '#5d6b64', marginBottom: 4 }}>Pendiente</div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#f59e0b', fontWeight: 700 }}>
                    ${totalPendiente.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#5d6b64' }}>
                    {rutaHoy.filter(c => !cobrados.includes(c.id)).length} por cobrar
                  </div>
                </div>
              </div>
            </FI>

            {/* Lista clientes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rutaHoy.map((c, i) => {
                const esCobrado = cobrados.includes(c.id)
                const open = expandido === c.id
                return (
                  <FI key={c.id} d={i * 0.06}>
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                      border: esCobrado ? '1.5px solid #86efac' : c.dias_mora > 0 ? '1.5px solid #fcd34d' : '1px solid rgba(15,118,110,0.1)',
                      opacity: esCobrado ? 0.75 : 1 }}>

                      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', cursor: 'pointer' }}
                        onClick={() => setExpandido(open ? null : c.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                            background: esCobrado ? '#dcfce7' : 'rgba(15,118,110,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: esCobrado ? '#15803d' : BRAND, fontSize: 13,
                            fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                            {esCobrado ? <ICheck /> : (i + 1)}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>
                              {c.nombre}
                            </div>
                            <div style={{ fontSize: 11, color: '#5d6b64' }}>{c.dir}</div>
                            {c.dias_mora > 0 && !esCobrado && (
                              <div style={{ fontSize: 10, color: '#b45309', fontWeight: 600, marginTop: 2 }}>
                                ⚠ {c.dias_mora} días de mora
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700,
                            color: esCobrado ? '#15803d' : BRAND }}>
                            ${c.mensual.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 11, color: '#5d6b64' }}>{c.plan}</div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {open && !esCobrado && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '10px 16px 16px',
                              borderTop: '1px solid rgba(15,118,110,0.08)' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                <a href={`tel:${c.tel}`}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '10px 4px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                    gap: 4, textDecoration: 'none', background: '#eff6ff', color: '#1d4ed8' }}>
                                  <IPhone /> Llamar
                                </a>
                                <a href={`https://wa.me/52${c.tel}`}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '10px 4px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                    gap: 4, textDecoration: 'none', background: '#f0fdf4', color: '#15803d' }}>
                                  <IWA /> WhatsApp
                                </a>
                                <button onClick={() => setShowCobro(c)}
                                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '10px 4px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                    gap: 4, cursor: 'pointer', border: 'none',
                                    background: 'rgba(15,118,110,0.08)', color: BRAND }}>
                                  <IMoney /> Cobrar
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FI>
                )
              })}
            </div>
          </div>
        )}

        {/* ── MIS CLIENTES ── */}
        {tab === 'clientes' && (
          <div style={{ padding: '16px 16px 0' }}>
            <FI>
              <div style={{ fontSize: 11, color: '#5d6b64', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4 }}>MIS CLIENTES</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#16241f', marginBottom: 16 }}>
                Zona {usuario.zona} · {misClientes.length} contratos
              </div>
            </FI>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {misClientes.map((c, i) => (
                <FI key={c.id} d={i * 0.06}>
                  <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px',
                    border: '1px solid rgba(15,118,110,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>{c.nombre}</div>
                        <div style={{ fontSize: 11, color: '#5d6b64', marginTop: 2 }}>{c.plan}</div>
                        <div style={{ fontSize: 11, color: '#5d6b64' }}>{c.dir}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: BRAND }}>
                          ${c.mensual.toLocaleString()}/mes
                        </div>
                        {c.saldo === 0
                          ? <Badge label="Liquidado" type="ok" />
                          : c.dias_mora > 0
                            ? <Badge label={`${c.dias_mora}d mora`} type="danger" />
                            : <Badge label="Al corriente" type="neutral" />
                        }
                      </div>
                    </div>
                  </div>
                </FI>
              ))}
            </div>
          </div>
        )}

        {/* ── COBROS DEL DÍA ── */}
        {tab === 'cobros' && (
          <div style={{ padding: '16px 16px 0' }}>
            <FI>
              <div style={{ fontSize: 11, color: '#5d6b64', textTransform: 'uppercase',
                letterSpacing: '0.08em', marginBottom: 4 }}>COBROS DE HOY</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#16241f', marginBottom: 16 }}>
                ${totalCobrado.toLocaleString()} recaudado
              </div>
            </FI>
            {cobrados.length === 0 ? (
              <FI d={0.1}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center',
                  border: '1px solid rgba(15,118,110,0.1)' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                  <div style={{ color: '#5d6b64', fontSize: 14 }}>Aún sin cobros registrados</div>
                </div>
              </FI>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cobrados.map((id, i) => {
                  const c = misClientes.find(x => x.id === id)!
                  return (
                    <FI key={id} d={i * 0.06}>
                      <div style={{ background: '#fff', borderRadius: 14, padding: '13px 16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        border: '1.5px solid #86efac' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>{c.nombre}</div>
                          <div style={{ fontSize: 11, color: '#5d6b64' }}>Efectivo · Hoy</div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d' }}>
                          +${c.mensual.toLocaleString()}
                        </div>
                      </div>
                    </FI>
                  )
                })}
                <FI d={0.2}>
                  <div style={{ background: 'rgba(15,118,110,0.06)', borderRadius: 14, padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', border: '1.5px solid rgba(15,118,110,0.2)' }}>
                    <span style={{ fontWeight: 700, color: '#16241f' }}>Total cobrado</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: BRAND }}>
                      ${totalCobrado.toLocaleString()}
                    </span>
                  </div>
                </FI>
              </div>
            )}
          </div>
        )}

        {/* ── PERFIL ── */}
        {tab === 'perfil' && (
          <div style={{ padding: '24px 16px 0', textAlign: 'center' }}>
            <FI>
              <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
                background: 'rgba(15,118,110,0.1)', border: '2px solid rgba(15,118,110,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Georgia, serif', fontSize: 28, color: BRAND }}>
                {usuario.nombre[0]}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#16241f' }}>{usuario.nombre}</div>
              <div style={{ fontSize: 13, color: '#5d6b64', marginBottom: 24 }}>
                Cobrador · Zona {usuario.zona}
              </div>
            </FI>
            <FI d={0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { l: 'Contratos asignados', v: misClientes.length.toString(), c: BRAND },
                  { l: 'Cobrado hoy', v: `$${totalCobrado.toLocaleString()}`, c: '#15803d' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px',
                    border: '1px solid rgba(15,118,110,0.1)' }}>
                    <div style={{ fontSize: 11, color: '#5d6b64', marginBottom: 4 }}>{s.l}</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: s.c, fontWeight: 700 }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <button onClick={onLogout}
                style={{ width: '100%', padding: 14, borderRadius: 12, border: '1.5px solid #fca5a5',
                  background: '#fff5f5', color: '#b91c1c', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ILogout /> Cerrar sesión
              </button>
            </FI>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(15,118,110,0.1)',
        display: 'flex', alignItems: 'center', zIndex: 100 }}>
        {([
          { id: 'ruta', l: 'Ruta', I: IMap },
          { id: 'clientes', l: 'Clientes', I: IUsers },
          { id: 'cobros', l: 'Cobros', I: IMoney },
          { id: 'perfil', l: 'Perfil', I: IUser },
        ] as const).map(({ id, l, I }) => (
          <motion.button key={id} onClick={() => setTab(id)} whileTap={{ scale: 0.9 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '8px 0', border: 'none', cursor: 'pointer', background: 'transparent',
              color: tab === id ? BRAND : '#94a3b8', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.04em', minHeight: 44 }}>
            <I /> <span>{l}</span>
          </motion.button>
        ))}
      </nav>
    </>
  )
}

/* ──────────────────────────────────────────
   APP ADMIN
────────────────────────────────────────── */
function AppAdmin({ usuario, onLogout }: { usuario: typeof USUARIOS[0]; onLogout: () => void }) {
  const [sec, setSec] = useState('dashboard')
  const [showNuevoCliente, setShowNuevoCliente] = useState(false)

  const BRAND = '#0f766e'

  const totalContratos = CLIENTES.length
  const totalSaldo = CLIENTES.reduce((a, c) => a + c.saldo, 0)
  const cobradoMes = PAGOS_HIST.reduce((a, p) => a + p.monto, 0)
  const conMora = CLIENTES.filter(c => c.dias_mora > 0).length

  const NAV_ADMIN = [
    { id: 'dashboard', l: 'Dashboard', I: IGrid },
    { id: 'clientes', l: 'Clientes', I: IUsers },
    { id: 'contratos', l: 'Contratos', I: IFile },
    { id: 'cobradores', l: 'Cobradores', I: IMap },
    { id: 'pagos', l: 'Pagos', I: IMoney },
    { id: 'reportes', l: 'Reportes', I: IChart },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f4' }}>

      {/* SIDEBAR DESKTOP */}
      <aside style={{ width: 240, flexShrink: 0, background: '#fff', flexDirection: 'column',
        borderRight: '1px solid rgba(15,118,110,0.1)', position: 'fixed', top: 0, bottom: 0, left: 0,
        display: 'flex', zIndex: 20 }} className="desktop-only">
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(15,118,110,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: BRAND,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                <rect x="18" y="6" width="4" height="28" rx="2" fill="white"/>
                <rect x="6" y="18" width="28" height="4" rx="2" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, letterSpacing: '0.12em', color: '#16241f' }}>
                PREMMEX
              </div>
              <div style={{ fontSize: 10, color: '#5d6b64' }}>Administración</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_ADMIN.map(({ id, l, I }) => (
            <button key={id} onClick={() => setSec(id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px', border: 'none', cursor: 'pointer',
                background: sec === id ? 'rgba(15,118,110,0.08)' : 'transparent',
                color: sec === id ? BRAND : '#5d6b64',
                borderLeft: `2px solid ${sec === id ? BRAND : 'transparent'}`,
                fontSize: 13, fontFamily: 'inherit', transition: 'all 150ms', textAlign: 'left' }}>
              <div style={{ width: 18, height: 18, flexShrink: 0 }}><I /></div>
              {l}
            </button>
          ))}
        </nav>
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(15,118,110,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#16241f' }}>{usuario.nombre}</div>
          <div style={{ fontSize: 11, color: '#5d6b64' }}>Administrador General</div>
          <button onClick={onLogout}
            style={{ marginTop: 10, width: '100%', padding: '8px', borderRadius: 8, border: 'none',
              background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: 240, overflowY: 'auto', paddingBottom: 80 }} className="admin-main">
        <div style={{ padding: '14px 20px', background: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid rgba(15,118,110,0.1)',
          position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#16241f' }}>
              {NAV_ADMIN.find(n => n.id === sec)?.l}
            </div>
            <div style={{ fontSize: 11, color: '#5d6b64' }}>Capilla de Guadalupe, Jalisco</div>
          </div>
          <button onClick={() => setShowNuevoCliente(true)}
            style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: BRAND, color: '#fff', fontSize: 12, fontWeight: 700 }}>
            + Nuevo cliente
          </button>
        </div>

        <div style={{ padding: 20 }}>

          {/* DASHBOARD */}
          {sec === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
                gap: 12, marginBottom: 24 }}>
                {[
                  { l: 'Contratos activos', v: totalContratos.toString(), c: BRAND, i: '📋' },
                  { l: 'Saldo total pendiente', v: `$${totalSaldo.toLocaleString()}`, c: '#f59e0b', i: '⏳' },
                  { l: 'Cobrado (historial)', v: `$${cobradoMes.toLocaleString()}`, c: '#15803d', i: '💰' },
                  { l: 'Clientes con mora', v: conMora.toString(), c: '#b91c1c', i: '⚠️' },
                ].map((s, i) => (
                  <FI key={i} d={i * 0.07}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 18,
                      border: '1px solid rgba(15,118,110,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: '#5d6b64' }}>{s.l}</span>
                        <span style={{ fontSize: 16 }}>{s.i}</span>
                      </div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: s.c, fontWeight: 700 }}>
                        {s.v}
                      </div>
                    </div>
                  </FI>
                ))}
              </div>

              {/* Alertas mora */}
              <FI d={0.2}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 20,
                  border: '1px solid rgba(15,118,110,0.1)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#5d6b64', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 14 }}>⚠ CLIENTES CON MORA</div>
                  {CLIENTES.filter(c => c.dias_mora > 0).map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', paddingBottom: 12, marginBottom: 12,
                      borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>{c.nombre}</div>
                        <div style={{ fontSize: 11, color: '#5d6b64' }}>{c.plan} · {c.dias_mora} días</div>
                      </div>
                      <Badge label={`$${c.saldo.toLocaleString()} debe`} type="danger" />
                    </div>
                  ))}
                </div>
              </FI>

              {/* Pagos recientes */}
              <FI d={0.3}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 20,
                  border: '1px solid rgba(15,118,110,0.1)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#5d6b64', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 14 }}>ÚLTIMOS PAGOS</div>
                  {PAGOS_HIST.map((p, i) => {
                    const cliente = CLIENTES.find(c => c.id === p.cliente)
                    const cobrador = USUARIOS.find(u => u.id === p.cobrador)
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', paddingBottom: 12, marginBottom: 12,
                        borderBottom: i < PAGOS_HIST.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#16241f' }}>
                            {cliente?.nombre}
                          </div>
                          <div style={{ fontSize: 11, color: '#5d6b64' }}>
                            {cobrador?.nombre} · {p.metodo} · {p.fecha}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>
                            +${p.monto.toLocaleString()}
                          </div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.folio}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </FI>
            </>
          )}

          {/* CLIENTES */}
          {sec === 'clientes' && (
            <FI>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(15,118,110,0.1)' }}>
                {CLIENTES.map((c, i) => (
                  <div key={c.id} style={{ padding: '14px 18px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: i < CLIENTES.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>{c.nombre}</div>
                      <div style={{ fontSize: 11, color: '#5d6b64' }}>{c.plan} · {c.dir}</div>
                      <div style={{ fontSize: 11, color: '#5d6b64' }}>
                        Cobrador: {USUARIOS.find(u => u.id === c.cobrador)?.nombre}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: BRAND }}>
                        ${c.mensual.toLocaleString()}/mes
                      </div>
                      {c.saldo === 0
                        ? <Badge label="Liquidado" type="ok" />
                        : c.dias_mora > 0
                          ? <Badge label={`${c.dias_mora}d mora`} type="danger" />
                          : <Badge label="Al corriente" type="neutral" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </FI>
          )}

          {/* CONTRATOS */}
          {sec === 'contratos' && (
            <FI>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(15,118,110,0.1)' }}>
                <div style={{ padding: '12px 18px', background: '#f8fafc',
                  borderBottom: '1px solid #f1f5f9', display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: 8, fontSize: 10, fontWeight: 700, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>Cliente</span><span>Plan</span><span>Mensual</span><span>Saldo</span><span>Estado</span>
                </div>
                {CLIENTES.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ padding: '12px 18px', display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, alignItems: 'center',
                      borderBottom: i < CLIENTES.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#16241f' }}>{c.nombre}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.tel}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#5d6b64' }}>{c.plan}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: BRAND }}>${c.mensual.toLocaleString()}</div>
                    <div style={{ fontSize: 13, color: '#16241f' }}>${c.saldo.toLocaleString()}</div>
                    <div>
                      {c.saldo === 0
                        ? <Badge label="Liquidado" type="ok" />
                        : c.dias_mora > 0
                          ? <Badge label="Mora" type="danger" />
                          : <Badge label="Al corriente" type="neutral" />
                      }
                    </div>
                  </motion.div>
                ))}
              </div>
            </FI>
          )}

          {/* COBRADORES */}
          {sec === 'cobradores' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
              {USUARIOS.filter(u => u.rol === 'cobrador').map((u, i) => {
                const misC = CLIENTES.filter(c => c.cobrador === u.id)
                const conMoraC = misC.filter(c => c.dias_mora > 0).length
                const totalC = misC.reduce((a, c) => a + c.mensual, 0)
                return (
                  <FI key={u.id} d={i * 0.1}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 20,
                      border: '1px solid rgba(15,118,110,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%',
                          background: 'rgba(15,118,110,0.1)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Georgia, serif', fontSize: 18, color: BRAND }}>
                          {u.nombre[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#16241f' }}>{u.nombre}</div>
                          <div style={{ fontSize: 12, color: '#5d6b64' }}>Zona {u.zona}</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {[
                          { l: 'Contratos', v: misC.length.toString(), c: BRAND },
                          { l: 'Mensual', v: `$${totalC.toLocaleString()}`, c: '#16241f' },
                          { l: 'Con mora', v: conMoraC.toString(), c: conMoraC > 0 ? '#b91c1c' : '#15803d' },
                        ].map((s, j) => (
                          <div key={j} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{s.l}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: s.c }}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FI>
                )
              })}
            </div>
          )}

          {/* PAGOS */}
          {sec === 'pagos' && (
            <FI>
              <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(15,118,110,0.1)' }}>
                {PAGOS_HIST.map((p, i) => {
                  const cliente = CLIENTES.find(c => c.id === p.cliente)
                  const cobrador = USUARIOS.find(u => u.id === p.cobrador)
                  return (
                    <div key={p.id} style={{ padding: '14px 18px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderBottom: i < PAGOS_HIST.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#16241f' }}>
                          {cliente?.nombre}
                        </div>
                        <div style={{ fontSize: 11, color: '#5d6b64' }}>
                          {cobrador?.nombre} · {p.metodo} · {p.fecha}
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{p.folio}</div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#15803d' }}>
                        +${p.monto.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </FI>
          )}

          {/* REPORTES */}
          {sec === 'reportes' && (
            <FI>
              <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center',
                border: '1px solid rgba(15,118,110,0.1)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#16241f', marginBottom: 8 }}>Reportes</div>
                <div style={{ fontSize: 13, color: '#5d6b64' }}>Módulo en desarrollo · Fase 2</div>
              </div>
            </FI>
          )}
        </div>
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(15,118,110,0.1)',
        display: 'none', alignItems: 'center', zIndex: 100 }} className="mobile-only">
        {NAV_ADMIN.slice(0, 5).map(({ id, l, I }) => (
          <motion.button key={id} onClick={() => setSec(id)} whileTap={{ scale: 0.9 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '8px 0', border: 'none', cursor: 'pointer', background: 'transparent',
              color: sec === id ? BRAND : '#94a3b8', fontSize: 9,
              textTransform: 'uppercase', letterSpacing: '0.04em', minHeight: 44 }}>
            <I /> <span>{l}</span>
          </motion.button>
        ))}
      </nav>

      <style>{`
        @media(max-width:768px){
          .desktop-only{display:none!important}
          .mobile-only{display:flex!important}
          .admin-main{margin-left:0!important}
        }
        @media(min-width:769px){.mobile-only{display:none!important}}
      `}</style>
    </div>
  )
}

/* ──────────────────────────────────────────
   ROOT
────────────────────────────────────────── */
export default function PremmexApp() {
  const [usuario, setUsuario] = useState<typeof USUARIOS[0] | null>(null)

  return (
    <>
      <Splash />
      <AnimatePresence mode="wait">
        {!usuario ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onLogin={setUsuario} />
          </motion.div>
        ) : usuario.rol === 'cobrador' ? (
          <motion.div key="cobrador" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppCobrador usuario={usuario} onLogout={() => setUsuario(null)} />
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AppAdmin usuario={usuario} onLogout={() => setUsuario(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
