'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ══════════════════════════════════════════
   TIPOS
══════════════════════════════════════════ */
type Role = 'admin' | 'cobrador'
type AdminTab = 'dashboard' | 'contratos' | 'clientes' | 'cobradores' | 'pagos'
type CobradorTab = 'ruta' | 'cobros' | 'clientes' | 'perfil'

/* ══════════════════════════════════════════
   API HELPER
══════════════════════════════════════════ */
const api = async (path: string, body?: object) => {
  const r = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.json()
}

/* ══════════════════════════════════════════
   ICONOS
══════════════════════════════════════════ */
const IC = {
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  map:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  money:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  file:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  grid:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  phone:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  wa:      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.859L.073 23.27a.75.75 0 00.906.919l5.555-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.001-1.371l-.36-.213-3.708.976.992-3.617-.234-.374A9.818 9.818 0 0112 2.182c5.429 0 9.818 4.389 9.818 9.818S17.429 21.818 12 21.818z"/></svg>,
  logout:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  copy:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  close:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

/* ══════════════════════════════════════════
   HELPERS UI
══════════════════════════════════════════ */
const B = '#0f766e'  // brand green

const FI = ({ c, d = 0 }: { c: React.ReactNode; d?: number }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: d, ease: 'easeOut' }}>{c}</motion.div>
)

const Badge = ({ label, type }: { label: string; type: 'ok'|'warn'|'danger'|'neutral'|'info' }) => {
  const s = { ok:{bg:'#dcfce7',c:'#15803d'}, warn:{bg:'#fef9c3',c:'#854d0e'},
    danger:{bg:'#fee2e2',c:'#b91c1c'}, neutral:{bg:'#f1f5f9',c:'#475569'}, info:{bg:'#dbeafe',c:'#1d4ed8'} }[type]
  return <span style={{ padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:600, background:s.bg, color:s.c }}>{label}</span>
}

const Divider = () => <div style={{ height:1, background:'rgba(15,118,110,0.08)', margin:'2px 0' }}/>

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid rgba(15,118,110,0.1)',
      boxShadow:'0 2px 8px rgba(15,118,110,0.04)', ...style }}>
      {children}
    </div>
  )
}

function Btn({ children, onClick, variant='primary', style, disabled }:
  { children: React.ReactNode; onClick?: () => void; variant?: 'primary'|'outline'|'ghost'|'danger'
    style?: React.CSSProperties; disabled?: boolean }) {
  const v = {
    primary: { background:`linear-gradient(135deg, ${B}, #15a07f)`, color:'#fff', border:'none' },
    outline: { background:'transparent', color:B, border:`1.5px solid ${B}` },
    ghost:   { background:'rgba(15,118,110,0.08)', color:B, border:'none' },
    danger:  { background:'#fee2e2', color:'#b91c1c', border:'1px solid #fca5a5' },
  }[variant]
  return (
    <motion.button whileTap={{ scale:0.97 }} onClick={onClick} disabled={disabled}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        padding:'11px 20px', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer',
        opacity: disabled ? 0.6 : 1, fontFamily:'inherit', ...v, ...style }}>
      {children}
    </motion.button>
  )
}

/* ══════════════════════════════════════════
   SPLASH
══════════════════════════════════════════ */
function Splash() {
  const [v, setV] = useState(true)
  useEffect(() => { const t = setTimeout(() => setV(false), 2000); return () => clearTimeout(t) }, [])
  return (
    <AnimatePresence>
      {v && (
        <motion.div initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
          style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', background:'#f4f7f4' }}>
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.7, ease:'easeOut' }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:B,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <rect x="18" y="4" width="4" height="32" rx="2" fill="white"/>
                <rect x="4" y="18" width="32" height="4" rx="2" fill="white"/>
              </svg>
            </div>
            <div style={{ fontFamily:'Cormorant Garamond, Georgia, serif', fontSize:30,
              letterSpacing:'0.18em', color:'#16241f' }}>PREMMEX</div>
            <div style={{ fontSize:11, color:'#5d6b64', letterSpacing:'0.08em' }}>
              Previsión · Mutual · de · México
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */
function Login({ onLogin }: { onLogin: (rol: Role, data: any) => void }) {
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!telefono.trim() || !password.trim()) { setError('Ingresa tu teléfono y contraseña'); return }
    setLoading(true); setError('')
    try {
      const res = await api('/api/auth/login', { telefono: telefono.trim(), password })
      if (res.ok) {
        onLogin(res.rol, res.user)
      } else {
        setError(res.error || 'Datos incorrectos')
      }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#f4f7f4', display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <FI d={0.1} c={
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:60, height:60, borderRadius:16, background:B,
            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="18" y="4" width="4" height="32" rx="2" fill="white"/>
              <rect x="4" y="18" width="32" height="4" rx="2" fill="white"/>
            </svg>
          </div>
          <div style={{ fontFamily:'Cormorant Garamond, Georgia, serif', fontSize:26,
            letterSpacing:'0.15em', color:'#16241f' }}>PREMMEX</div>
          <div style={{ fontSize:12, color:'#5d6b64', marginTop:4 }}>Sistema de gestión interno</div>
        </div>
      }/>

      <FI d={0.15} c={
        <Card style={{ width:'100%', maxWidth:360, padding:28 }}>
          <div style={{ fontSize:18, fontWeight:700, color:'#16241f', marginBottom:4 }}>Acceso al sistema</div>
          <div style={{ fontSize:13, color:'#5d6b64', marginBottom:24 }}>
            Ingresa con tu teléfono y contraseña
          </div>

          {[
            { label:'Teléfono', value:telefono, onChange:setTelefono, placeholder:'391 100 0000', type:'tel' },
            { label:'Contraseña', value:password, onChange:setPassword, placeholder:'••••••••', type:'password' },
          ].map((f,i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#5d6b64',
                textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7 }}>{f.label}</label>
              <input type={f.type} value={f.value} placeholder={f.placeholder}
                onChange={e => f.onChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width:'100%', padding:'11px 14px', borderRadius:10, fontSize:14,
                  border:'1.5px solid rgba(15,118,110,0.18)', background:'#f4f7f4',
                  color:'#16241f', outline:'none', boxSizing:'border-box',
                  fontFamily:'inherit' }}/>
            </div>
          ))}

          {error && (
            <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10,
              background:'#fee2e2', color:'#b91c1c', fontSize:13 }}>{error}</div>
          )}

          <Btn onClick={handleLogin} disabled={loading} style={{ width:'100%' }}>
            {loading ? 'Verificando...' : 'Entrar →'}
          </Btn>

          <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#5d6b64' }}>
            ¿Problemas? Llama al{' '}
            <a href="tel:+523916100449" style={{ color:B, fontWeight:600 }}>391 610 0449</a>
          </div>
        </Card>
      }/>
    </div>
  )
}

/* ══════════════════════════════════════════
   MODAL COBRO
══════════════════════════════════════════ */
function ModalCobro({ cliente, onConfirm, onClose }: {
  cliente: any; onConfirm: (metodo: string) => void; onClose: () => void
}) {
  const [metodo, setMetodo] = useState('efectivo')
  const [loading, setLoading] = useState(false)

  const confirmar = async () => {
    setLoading(true)
    await onConfirm(metodo)
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(22,36,31,0.55)',
        backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-end' }}
      onClick={onClose}>
      <motion.div initial={{ y:300 }} animate={{ y:0 }} exit={{ y:300 }}
        transition={{ type:'spring', damping:28, stiffness:300 }}
        style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#fff',
          borderRadius:'24px 24px 0 0', padding:'24px 24px 32px',
          boxShadow:'0 -8px 40px rgba(15,118,110,0.12)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width:36, height:4, borderRadius:2, background:'#e2e8f0', margin:'0 auto 20px' }}/>
        
        <div style={{ fontSize:11, color:'#5d6b64', textTransform:'uppercase',
          letterSpacing:'0.08em', marginBottom:4 }}>REGISTRAR COBRO</div>
        <div style={{ fontSize:18, fontWeight:700, color:'#16241f', marginBottom:2 }}>
          {cliente.cliente_nombre}
        </div>
        <div style={{ fontSize:13, color:'#5d6b64', marginBottom:6 }}>
          {cliente.ncontrato} · {cliente.plan_clave}
        </div>

        <div style={{ textAlign:'center', margin:'20px 0' }}>
          <div style={{ fontSize:11, color:'#5d6b64', marginBottom:4 }}>MONTO DE LA CUOTA</div>
          <div style={{ fontFamily:'Cormorant Garamond, Georgia, serif', fontSize:44,
            fontWeight:700, color:B }}>
            ${Number(cliente.monto_cuota).toLocaleString()}
          </div>
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:'#5d6b64', textTransform:'uppercase',
          letterSpacing:'0.07em', marginBottom:10 }}>Forma de pago</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20 }}>
          {[['efectivo','💵','Efectivo'],['transferencia','🏦','Transfer.'],['tarjeta','💳','Tarjeta']].map(([m,e,l]) => (
            <button key={m} onClick={() => setMetodo(m)}
              style={{ padding:'10px 4px', borderRadius:12, fontSize:11, fontWeight:600,
                cursor:'pointer', border:`1.5px solid ${metodo===m ? B : '#e2e8f0'}`,
                background: metodo===m ? 'rgba(15,118,110,0.08)' : '#f8fafc',
                color: metodo===m ? B : '#94a3b8', fontFamily:'inherit' }}>
              {e} {l}
            </button>
          ))}
        </div>

        <Btn onClick={confirmar} disabled={loading} style={{ width:'100%', marginBottom:10 }}>
          {loading ? 'Registrando...' : '✓ Confirmar cobro'}
        </Btn>
        <Btn onClick={onClose} variant="ghost" style={{ width:'100%' }}>Cancelar</Btn>
      </motion.div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════
   APP COBRADOR
══════════════════════════════════════════ */
function AppCobrador({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [tab, setTab] = useState<CobradorTab>('ruta')
  const [ruta, setRuta] = useState<any[]>([])
  const [misClientes, setMisClientes] = useState<any[]>([])
  const [cobrosHoy, setCobrosHoy] = useState<any[]>([])
  const [expandido, setExpandido] = useState<string|null>(null)
  const [showCobro, setShowCobro] = useState<any|null>(null)
  const [loading, setLoading] = useState(true)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const [rutaRes, clientesRes, cobrosRes] = await Promise.all([
        api(`/api/cobrador/ruta?cobrador_id=${user.id}`),
        api(`/api/cobrador/clientes?cobrador_id=${user.id}`),
        api(`/api/cobrador/cobros-hoy?cobrador_id=${user.id}`),
      ])
      setRuta(rutaRes.data || [])
      setMisClientes(clientesRes.data || [])
      setCobrosHoy(cobrosRes.data || [])
    } catch {}
    setLoading(false)
  }, [user.id])

  useEffect(() => { cargar() }, [cargar])

  const registrarCobro = async (metodo: string) => {
    if (!showCobro) return
    await api('/api/cobrador/registrar-cobro', {
      contrato_id: showCobro.contrato_id,
      cliente_id: showCobro.cliente_id,
      cobrador_id: user.id,
      monto: showCobro.monto_cuota,
      metodo,
    })
    setShowCobro(null)
    cargar()
  }

  const totalCobrado = cobrosHoy.reduce((a: number, p: any) => a + Number(p.monto), 0)
  const pendienteCount = ruta.filter((c: any) => !cobrosHoy.find((p: any) => p.contrato_id === c.contrato_id && new Date(p.fecha).toDateString() === new Date().toDateString())).length

  const TABS_COB: { id: CobradorTab; l: string; icon: React.ReactNode }[] = [
    { id:'ruta',     l:'Ruta',     icon: IC.map   },
    { id:'cobros',   l:'Cobros',   icon: IC.money  },
    { id:'clientes', l:'Clientes', icon: IC.users  },
    { id:'perfil',   l:'Perfil',   icon: IC.user   },
  ]

  return (
    <>
      <AnimatePresence>
        {showCobro && (
          <ModalCobro cliente={showCobro} onConfirm={registrarCobro} onClose={() => setShowCobro(null)}/>
        )}
      </AnimatePresence>

      <div style={{ minHeight:'100vh', background:'#f4f7f4', paddingBottom:80 }}>
        {/* Header */}
        <div style={{ padding:'14px 20px', background:'#fff', borderBottom:'1px solid rgba(15,118,110,0.1)',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontFamily:'Cormorant Garamond, Georgia, serif', fontSize:17,
              letterSpacing:'0.12em', color:'#16241f' }}>PREMMEX</div>
            <div style={{ fontSize:11, color:'#5d6b64' }}>{user.nombre} · Zona {user.zona}</div>
          </div>
          <button onClick={onLogout} style={{ width:36, height:36, borderRadius:10, border:'1px solid #e2e8f0',
            background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center',
            justifyContent:'center', color:'#94a3b8' }}>
            <div style={{ width:18, height:18 }}>{IC.logout}</div>
          </button>
        </div>

        <div style={{ padding:'16px 16px 0' }}>

          {/* RUTA */}
          {tab === 'ruta' && (
            <>
              <FI d={0} c={
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:'#5d6b64', textTransform:'uppercase',
                    letterSpacing:'0.08em', marginBottom:2 }}>RUTA DE HOY</div>
                  <div style={{ fontSize:20, fontWeight:700, color:'#16241f' }}>
                    {loading ? '...' : `${ruta.length} visitas asignadas`}
                  </div>
                </div>
              }/>

              <FI d={0.05} c={
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                  <Card style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:11, color:'#5d6b64', marginBottom:4 }}>Cobrado hoy</div>
                    <div style={{ fontFamily:'Georgia, serif', fontSize:22, color:B, fontWeight:700 }}>
                      ${totalCobrado.toLocaleString()}
                    </div>
                    <div style={{ fontSize:11, color:'#5d6b64' }}>{cobrosHoy.length} cobros</div>
                  </Card>
                  <Card style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:11, color:'#5d6b64', marginBottom:4 }}>Por cobrar</div>
                    <div style={{ fontFamily:'Georgia, serif', fontSize:22, color:'#f59e0b', fontWeight:700 }}>
                      {pendienteCount}
                    </div>
                    <div style={{ fontSize:11, color:'#5d6b64' }}>pendientes</div>
                  </Card>
                </div>
              }/>

              {loading ? (
                <Card style={{ padding:40, textAlign:'center' }}>
                  <div style={{ color:'#5d6b64' }}>Cargando ruta...</div>
                </Card>
              ) : ruta.length === 0 ? (
                <Card style={{ padding:40, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>✅</div>
                  <div style={{ color:'#5d6b64' }}>Sin visitas pendientes hoy</div>
                </Card>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {ruta.map((c: any, i: number) => {
                    const cobradoHoy = cobrosHoy.find((p: any) => p.contrato_id === c.contrato_id)
                    const open = expandido === c.contrato_id
                    return (
                      <FI key={c.contrato_id} d={i*0.05} c={
                        <Card style={{ overflow:'hidden', opacity: cobradoHoy ? 0.72 : 1,
                          borderColor: cobradoHoy ? '#86efac' : c.dias_mora > 0 ? '#fcd34d' : undefined }}>
                          <div style={{ padding:'14px 16px', display:'flex', alignItems:'center',
                            justifyContent:'space-between', cursor:'pointer' }}
                            onClick={() => setExpandido(open ? null : c.contrato_id)}>
                            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                              <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                                background: cobradoHoy ? '#dcfce7' : 'rgba(15,118,110,0.08)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                color: cobradoHoy ? '#15803d' : B }}>
                                <div style={{ width:18, height:18 }}>
                                  {cobradoHoy ? IC.check : <span style={{ fontFamily:'Georgia,serif', fontSize:14, fontWeight:700 }}>{i+1}</span>}
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>
                                  {c.cliente_nombre}
                                </div>
                                <div style={{ fontSize:11, color:'#5d6b64' }}>{c.domicilio}</div>
                                {c.dias_mora > 0 && !cobradoHoy && (
                                  <div style={{ fontSize:10, color:'#b45309', fontWeight:600, marginTop:2 }}>
                                    ⚠ {c.dias_mora} días de mora
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:15, fontWeight:700, color: cobradoHoy ? '#15803d' : B }}>
                                ${Number(c.monto_cuota).toLocaleString()}
                              </div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>{c.plan_clave}</div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {open && !cobradoHoy && (
                              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                                exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
                                <div style={{ padding:'8px 16px 16px',
                                  borderTop:'1px solid rgba(15,118,110,0.08)' }}>
                                  <div style={{ fontSize:11, color:'#5d6b64', marginBottom:10 }}>
                                    {c.ncontrato} · Saldo: ${Number(c.saldo_pendiente).toLocaleString()}
                                  </div>
                                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                                    <a href={`tel:${c.telefono}`}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center',
                                        padding:'10px 4px', borderRadius:12, fontSize:11, fontWeight:600,
                                        gap:4, textDecoration:'none', background:'#eff6ff', color:'#1d4ed8' }}>
                                      <div style={{ width:18, height:18 }}>{IC.phone}</div> Llamar
                                    </a>
                                    <a href={`https://wa.me/52${c.telefono}`}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center',
                                        padding:'10px 4px', borderRadius:12, fontSize:11, fontWeight:600,
                                        gap:4, textDecoration:'none', background:'#f0fdf4', color:'#15803d' }}>
                                      <div style={{ width:18, height:18 }}>{IC.wa}</div> WhatsApp
                                    </a>
                                    <button onClick={() => setShowCobro(c)}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center',
                                        padding:'10px 4px', borderRadius:12, fontSize:11, fontWeight:600,
                                        gap:4, cursor:'pointer', border:'none',
                                        background:'rgba(15,118,110,0.08)', color:B, fontFamily:'inherit' }}>
                                      <div style={{ width:18, height:18 }}>{IC.money}</div> Cobrar
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      }/>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* COBROS HOY */}
          {tab === 'cobros' && (
            <>
              <FI d={0} c={
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:'#5d6b64', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>
                    COBROS DEL DÍA
                  </div>
                  <div style={{ fontSize:20, fontWeight:700, color:'#16241f' }}>
                    ${totalCobrado.toLocaleString()} recaudado
                  </div>
                </div>
              }/>
              {cobrosHoy.length === 0 ? (
                <Card style={{ padding:40, textAlign:'center' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>📋</div>
                  <div style={{ color:'#5d6b64' }}>Sin cobros registrados aún hoy</div>
                </Card>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {cobrosHoy.map((p: any, i: number) => (
                    <FI key={p.id} d={i*0.05} c={
                      <Card style={{ padding:'13px 16px', display:'flex',
                        justifyContent:'space-between', alignItems:'center' }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>{p.cliente_nombre}</div>
                          <div style={{ fontSize:11, color:'#5d6b64' }}>
                            {p.metodo} · {p.ncontrato} · {new Date(p.fecha).toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})}
                          </div>
                        </div>
                        <div style={{ fontSize:16, fontWeight:700, color:'#15803d' }}>
                          +${Number(p.monto).toLocaleString()}
                        </div>
                      </Card>
                    }/>
                  ))}
                  <FI d={0.2} c={
                    <Card style={{ padding:'14px 16px', display:'flex', justifyContent:'space-between',
                      background:'rgba(15,118,110,0.04)', border:'1.5px solid rgba(15,118,110,0.2)' }}>
                      <span style={{ fontWeight:700, color:'#16241f' }}>Total</span>
                      <span style={{ fontFamily:'Georgia, serif', fontSize:20, fontWeight:700, color:B }}>
                        ${totalCobrado.toLocaleString()}
                      </span>
                    </Card>
                  }/>
                </div>
              )}
            </>
          )}

          {/* MIS CLIENTES */}
          {tab === 'clientes' && (
            <>
              <FI d={0} c={
                <div style={{ fontSize:12, color:'#5d6b64', textTransform:'uppercase',
                  letterSpacing:'0.08em', marginBottom:14 }}>
                  MIS CLIENTES · {misClientes.length} contratos
                </div>
              }/>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {misClientes.map((c: any, i: number) => (
                  <FI key={c.id} d={i*0.05} c={
                    <Card style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>{c.nombre}</div>
                          <div style={{ fontSize:11, color:'#5d6b64' }}>{c.plan_clave} · {c.domicilio}</div>
                          <div style={{ fontSize:11, color:'#5d6b64' }}>📱 {c.telefono}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:13, fontWeight:700, color:B }}>
                            ${Number(c.monto_cuota || 0).toLocaleString()}/mes
                          </div>
                          <Badge label={c.estado?.replace('_',' ') || 'activo'}
                            type={c.estado==='liquidado'?'ok':c.estado==='atrasado'?'danger':'neutral'}/>
                        </div>
                      </div>
                    </Card>
                  }/>
                ))}
              </div>
            </>
          )}

          {/* PERFIL */}
          {tab === 'perfil' && (
            <FI d={0} c={
              <div style={{ textAlign:'center' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', margin:'8px auto 14px',
                  background:'rgba(15,118,110,0.1)', border:'2px solid rgba(15,118,110,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Georgia, serif', fontSize:28, color:B }}>
                  {user.nombre?.[0]}
                </div>
                <div style={{ fontSize:18, fontWeight:700, color:'#16241f' }}>{user.nombre}</div>
                <div style={{ fontSize:13, color:'#5d6b64', marginBottom:24 }}>Cobrador · Zona {user.zona}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                  <Card style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:11, color:'#5d6b64', marginBottom:4 }}>Contratos</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:B, fontWeight:700 }}>
                      {misClientes.length}
                    </div>
                  </Card>
                  <Card style={{ padding:'14px 16px' }}>
                    <div style={{ fontSize:11, color:'#5d6b64', marginBottom:4 }}>Cobrado hoy</div>
                    <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#15803d', fontWeight:700 }}>
                      ${totalCobrado.toLocaleString()}
                    </div>
                  </Card>
                </div>
                <Btn onClick={onLogout} variant="danger" style={{ width:'100%' }}>
                  <div style={{ width:18, height:18 }}>{IC.logout}</div> Cerrar sesión
                </Btn>
              </div>
            }/>
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position:'fixed', bottom:0, left:0, right:0, height:64,
        background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)',
        borderTop:'1px solid rgba(15,118,110,0.1)',
        display:'flex', alignItems:'center', zIndex:100 }}>
        {TABS_COB.map(({ id, l, icon }) => (
          <motion.button key={id} onClick={() => setTab(id)} whileTap={{ scale:0.9 }}
            style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              padding:'8px 0', border:'none', cursor:'pointer', background:'transparent',
              color: tab===id ? B : '#94a3b8', fontSize:10, textTransform:'uppercase',
              letterSpacing:'0.04em', minHeight:44 }}>
            <div style={{ width:22, height:22 }}>{icon}</div>
            <span>{l}</span>
          </motion.button>
        ))}
      </nav>
    </>
  )
}

/* ══════════════════════════════════════════
   APP ADMIN
══════════════════════════════════════════ */
function AppAdmin({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [sec, setSec] = useState<AdminTab>('dashboard')
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [newCobrador, setNewCobrador] = useState({ nombre:'', telefono:'', zona:'' })
  const [inviteLink, setInviteLink] = useState('')
  const [showNuevoContrato, setShowNuevoContrato] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api('/api/admin/dashboard')
      setData(res.data || {})
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const crearInvitacion = async () => {
    if (!newCobrador.nombre || !newCobrador.telefono) return
    const res = await api('/api/admin/invitar-cobrador', newCobrador)
    if (res.ok) {
      const link = `${window.location.origin}/registro?token=${res.token}`
      setInviteLink(link)
    }
  }

  const NAV_ADMIN: { id: AdminTab; l: string; icon: React.ReactNode }[] = [
    { id:'dashboard',  l:'Dashboard',  icon: IC.grid  },
    { id:'contratos',  l:'Contratos',  icon: IC.file  },
    { id:'clientes',   l:'Clientes',   icon: IC.users },
    { id:'cobradores', l:'Cobradores', icon: IC.map   },
    { id:'pagos',      l:'Pagos',      icon: IC.money },
  ]

  return (
    <>
      {/* MODAL INVITAR COBRADOR */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(22,36,31,0.55)',
              backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-end' }}
            onClick={() => { setShowInvite(false); setInviteLink(''); setNewCobrador({nombre:'',telefono:'',zona:''}) }}>
            <motion.div initial={{ y:300 }} animate={{ y:0 }} exit={{ y:300 }}
              transition={{ type:'spring', damping:28, stiffness:300 }}
              style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#fff',
                borderRadius:'24px 24px 0 0', padding:'24px 24px 36px' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontSize:17, fontWeight:700, color:'#16241f' }}>Invitar cobrador</div>
                <button onClick={() => { setShowInvite(false); setInviteLink(''); }}
                  style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #e2e8f0',
                    background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center',
                    justifyContent:'center', color:'#94a3b8' }}>
                  <div style={{ width:14, height:14 }}>{IC.close}</div>
                </button>
              </div>

              {!inviteLink ? (
                <>
                  <div style={{ fontSize:13, color:'#5d6b64', marginBottom:20, lineHeight:1.5 }}>
                    Ingresa los datos del cobrador. Se generará un link que podrás enviar por WhatsApp para que se registre.
                  </div>
                  {[['Nombre completo','nombre','Ej: Juan Pérez Gómez'],
                    ['Teléfono','telefono','391 100 0000'],
                    ['Zona asignada','zona','Centro / Norte / Sur']].map(([l,k,p]) => (
                    <div key={k} style={{ marginBottom:14 }}>
                      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#5d6b64',
                        textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{l}</label>
                      <input placeholder={p} value={(newCobrador as any)[k]}
                        onChange={e => setNewCobrador(prev => ({ ...prev, [k]: e.target.value }))}
                        style={{ width:'100%', padding:'11px 14px', borderRadius:10, fontSize:14,
                          border:'1.5px solid rgba(15,118,110,0.18)', background:'#f4f7f4',
                          color:'#16241f', outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}/>
                    </div>
                  ))}
                  <Btn onClick={crearInvitacion} style={{ width:'100%' }}>
                    Generar link de invitación
                  </Btn>
                </>
              ) : (
                <>
                  <div style={{ padding:16, borderRadius:12, background:'#f0fdf4',
                    border:'1px solid rgba(15,118,110,0.2)', marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:B, marginBottom:8 }}>
                      ✅ LINK GENERADO
                    </div>
                    <div style={{ fontSize:12, color:'#5d6b64', wordBreak:'break-all', lineHeight:1.5 }}>
                      {inviteLink}
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <Btn onClick={() => navigator.clipboard.writeText(inviteLink)} variant="outline" style={{ width:'100%' }}>
                      <div style={{ width:16, height:16 }}>{IC.copy}</div> Copiar
                    </Btn>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Hola ${newCobrador.nombre}, te invitamos a registrarte en el sistema PREMMEX. Ingresa aquí: ${inviteLink}`)}`}
                      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
                        padding:'11px 20px', borderRadius:12, fontSize:13, fontWeight:600,
                        background:'#dcfce7', color:'#15803d', textDecoration:'none', border:'none' }}>
                      <div style={{ width:16, height:16 }}>{IC.wa}</div> Enviar WA
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', minHeight:'100vh', background:'#f4f7f4' }}>
        {/* SIDEBAR DESKTOP */}
        <aside className="desktop-only" style={{ width:240, flexShrink:0, background:'#fff',
          borderRight:'1px solid rgba(15,118,110,0.1)', position:'fixed', top:0, bottom:0, left:0,
          display:'flex', flexDirection:'column', zIndex:20 }}>
          <div style={{ padding:'22px 20px', borderBottom:'1px solid rgba(15,118,110,0.08)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:B,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <rect x="18" y="4" width="4" height="32" rx="2" fill="white"/>
                  <rect x="4" y="18" width="32" height="4" rx="2" fill="white"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily:'Cormorant Garamond, Georgia, serif', fontSize:16,
                  letterSpacing:'0.12em', color:'#16241f' }}>PREMMEX</div>
                <div style={{ fontSize:10, color:'#5d6b64' }}>Administración</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1, padding:'12px 0', overflowY:'auto' }}>
            {NAV_ADMIN.map(({ id, l, icon }) => (
              <button key={id} onClick={() => setSec(id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'10px 20px',
                  border:'none', cursor:'pointer',
                  background: sec===id ? 'rgba(15,118,110,0.08)' : 'transparent',
                  color: sec===id ? B : '#5d6b64',
                  borderLeft: `2px solid ${sec===id ? B : 'transparent'}`,
                  fontSize:13, fontFamily:'inherit', transition:'all 150ms', textAlign:'left' }}>
                <div style={{ width:17, height:17, flexShrink:0 }}>{icon}</div>{l}
              </button>
            ))}
          </nav>
          <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(15,118,110,0.08)' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#16241f' }}>{user.nombre}</div>
            <div style={{ fontSize:11, color:'#5d6b64', marginBottom:10 }}>Administrador</div>
            <button onClick={onLogout}
              style={{ width:'100%', padding:'8px', borderRadius:8, border:'none',
                background:'#fee2e2', color:'#b91c1c', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="admin-main" style={{ flex:1, marginLeft:240, paddingBottom:80, overflowY:'auto' }}>
          <div style={{ padding:'13px 20px', background:'#fff', display:'flex', alignItems:'center',
            justifyContent:'space-between', borderBottom:'1px solid rgba(15,118,110,0.1)',
            position:'sticky', top:0, zIndex:10 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#16241f' }}>
                {NAV_ADMIN.find(n => n.id === sec)?.l}
              </div>
              <div style={{ fontSize:11, color:'#5d6b64' }}>Capilla de Guadalupe, Jal.</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {sec === 'cobradores' && (
                <Btn onClick={() => setShowInvite(true)} style={{ padding:'8px 14px', fontSize:12 }}>
                  <div style={{ width:14, height:14 }}>{IC.plus}</div> Invitar cobrador
                </Btn>
              )}
              {sec === 'contratos' && (
                <Btn onClick={() => setShowNuevoContrato(true)} style={{ padding:'8px 14px', fontSize:12 }}>
                  <div style={{ width:14, height:14 }}>{IC.plus}</div> Nuevo contrato
                </Btn>
              )}
            </div>
          </div>

          <div style={{ padding:20 }}>
            {loading ? (
              <Card style={{ padding:40, textAlign:'center' }}>
                <div style={{ color:'#5d6b64' }}>Cargando...</div>
              </Card>
            ) : (
              <>
                {/* DASHBOARD */}
                {sec === 'dashboard' && (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',
                      gap:12, marginBottom:24 }}>
                      {[
                        { l:'Contratos activos', v: data.totalContratos || '0', c:B, i:'📋' },
                        { l:'Saldo pendiente',   v: `$${Number(data.totalSaldo||0).toLocaleString()}`, c:'#f59e0b', i:'⏳' },
                        { l:'Cobrado mes',       v: `$${Number(data.cobradoMes||0).toLocaleString()}`, c:'#15803d', i:'💰' },
                        { l:'Con mora',          v: data.conMora || '0', c:'#b91c1c', i:'⚠️' },
                      ].map((s,i) => (
                        <FI key={i} d={i*0.07} c={
                          <Card style={{ padding:18 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                              <span style={{ fontSize:11, color:'#5d6b64' }}>{s.l}</span>
                              <span style={{ fontSize:16 }}>{s.i}</span>
                            </div>
                            <div style={{ fontFamily:'Georgia, serif', fontSize:24, color:s.c, fontWeight:700 }}>
                              {s.v}
                            </div>
                          </Card>
                        }/>
                      ))}
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                      <FI d={0.2} c={
                        <Card style={{ padding:20 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:'#5d6b64', textTransform:'uppercase',
                            letterSpacing:'0.07em', marginBottom:14 }}>⚠ MORA</div>
                          {(data.mora || []).length === 0
                            ? <div style={{ color:'#5d6b64', fontSize:13 }}>Sin clientes en mora 🎉</div>
                            : (data.mora || []).map((c: any, i: number) => (
                              <div key={i}>
                                {i > 0 && <Divider/>}
                                <div style={{ padding:'10px 0', display:'flex', justifyContent:'space-between' }}>
                                  <div>
                                    <div style={{ fontSize:13, fontWeight:600, color:'#16241f' }}>{c.cliente_nombre}</div>
                                    <div style={{ fontSize:11, color:'#5d6b64' }}>{c.plan_clave} · {c.dias_mora}d</div>
                                  </div>
                                  <Badge label={`$${Number(c.saldo_pendiente).toLocaleString()}`} type="danger"/>
                                </div>
                              </div>
                            ))
                          }
                        </Card>
                      }/>
                      <FI d={0.25} c={
                        <Card style={{ padding:20 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:'#5d6b64', textTransform:'uppercase',
                            letterSpacing:'0.07em', marginBottom:14 }}>ÚLTIMOS PAGOS</div>
                          {(data.ultimosPagos || []).map((p: any, i: number) => (
                            <div key={i}>
                              {i > 0 && <Divider/>}
                              <div style={{ padding:'10px 0', display:'flex', justifyContent:'space-between' }}>
                                <div>
                                  <div style={{ fontSize:13, fontWeight:600, color:'#16241f' }}>{p.cliente_nombre}</div>
                                  <div style={{ fontSize:11, color:'#5d6b64' }}>{p.cobrador_nombre} · {p.metodo}</div>
                                </div>
                                <div style={{ fontSize:14, fontWeight:700, color:'#15803d' }}>
                                  +${Number(p.monto).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </Card>
                      }/>
                    </div>
                  </>
                )}

                {/* CONTRATOS */}
                {sec === 'contratos' && (
                  <FI d={0} c={
                    <Card style={{ overflow:'hidden' }}>
                      {(data.contratos || []).map((c: any, i: number) => (
                        <div key={c.id}>
                          {i > 0 && <Divider/>}
                          <div style={{ padding:'13px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                              <div style={{ fontSize:13, fontWeight:700, color:B }}>{c.ncontrato}</div>
                              <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>{c.cliente_nombre}</div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>
                                {c.plan_clave} · {c.cobrador_nombre} · Día {c.dia_pago} de cada mes
                              </div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:14, fontWeight:700, color:B }}>
                                ${Number(c.monto_cuota).toLocaleString()}/mes
                              </div>
                              <div style={{ fontSize:12, color:'#5d6b64', marginBottom:4 }}>
                                Saldo: ${Number(c.saldo_pendiente).toLocaleString()}
                              </div>
                              <Badge label={c.estado?.replace('_',' ')||'activo'}
                                type={c.estado==='liquidado'?'ok':c.estado==='atrasado'?'danger':c.estado==='por_liquidar'?'warn':'neutral'}/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card>
                  }/>
                )}

                {/* CLIENTES */}
                {sec === 'clientes' && (
                  <FI d={0} c={
                    <Card style={{ overflow:'hidden' }}>
                      {(data.clientes || []).map((c: any, i: number) => (
                        <div key={c.id}>
                          {i > 0 && <Divider/>}
                          <div style={{ padding:'13px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                              <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>{c.nombre}</div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>{c.domicilio}, {c.colonia}</div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>📱 {c.telefono}</div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:12, color:'#5d6b64' }}>{c.cobrador_nombre}</div>
                              <Badge label={c.municipio} type="neutral"/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card>
                  }/>
                )}

                {/* COBRADORES */}
                {sec === 'cobradores' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
                    {(data.cobradores || []).map((c: any, i: number) => (
                      <FI key={c.id} d={i*0.09} c={
                        <Card style={{ padding:20 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                            <div style={{ width:44, height:44, borderRadius:'50%',
                              background:'rgba(15,118,110,0.1)', display:'flex', alignItems:'center',
                              justifyContent:'center', fontFamily:'Georgia,serif', fontSize:18, color:B }}>
                              {c.nombre?.[0]}
                            </div>
                            <div>
                              <div style={{ fontSize:14, fontWeight:700, color:'#16241f' }}>{c.nombre}</div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>Zona {c.zona}</div>
                            </div>
                          </div>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                            {[
                              { l:'Contratos', v:c.total_contratos||'0', col:B },
                              { l:'Con mora',  v:c.con_mora||'0',       col:Number(c.con_mora)>0?'#b91c1c':'#15803d' },
                            ].map((s,j) => (
                              <div key={j} style={{ background:'#f8fafc', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                                <div style={{ fontSize:10, color:'#94a3b8', marginBottom:2 }}>{s.l}</div>
                                <div style={{ fontSize:16, fontWeight:700, color:s.col }}>{s.v}</div>
                              </div>
                            ))}
                          </div>
                          <Badge label={c.registrado ? 'Activo' : 'Pendiente registro'}
                            type={c.registrado ? 'ok' : 'warn'}/>
                        </Card>
                      }/>
                    ))}
                  </div>
                )}

                {/* PAGOS */}
                {sec === 'pagos' && (
                  <FI d={0} c={
                    <Card style={{ overflow:'hidden' }}>
                      {(data.pagos || []).map((p: any, i: number) => (
                        <div key={p.id}>
                          {i > 0 && <Divider/>}
                          <div style={{ padding:'13px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                              <div style={{ fontSize:14, fontWeight:600, color:'#16241f' }}>{p.cliente_nombre}</div>
                              <div style={{ fontSize:11, color:'#5d6b64' }}>
                                {p.cobrador_nombre} · {p.metodo} · {new Date(p.fecha).toLocaleDateString('es-MX')}
                              </div>
                              <div style={{ fontSize:10, color:'#94a3b8' }}>{p.ncontrato}</div>
                            </div>
                            <div style={{ fontSize:16, fontWeight:700, color:'#15803d' }}>
                              +${Number(p.monto).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card>
                  }/>
                )}
              </>
            )}
          </div>
        </main>

        {/* BOTTOM NAV MOBILE */}
        <nav className="mobile-only" style={{ position:'fixed', bottom:0, left:0, right:0, height:64,
          background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)',
          borderTop:'1px solid rgba(15,118,110,0.1)',
          display:'none', alignItems:'center', zIndex:100 }}>
          {NAV_ADMIN.map(({ id, l, icon }) => (
            <motion.button key={id} onClick={() => setSec(id)} whileTap={{ scale:0.9 }}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                padding:'8px 0', border:'none', cursor:'pointer', background:'transparent',
                color: sec===id ? B : '#94a3b8', fontSize:9, textTransform:'uppercase',
                letterSpacing:'0.04em', minHeight:44 }}>
              <div style={{ width:20, height:20 }}>{icon}</div><span>{l}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-only{display:none!important}
          .mobile-only{display:flex!important}
          .admin-main{margin-left:0!important}
        }
        @media(min-width:769px){.mobile-only{display:none!important}}
      `}</style>
    </>
  )
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function PremmexERP() {
  const [session, setSession] = useState<{ rol: Role; user: any } | null>(null)

  const handleLogin = (rol: Role, user: any) => setSession({ rol, user })
  const handleLogout = () => setSession(null)

  return (
    <>
      <Splash/>
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div key="login" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <Login onLogin={handleLogin}/>
          </motion.div>
        ) : session.rol === 'cobrador' ? (
          <motion.div key="cobrador" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <AppCobrador user={session.user} onLogout={handleLogout}/>
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <AppAdmin user={session.user} onLogout={handleLogout}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
