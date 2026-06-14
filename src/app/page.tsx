'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ══════════ THEME ══════════ */
function useTheme() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  useEffect(() => {
    const saved = localStorage.getItem('pmx_theme') as 'light'|'dark'|null
    const t = saved || 'light'
    setTheme(t); document.documentElement.setAttribute('data-theme', t)
  }, [])
  const toggle = () => setTheme(prev => {
    const n = prev === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', n)
    try { localStorage.setItem('pmx_theme', n) } catch {}
    return n
  })
  return { theme, toggle }
}

/* ══════════ ICONS SVG INLINE ══════════ */
type IP = { s?: number; c?: string }
const Ic = {
  globe:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>,
  user:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  gear:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 0 0-1.7-1l-.3-2.6H10.9l-.3 2.6a7.5 7.5 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 0 0 1.7 1l.3 2.6h3.2l.3-2.6a7.5 7.5 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5Z"/></svg>,
  shield: ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="M8.5 12l2.5 2.5L16 9"/></svg>,
  phone:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h3.5l1.5 5-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2 5 1.5V21a1 1 0 0 1-1.1 1A18 18 0 0 1 4 5.1 1 1 0 0 1 5 3Z"/></svg>,
  chat:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-4 4V5Z"/></svg>,
  money:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v6M18 9v6"/></svg>,
  check:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>,
  sun:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  moon:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>,
  doc:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v4h4M9 13h6M9 17h6"/></svg>,
  chart:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/></svg>,
  team:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2 1-3.5 3-3.5s4 1.5 4 3.5"/></svg>,
  bell:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  undo:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10"/></svg>,
  leaf:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16Z"/><path d="M4 20c4-7 8-10 12-12"/></svg>,
  arrow:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  lock:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  plus:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  map:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>,
  x:      ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  pin:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  cancel: ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
  edit:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>,
}

function Mark({ s=28 }: { s?: number }) {
  return <img src="/images/logo.png" alt="PREMMEX" width={s} height={s}
    style={{ width:s,height:s,borderRadius:'50%',objectFit:'cover',boxShadow:'0 0 0 1px var(--border)',background:'#fff' }} />
}
function ThemeBtn({ theme, toggle }: { theme: 'light'|'dark'; toggle: ()=>void }) {
  return <button onClick={toggle} aria-label="Cambiar tema" className="theme-btn">
    {theme==='light' ? <Ic.moon s={17}/> : <Ic.sun s={17}/>}
  </button>
}
function Toast({ msg, ok=true }: { msg: string; ok?: boolean }) {
  return <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="toast"
    style={{ background: ok?'linear-gradient(135deg,var(--brand),var(--brand-2))':'#dc2626' }}>
    {ok ? <Ic.check s={16} c="#fff"/> : <Ic.x s={16} c="#fff"/>} {msg}
  </motion.div>
}

/* ══════════ LOGIN UNIVERSAL ══════════ */
function LoginView({ role, onLogin }: { role: string; onLogin: (data: any)=>void }) {
  const [tab, setTab] = useState<'pin'|'folio'>('pin')
  const [pin, setPin] = useState('')
  const [telefono, setTelefono] = useState('')
  const [folio, setFolio] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const isAdmin = role === 'admin'
  const isSocio = role === 'socio'
  const isCobrador = role === 'cobrador'

  const handleLogin = async () => {
    setLoading(true); setErr('')
    try {
      let res: Response
      if (isAdmin) {
        res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({adminPass}) })
      } else if (isSocio) {
        res = await fetch('/api/cliente/auth', { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify(tab==='folio' ? {folio, pin} : {telefono, pin}) })
      } else {
        res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({pin}) })
      }
      const d = await res.json()
      if (!res.ok) { setErr(d.error || 'Error'); setLoading(false); return }
      onLogin(d)
    } catch { setErr('Error de conexión') }
    setLoading(false)
  }

  const colors = { admin:'#7C3AED', socio:'#059669', cobrador:'#0EA5E9' }
  const color = colors[role as keyof typeof colors] || 'var(--brand)'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mark s={52}/>
          <h1 className="text-3xl font-serif mt-4 tracking-widest" style={{color:'var(--text)'}}>PREMMEX</h1>
          <p className="text-xs mt-1" style={{color}}>
            {isAdmin ? 'Administrador' : isSocio ? 'Portal del Socio' : 'Acceso Cobrador'}
          </p>
        </div>
        <div className="reg-card">
          {isSocio && (
            <div className="flex gap-2 mb-5">
              {(['pin','folio'] as const).map(t => (
                <button key={t} onClick={()=>{setTab(t);setErr('')}} className="tab flex-1"
                  style={tab===t?{background:color,color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
                  {t==='pin' ? 'Teléfono + PIN' : 'N° de Contrato'}
                </button>
              ))}
            </div>
          )}

          {isAdmin ? (
            <label className="field mb-5">
              <span>Contraseña administrador</span>
              <input type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)}
                placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
            </label>
          ) : isSocio && tab==='folio' ? (
            <>
              <label className="field"><span>Número de contrato</span>
                <input value={folio} onChange={e=>setFolio(e.target.value.toUpperCase())} placeholder="PMX-2024-001"/></label>
              <label className="field mb-5"><span>PIN (últimos 4 dígitos de tu tel.)</span>
                <input type="password" maxLength={4} value={pin} onChange={e=>setPin(e.target.value)} placeholder="••••"/></label>
            </>
          ) : isSocio && tab==='pin' ? (
            <>
              <label className="field"><span>Teléfono registrado</span>
                <input type="tel" value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="998 200 0001"/></label>
              <label className="field mb-2"><span>PIN (últimos 4 dígitos de tu tel.)</span>
                <input type="password" maxLength={4} value={pin} onChange={e=>setPin(e.target.value)} placeholder="••••"/></label>
            </>
          ) : (
            /* Cobrador — teclado numerico */
            <div>
              <p className="text-sm mb-4" style={{color:'var(--text-soft)'}}>Ingresa tu PIN de 4 dígitos</p>
              <div className="flex gap-2 justify-center mb-5">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-serif"
                    style={{background:'var(--surface-2)',border:'1.5px solid var(--border)',color:'var(--text)'}}>
                    {pin[i] ? '●' : ''}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['1','2','3','4','5','6','7','8','9','','0','←'].map((k,i) => (
                  <button key={i} onClick={()=>{
                    if(k==='←') setPin(p=>p.slice(0,-1))
                    else if(k && pin.length<4) setPin(p=>p+k)
                  }} className="h-12 rounded-xl text-lg font-medium transition-all active:scale-95"
                    style={{background:k?'var(--surface-2)':'transparent',color:'var(--text)',
                            border:k?'1px solid var(--border)':'none',opacity:k?1:0}}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {err && <p className="text-xs text-center mb-3" style={{color:'#dc2626'}}>{err}</p>}
          <button onClick={handleLogin}
            disabled={loading || (isCobrador ? pin.length<4 : isAdmin ? !adminPass : false)}
            className="btn-primary w-full justify-center"
            style={{opacity:(loading||(!isAdmin&&!isSocio&&pin.length<4))?0.5:1, background:color}}>
            {loading ? 'Verificando...' : 'Entrar'} {!loading && <Ic.arrow s={16} c="#fff"/>}
          </button>
          <p className="text-xs text-center mt-3" style={{color:'var(--text-soft)'}}>
            {isSocio ? 'Tu PIN son los últimos 4 dígitos de tu teléfono' :
             isCobrador ? 'Demo: 1111 · 2222 · 3333 · 4444' : 'admin: premmex2025'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════ ROOT ══════════ */
export default function Home() {
  const [splash, setSplash] = useState(true)
  const [mode, setMode] = useState<string>('publico')
  const [session, setSession] = useState<any>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => { const t = setTimeout(()=>setSplash(false), 2200); return ()=>clearTimeout(t) }, [])

  const handleLogin = (role: string, data: any) => {
    setSession({ role, ...data })
    setMode(role)
  }
  const handleLogout = () => { setSession(null); setMode('publico') }

  const MODES = [
    { key:'publico',  label:'Público',   color:'var(--brand)',  I:Ic.globe },
    { key:'socio',    label:'Mi Contrato', color:'#059669',     I:Ic.shield },
    { key:'cobrador', label:'Cobrador',  color:'#0EA5E9',       I:Ic.user },
    { key:'admin',    label:'Admin',     color:'#7C3AED',       I:Ic.gear },
  ]

  const needsLogin = (m: string) => ['socio','cobrador','admin'].includes(m)

  const handleModeClick = (m: string) => {
    if (m === 'publico') { setMode('publico'); setSession(null); return }
    if (session?.role === m) { setMode(m); return }
    setMode('login_' + m)
  }

  return (<>
    <AnimatePresence>
      {splash && (
        <motion.div initial={{opacity:1}} exit={{opacity:0}} transition={{duration:0.6}}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{background:'var(--bg)'}}>
          <motion.div initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.2,duration:0.6}}>
            <div className="relative w-20 h-20 mx-auto mb-5">
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}}
                className="absolute inset-0 rounded-full"
                style={{border:'2px solid transparent',borderTopColor:'var(--brand)',borderRightColor:'var(--brand-2)'}}/>
              <div className="absolute inset-0 flex items-center justify-center"><Mark s={44}/></div>
            </div>
            <h1 className="text-4xl font-serif tracking-[0.28em] text-center" style={{color:'var(--text)'}}>PREMMEX</h1>
            <p className="text-xs tracking-[0.22em] uppercase text-center mt-2" style={{color:'var(--brand)'}}>Previsión · Mutual · de · México</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* BOTTOM SWITCHER — 4 MODOS */}
    <motion.div initial={{y:100}} animate={{y:0}} transition={{delay:2.4,duration:0.5}}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      style={{display:'flex',gap:'4px',background:'var(--surface)',borderRadius:'999px',
              padding:'5px',boxShadow:'0 8px 30px rgba(0,0,0,0.2)',border:'1px solid var(--border)'}}>
      {MODES.map(m => {
        const active = mode===m.key || mode==='login_'+m.key
        return (
          <button key={m.key} onClick={()=>handleModeClick(m.key)}
            style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRadius:'999px',
                    background:active?m.color:'transparent',color:active?'#fff':'var(--text-soft)',
                    border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,transition:'all .2s'}}>
            <m.I s={14} c={active?'#fff':'var(--text-soft)'}/>
            <span>{m.label}</span>
          </button>
        )
      })}
    </motion.div>

    {/* VISTAS */}
    {mode==='publico' && <PublicoView theme={theme} toggle={toggle}/>}
    {mode.startsWith('login_') && (
      <LoginView role={mode.replace('login_','')}
        onLogin={(d)=>handleLogin(mode.replace('login_',''), d)}/>
    )}
    {mode==='socio' && session && <SocioView theme={theme} toggle={toggle} session={session} onLogout={handleLogout}/>}
    {mode==='cobrador' && session && <CobradorView theme={theme} toggle={toggle} session={session} onLogout={handleLogout}/>}
    {mode==='admin' && session && <AdminView theme={theme} toggle={toggle} session={session} onLogout={handleLogout}/>}
  </>)
}

/* ══════════ PÚBLICO ══════════ */
function PublicoView({ theme, toggle }: { theme: 'light'|'dark'; toggle: ()=>void }) {
  const planes = [
    {name:'Serenidad',price:'$15,000',monthly:'$1,500/mes',features:['Traslado local','Velación 24h','Ataúd digno','Trámites legales']},
    {name:'Paz Familiar',price:'$28,000',monthly:'$2,800/mes',features:['Traslado ilimitado','Velación 48h','Ataúd premium','Flores y recordatorios'],featured:true},
    {name:'Eternidad Plus',price:'$45,000',monthly:'$4,500/mes',features:['Traslado nacional','Velación 72h','Ataúd de lujo','Transmisión + Nicho']},
  ]
  const stats = [{label:'Familias protegidas',value:'12,400+'},{label:'Años de experiencia',value:'28'},{label:'Estados con cobertura',value:'18'}]
  const [toast,setToast] = useState(false)
  const [form,setForm] = useState({nombre:'',email:'',whatsapp:''})
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setToast(true); setForm({nombre:'',email:'',whatsapp:''})
    setTimeout(()=>setToast(false),3000)
  }

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <nav className="fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-3.5 flex items-center justify-between nav-bar">
        <div className="flex items-center gap-2.5"><Mark s={26}/><span className="font-serif text-lg tracking-widest" style={{color:'var(--text)'}}>PREMMEX</span></div>
        <div className="flex items-center gap-3">
          <a href="#planes" className="text-sm hidden md:block nav-link">Planes</a>
          <a href="#registro" className="text-sm hidden md:block nav-link">Contratar</a>
          <ThemeBtn theme={theme} toggle={toggle}/>
        </div>
      </nav>

      <header className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <div className="hero-img"/><div className="hero-veil"/>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:2.4,duration:0.8}} className="text-center max-w-xl relative z-10">
          <span className="badge"><span className="dot"/>PREVISIÓN · DIGNIDAD · CONFIANZA</span>
          <h1 className="text-5xl md:text-6xl font-serif mt-7 mb-5 leading-[1.08]">
            Protegemos<br/><span style={{color:'var(--brand)'}}>lo que más</span><br/>importa
          </h1>
          <p className="text-base mb-9 leading-relaxed" style={{color:'var(--text-soft)'}}>
            Planes funerarios con pagos mensuales cómodos.<br/>Más de 12,400 familias confían en nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#planes" className="btn-primary">Ver planes <Ic.arrow s={16} c="#fff"/></a>
            <a href="#registro" className="btn-outline">Solicitar información</a>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.8}} className="relative z-10 mt-14 flex gap-8 md:gap-16">
          {stats.map((s,i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-serif" style={{color:'var(--brand)'}}>{s.value}</div>
              <div className="text-xs mt-1" style={{color:'var(--text-soft)'}}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </header>

      <section id="planes" className="px-4 py-20 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
          <div className="kicker">NUESTROS PLANES</div>
          <h2 className="text-3xl font-serif mb-2">Elige tu plan</h2>
          <p className="text-sm" style={{color:'var(--text-soft)'}}>Sin letra chica · Cobertura inmediata · Pagos cómodos</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {planes.map((p,i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{delay:i*0.12}} whileHover={{y:-5}} className={`plan-card ${p.featured?'plan-featured':''}`}>
              {p.featured && <div className="plan-badge">Más popular</div>}
              <div className="text-xl font-serif mb-2" style={{color:'var(--brand)'}}>{p.name}</div>
              <div className="text-3xl font-light mb-1">{p.price}</div>
              <div className="text-sm mb-6" style={{color:'var(--brand-2)'}}>{p.monthly}</div>
              <ul className="space-y-2.5 mb-7">
                {p.features.map((f,j) => <li key={j} className="flex items-center gap-2.5 text-sm" style={{color:'var(--text-soft)'}}><Ic.check s={15} c="var(--brand-2)"/>{f}</li>)}
              </ul>
              <a href="#registro" className={p.featured?'btn-primary w-full justify-center':'btn-outline w-full justify-center'}>Contratar</a>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="registro" className="px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="kicker">EMPIEZA HOY</div>
            <h2 className="text-3xl font-serif mb-3">Solicita tu plan</h2>
            <p className="text-sm mb-6 leading-relaxed" style={{color:'var(--text-soft)'}}>Un asesor te contactará sin compromiso para orientarte en el mejor plan para tu familia.</p>
            <div className="flex items-center gap-2 text-sm" style={{color:'var(--brand)'}}><Ic.phone s={16} c="var(--brand)"/>998 717 5692</div>
          </motion.div>
          <motion.form onSubmit={submit} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="reg-card">
            <label className="field"><span>Nombre completo</span><input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="María González"/></label>
            <label className="field"><span>Correo electrónico</span><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="maria@correo.com"/></label>
            <label className="field"><span>WhatsApp</span><input required value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="998 000 0000"/></label>
            <button type="submit" className="btn-primary w-full justify-center mt-1">Solicitar información <Ic.arrow s={16} c="#fff"/></button>
          </motion.form>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="cta-card">
          <Ic.leaf s={34} c="var(--brand)"/>
          <h3 className="text-2xl font-serif mt-3 mb-3">Tu tranquilidad, nuestra misión</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{color:'var(--text-soft)'}}>Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.</p>
        </motion.div>
      </section>

      <footer className="px-6 py-9 text-center text-xs" style={{color:'var(--text-soft)',borderTop:'1px solid var(--border)'}}>
        <div className="flex items-center justify-center gap-2 mb-2"><Mark s={20}/><span className="font-serif tracking-widest" style={{color:'var(--text)'}}>PREMMEX</span></div>
        <div>© 2025 Previsión Mutual de México · Todos los derechos reservados</div>
      </footer>

      <AnimatePresence>{toast && <Toast msg="¡Gracias! Un asesor te contactará pronto."/>}</AnimatePresence>
    </div>
  )
}

/* ══════════ SOCIO/CLIENTE ══════════ */
function SocioView({ theme, toggle, session, onLogout }: { theme: 'light'|'dark'; toggle: ()=>void; session: any; onLogout: ()=>void }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number|null>(null)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  useEffect(() => {
    const socio = session.socio || {}
    if (!socio.cliente_id) { setLoading(false); return }
    fetch(`/api/cliente/contratos?cliente_id=${socio.cliente_id}`)
      .then(r=>r.json()).then(d=>{ setData(d); setLoading(false) })
      .catch(()=>setLoading(false))
  }, [session])

  const contratos = data?.contratos || session.contratos || []
  const pagos = data?.pagos || []
  const socio = session.socio || {}

  const estColor = (e: string) => e==='liquidado'?'#16A34A':e==='atrasado'||e==='cancelado'?'#EA580C':'#059669'
  const estLabel = (e: string) => ({'al_corriente':'Al corriente','atrasado':'Atrasado','liquidado':'Liquidado','cancelado':'Cancelado','por_liquidar':'Por liquidar'}[e]||e)

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-admin)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><Mark s={26}/>
            <div>
              <div className="kicker !mb-0.5" style={{color:'#fff',opacity:0.85}}>MI PREVISIÓN PREMMEX</div>
              <h1 className="text-xl font-serif" style={{color:'#fff'}}>{socio.nombre || 'Mi cuenta'}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={onLogout} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="kicker">MIS CONTRATOS</div>
        {loading ? (
          <div className="space-y-3">{[1,2].map(i=><div key={i} className="card h-28 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div>
        ) : contratos.length === 0 ? (
          <div className="card p-6 text-center" style={{color:'var(--text-soft)'}}>No se encontraron contratos activos.</div>
        ) : (
          <div className="space-y-3">
            {contratos.map((c: any, i: number) => (
              <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="card overflow-hidden">
                <div className="p-4 cursor-pointer" onClick={()=>setSelected(selected===i?null:i)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-serif text-lg" style={{color:'var(--brand)'}}>{c.paquete}</div>
                      <div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio}</div>
                    </div>
                    <div className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{background:`${estColor(c.estado)}22`,color:estColor(c.estado)}}>
                      {estLabel(c.estado)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {label:'Mensualidad',value:`$${parseFloat(c.monto_mensual).toLocaleString()}`},
                      {label:'Saldo pendiente',value:`$${parseFloat(c.saldo_pendiente).toLocaleString()}`},
                      {label:'Día de pago',value:`Día ${c.dia_pago}`},
                    ].map((s,j) => (
                      <div key={j}>
                        <div className="text-xs" style={{color:'var(--text-soft)'}}>{s.label}</div>
                        <div className="font-medium text-sm">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  {parseFloat(c.saldo_pendiente) > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1" style={{color:'var(--text-soft)'}}>
                        <span>Avance</span>
                        <span>{Math.round(((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{background:'var(--surface-2)'}}>
                        <motion.div initial={{width:0}} animate={{width:`${((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100}%`}}
                          transition={{delay:0.5,duration:1}} className="h-full rounded-full" style={{background:'var(--brand)'}}/>
                      </div>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {selected===i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
                        {c.beneficiario && (
                          <div className="mb-3 text-sm">
                            <span style={{color:'var(--text-soft)'}}>Beneficiario: </span>
                            <span style={{color:'var(--brand)'}}>{c.beneficiario}</span>
                          </div>
                        )}
                        <button onClick={()=>showToast('Pago en línea próximamente · Contáctanos al 998 717 5692')} className="btn-primary w-full justify-center">
                          <Ic.money s={16} c="#fff"/>Pagar mensualidad
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {pagos.length > 0 && (
          <>
            <div className="kicker mt-6">HISTORIAL DE PAGOS</div>
            <div className="space-y-2">
              {pagos.slice(0,6).map((p: any, i: number) => (
                <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="card px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm">{p.cobrador || 'Pago registrado'}</div>
                    <div className="text-xs" style={{color:'var(--text-soft)'}}>{p.metodo} · {new Date(p.fecha).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'})}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{color:'#16A34A'}}>+${parseFloat(p.monto).toLocaleString()}</div>
                    <div className="text-xs" style={{color:'var(--text-soft)'}}>{p.recibo_num}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 p-4 rounded-2xl" style={{background:'rgba(5,150,105,0.08)',border:'1px solid rgba(5,150,105,0.2)'}}>
          <div className="flex items-center gap-3">
            <Ic.phone s={20} c="#059669"/>
            <div>
              <div className="text-sm font-medium">¿Necesitas ayuda?</div>
              <a href="tel:9987175692" className="text-xs" style={{color:'#059669'}}>998 717 5692 · Lun-Sáb 9am-7pm</a>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}

/* ══════════ COBRADOR ══════════ */
function CobradorView({ theme, toggle, session, onLogout }: { theme: 'light'|'dark'; toggle: ()=>void; session: any; onLogout: ()=>void }) {
  const [ruta, setRuta] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number|null>(null)
  const [cobrados, setCobrados] = useState<Set<number>>(new Set<number>())
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [recibo, setRecibo] = useState<any>(null)
  const [pagando, setPagando] = useState(false)
  const [tabActivo, setTabActivo] = useState<'ruta'|'mapa'>('ruta')
  const [visitaModal, setVisitaModal] = useState<any>(null)
  const [visitaRslt, setVisitaRslt] = useState<'no_encontrado'|'promesa_pago'|'rechazo'>('no_encontrado')
  const [visitaNota, setVisitaNota] = useState('')

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const cobrador = session.cobrador || session
  const fetchRuta = useCallback(async () => {
    if (!cobrador?.id) { setLoading(false); return }
    setLoading(true)
    try {
      const r = await fetch(`/api/ruta?cobrador_id=${cobrador.id}`)
      const d = await r.json()
      setRuta(d.ruta || [])
    } catch {}
    setLoading(false)
  }, [cobrador?.id])

  useEffect(() => { fetchRuta() }, [fetchRuta])

  // Inicializar mapa con Leaflet
  useEffect(() => {
    if (tabActivo !== 'mapa' || !ruta.length || typeof window === 'undefined') return
    setTimeout(() => {
      const el = document.getElementById('premmex-map')
      if (!el || el.hasAttribute('data-initialized')) return
      el.setAttribute('data-initialized','1')
      // CSS Leaflet
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'; link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      import('leaflet' as any).then((L: any) => {
        const leaflet = L.default || L
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
        const map = leaflet.map('premmex-map').setView([21.1619, -86.8515], 13)
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OSM'}).addTo(map)
        ruta.forEach((c: any) => {
          if (!c.lat || !c.lng) return
          const paid = cobrados.has(c.contrato_id)
          const color = paid ? '#16A34A' : c.estado === 'atrasado' ? '#EA580C' : '#0EA5E9'
          const icon = leaflet.divIcon({
            html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${paid?'✓':'●'}</div>`,
            iconSize:[32,32], className:''
          })
          leaflet.marker([parseFloat(c.lat), parseFloat(c.lng)], {icon})
            .addTo(map)
            .bindPopup(`<b>${c.nombre}</b><br>${c.direccion}<br><b style="color:${color}">$${parseFloat(c.monto_mensual).toLocaleString()}</b>`)
        })
      }).catch(()=>{})
    }, 300)
  }, [tabActivo, ruta, cobrados])

  const cobrar = async (item: any, metodo: string) => {
    setPagando(true)
    try {
      const r = await fetch('/api/cobrar', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({contrato_id:item.contrato_id,cliente_id:item.cliente_id,cobrador_id:cobrador.id,monto:item.monto_mensual,metodo})
      })
      const d = await r.json()
      if (!r.ok) { showToast(d.error||'Error',false); setPagando(false); return }
      setCobrados(prev => new Set(Array.from(prev).concat(item.contrato_id)))
      setRecibo({...item, recibo_num:d.recibo_num, metodo})
      setSelected(null)
      fetchRuta()
    } catch { showToast('Error de conexión',false) }
    setPagando(false)
  }

  const registrarVisita = async () => {
    if (!visitaModal) return
    try {
      let lat, lng
      try {
        const pos = await new Promise<GeolocationPosition>((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{timeout:5000}))
        lat = pos.coords.latitude; lng = pos.coords.longitude
      } catch {}
      await fetch('/api/visita', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({contrato_id:visitaModal.contrato_id,cobrador_id:cobrador.id,resultado:visitaRslt,nota:visitaNota,lat,lng})
      })
      showToast('Visita registrada')
    } catch { showToast('Error al registrar',false) }
    setVisitaModal(null); setVisitaNota(''); setVisitaRslt('no_encontrado')
  }

  const totalCobrado = ruta.filter(r=>cobrados.has(r.contrato_id)).reduce((a,r)=>a+parseFloat(r.monto_mensual),0)
  const totalPendiente = ruta.filter(r=>!cobrados.has(r.contrato_id)).reduce((a,r)=>a+parseFloat(r.monto_mensual),0)

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-cobrador)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-5 flex items-end justify-between">
          <div>
            <div className="kicker !mb-1" style={{color:'#fff',opacity:0.85}}>COBRADOR · MODO CAMPO</div>
            <h1 className="text-2xl font-serif" style={{color:'#fff'}}>{cobrador?.nombre}</h1>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.8)'}}>Zona {cobrador?.zona} · {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'short'})}</div>
          </div>
          <div className="flex gap-2"><ThemeBtn theme={theme} toggle={toggle}/><button onClick={onLogout} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button></div>
        </div>
      </div>

      <div className="px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {[{label:'Cobrado hoy',value:`$${totalCobrado.toLocaleString()}`,color:'#16A34A'},
            {label:'Pendiente',value:`$${totalPendiente.toLocaleString()}`,color:'#EA580C'}].map((s,i) => (
            <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1+i*0.1}} className="card p-4">
              <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.label}</div>
              <div className="text-xl font-serif" style={{color:s.color}}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="flex px-4 pt-5 gap-2 mb-4">
        {[{k:'ruta',l:'Ruta del Día',I:Ic.user},{k:'mapa',l:'Mapa',I:Ic.map}].map(t => (
          <button key={t.k} onClick={()=>setTabActivo(t.k as any)} className="tab"
            style={tabActivo===t.k?{background:'var(--brand)',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
            <t.I s={15} c={tabActivo===t.k?'#fff':'var(--text-soft)'}/>{t.l}
          </button>
        ))}
      </div>

      {tabActivo === 'mapa' && (
        <div className="px-4">
          <div id="premmex-map" style={{height:'calc(100vh - 320px)',width:'100%',borderRadius:'16px',
            background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{textAlign:'center',color:'var(--text-soft)'}}>
              <Ic.map s={32} c="var(--text-soft)"/>
              <p className="text-sm mt-2">Cargando mapa...</p>
            </div>
          </div>
        </div>
      )}

      {tabActivo === 'ruta' && (
        <div className="px-4">
          <div className="kicker">{loading?'...':`RUTA DEL DÍA · ${ruta.length} VISITAS`}</div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card h-20 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div>
          ) : (
            <div className="space-y-3">
              {ruta.map((c,i) => {
                const esCobrado = cobrados.has(c.contrato_id) || parseInt(c.pagos_este_mes||'0') > 0
                return (
                  <motion.div key={c.contrato_id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                    className="card overflow-hidden"
                    style={{borderColor:esCobrado?'rgba(22,163,74,0.45)':c.estado==='atrasado'?'rgba(234,88,12,0.4)':'var(--border)'}}>
                    <div className="px-4 py-3 flex items-center justify-between cursor-pointer" onClick={()=>setSelected(selected===i?null:i)}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{background:esCobrado?'rgba(22,163,74,0.18)':'var(--brand-soft)',color:esCobrado?'#16A34A':'var(--brand)'}}>
                          {esCobrado ? <Ic.check s={16} c="#16A34A"/> : i+1}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{c.nombre}</div>
                          <div className="text-xs" style={{color:'var(--text-soft)'}}>{c.direccion}, {c.colonia}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{color:'var(--brand)'}}>${parseFloat(c.monto_mensual).toLocaleString()}</div>
                        {c.estado==='atrasado'&&!esCobrado&&<div className="text-xs" style={{color:'#EA580C'}}>Atrasado</div>}
                        {esCobrado&&<div className="text-xs" style={{color:'#16A34A'}}>✓ Cobrado</div>}
                      </div>
                    </div>
                    <AnimatePresence>
                      {selected===i && (
                        <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
                            <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Folio: <span style={{color:'var(--text)'}}>{c.folio}</span> · {c.paquete}</div>
                            <div className="text-xs mb-3" style={{color:'var(--text-soft)'}}>Saldo: <span style={{color:'var(--text)'}}>${parseFloat(c.saldo_pendiente).toLocaleString()}</span></div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <a href={`tel:${c.telefono}`} className="qa" style={{background:'rgba(14,165,233,0.12)',color:'#0EA5E9'}}><Ic.phone s={16} c="#0EA5E9"/>Llamar</a>
                              <a href={`https://wa.me/52${c.telefono?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="qa" style={{background:'rgba(22,163,74,0.12)',color:'#16A34A'}}><Ic.chat s={16} c="#16A34A"/>WhatsApp</a>
                            </div>
                            {!esCobrado && (
                              <>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <button onClick={()=>cobrar(c,'efectivo')} disabled={pagando} className="qa" style={{background:'var(--brand-soft)',color:'var(--brand)'}}>
                                    <Ic.money s={16} c="var(--brand)"/>{pagando?'...':'Efectivo'}
                                  </button>
                                  <button onClick={()=>cobrar(c,'mercado_pago')} disabled={pagando} className="qa" style={{background:'rgba(106,27,154,0.1)',color:'#7C3AED'}}>
                                    <Ic.shield s={16} c="#7C3AED"/>{pagando?'...':'M.Pago'}
                                  </button>
                                </div>
                                <button onClick={()=>setVisitaModal(c)} className="qa w-full" style={{background:'rgba(234,88,12,0.1)',color:'#EA580C'}}>
                                  <Ic.pin s={16} c="#EA580C"/>Registrar visita sin cobro
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL RECIBO */}
      <AnimatePresence>
        {recibo && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{background:'rgba(0,0,0,0.6)'}}>
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="reg-card w-full max-w-xs text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(22,163,74,0.15)'}}>
                <Ic.check s={28} c="#16A34A"/>
              </div>
              <h3 className="text-xl font-serif mb-1">¡Cobro registrado!</h3>
              <p className="text-2xl font-serif mt-2" style={{color:'var(--brand)'}}>{recibo.recibo_num}</p>
              <div className="mt-4 mb-5 text-sm space-y-1" style={{color:'var(--text-soft)'}}>
                <div><span>Cliente: </span><span style={{color:'var(--text)'}}>{recibo.nombre}</span></div>
                <div><span>Monto: </span><span style={{color:'#16A34A',fontWeight:600}}>${parseFloat(recibo.monto_mensual).toLocaleString()}</span></div>
                <div><span>Método: </span><span style={{color:'var(--text)'}}>{recibo.metodo}</span></div>
              </div>
              <a href={`https://wa.me/52${recibo.telefono?.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola ${recibo.nombre}, tu pago de $${parseFloat(recibo.monto_mensual).toLocaleString()} para PREMMEX fue registrado. Folio: ${recibo.recibo_num}. Saldo pendiente: $${parseFloat(recibo.saldo_pendiente).toLocaleString()}. ¡Gracias!`)}`}
                target="_blank" rel="noreferrer" className="btn-primary w-full justify-center mb-2" style={{background:'#16A34A'}}>
                <Ic.chat s={16} c="#fff"/>Enviar comprobante WA
              </a>
              <button onClick={()=>setRecibo(null)} className="btn-outline w-full justify-center">Continuar ruta</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL VISITA */}
      <AnimatePresence>
        {visitaModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-end justify-center px-0" style={{background:'rgba(0,0,0,0.5)'}}>
            <motion.div initial={{y:300}} animate={{y:0}} className="w-full max-w-md"
              style={{background:'var(--surface)',borderRadius:'20px 20px 0 0',padding:'24px'}}>
              <h3 className="text-lg font-serif mb-4">Registrar visita — {visitaModal.nombre}</h3>
              <div className="space-y-2 mb-4">
                {[
                  {v:'no_encontrado',l:'No encontrado'},
                  {v:'promesa_pago',l:'Promesa de pago'},
                  {v:'rechazo',l:'Rechazó el cobro'},
                ].map(op => (
                  <button key={op.v} onClick={()=>setVisitaRslt(op.v as any)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm"
                    style={{background:visitaRslt===op.v?'var(--brand)':'var(--surface-2)',
                            color:visitaRslt===op.v?'#fff':'var(--text)',border:'1px solid var(--border)'}}>
                    {op.l}
                  </button>
                ))}
              </div>
              <label className="field mb-4"><span>Nota (opcional)</span>
                <input value={visitaNota} onChange={e=>setVisitaNota(e.target.value)} placeholder="Observaciones..."/></label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setVisitaModal(null)} className="btn-outline">Cancelar</button>
                <button onClick={registrarVisita} className="btn-primary justify-center"><Ic.check s={16} c="#fff"/>Registrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}

/* ══════════ ADMIN ══════════ */
function AdminView({ theme, toggle, session, onLogout }: { theme: 'light'|'dark'; toggle: ()=>void; session: any; onLogout: ()=>void }) {
  const [tab, setTab] = useState<string>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [reportes, setReportes] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [cancelModal, setCancelModal] = useState<any>(null)
  const [reestrModal, setReestrModal] = useState<any>(null)
  const [cancelMotivo, setCancelMotivo] = useState('voluntario')
  const [reestrMensual, setReestrMensual] = useState('')
  const [reestrDia, setReestrDia] = useState('')
  const [folioBusca, setFolioBusca] = useState('')
  const [contratoEncontrado, setContratoEncontrado] = useState<any>(null)
  const [nuevoForm, setNuevoForm] = useState({nombre:'',telefono:'',direccion:'',colonia:'',cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
  const [metaNuevo, setMetaNuevo] = useState<{paquetes:any[];cobradores:any[]}>({paquetes:[],cobradores:[]})
  const [saving, setSaving] = useState(false)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, c, r, m] = await Promise.all([
        fetch('/api/stats').then(x=>x.json()),
        fetch('/api/admin/clientes').then(x=>x.json()),
        fetch('/api/admin/reportes').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
      ])
      setStats(s); setClientes(c.clientes||[]); setReportes(r); setMetaNuevo({paquetes:m.paquetes||[],cobradores:m.cobradores||[]})
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const cancelar = async () => {
    if (!cancelModal) return; setSaving(true)
    try {
      await fetch('/api/admin/cancelar', {method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contrato_id:cancelModal.id,motivo:cancelMotivo})})
      showToast(`Contrato ${cancelModal.folio} cancelado`); setCancelModal(null); fetchAll()
    } catch { showToast('Error',false) }
    setSaving(false)
  }

  const reestructurar = async () => {
    if (!contratoEncontrado) return; setSaving(true)
    try {
      await fetch('/api/admin/reestructurar', {method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contrato_id:contratoEncontrado.id,nuevo_mensual:parseFloat(reestrMensual),dia_pago:parseInt(reestrDia)||5})})
      showToast('Contrato reestructurado'); setContratoEncontrado(null); setFolioBusca(''); fetchAll()
    } catch { showToast('Error',false) }
    setSaving(false)
  }

  const buscarContrato = () => {
    const c = (stats?.contratos_list||[]).find((x: any) => x.folio?.toLowerCase()===folioBusca.toLowerCase())
    if (c) { setContratoEncontrado(c); setReestrMensual(c.monto_mensual); setReestrDia('5') }
    else showToast('Contrato no encontrado',false)
  }

  const guardarContrato = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await fetch('/api/contratos', {method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...nuevoForm,cobrador_id:parseInt(nuevoForm.cobrador_id),paquete_id:parseInt(nuevoForm.paquete_id),dia_pago:parseInt(nuevoForm.dia_pago)})})
      const d = await r.json()
      if (!r.ok) { showToast(d.error||'Error',false); setSaving(false); return }
      showToast(`Contrato ${d.folio} creado`); setNuevoForm({nombre:'',telefono:'',direccion:'',colonia:'',cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
      setTab('contratos'); fetchAll()
    } catch { showToast('Error de conexión',false) }
    setSaving(false)
  }

  const estBadge = (e: string) => e==='liquidado'?{bg:'rgba(22,163,74,0.15)',c:'#16A34A'}:e==='atrasado'||e==='cancelado'?{bg:'rgba(234,88,12,0.15)',c:'#EA580C'}:{bg:'var(--surface-2)',c:'var(--text-soft)'}

  const TABS = [
    {k:'dashboard',l:'Dashboard',I:Ic.chart},
    {k:'contratos',l:'Contratos',I:Ic.doc},
    {k:'clientes',l:'Clientes',I:Ic.team},
    {k:'equipo',l:'Equipo',I:Ic.user},
    {k:'nuevo',l:'+ Contrato',I:Ic.plus},
    {k:'reportes',l:'Reportes',I:Ic.chart},
    {k:'cancelar',l:'Cancelar',I:Ic.cancel},
    {k:'reestructurar',l:'Reestructurar',I:Ic.edit},
  ]

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-admin)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><Mark s={26}/>
            <div>
              <div className="kicker !mb-0.5" style={{color:'#fff',opacity:0.85}}>PANEL ADMINISTRATIVO</div>
              <h1 className="text-xl font-serif" style={{color:'#fff'}}>PREMMEX · Sede Cancún</h1>
            </div>
          </div>
          <div className="flex gap-2"><ThemeBtn theme={theme} toggle={toggle}/><button onClick={onLogout} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button></div>
        </div>
      </div>

      {/* TABS scrollables */}
      <div className="flex px-4 pt-5 gap-2 mb-4 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {TABS.map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)} className="tab whitespace-nowrap"
            style={tab===t.k?{background:'var(--brand)',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
            <t.I s={14} c={tab===t.k?'#fff':'var(--text-soft)'}/>{t.l}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab==='dashboard' && (
        <div className="px-4">
          {loading ? <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i=><div key={i} className="card h-24 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div> : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {label:'Contratos activos',value:stats?.contratos||0,color:'var(--brand)',I:Ic.doc},
                  {label:'Cobrado este mes',value:`$${parseFloat(stats?.cobrado_mes||0).toLocaleString()}`,color:'#16A34A',I:Ic.money},
                  {label:'Por cobrar',value:`$${parseFloat(stats?.pendientes||0).toLocaleString()}`,color:'#EA580C',I:Ic.bell},
                  {label:'Cobrado hoy',value:`$${parseFloat(stats?.cobrado_hoy||0).toLocaleString()}`,color:'#7C3AED',I:Ic.chart},
                ].map((s,i) => (
                  <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} className="card p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:'var(--brand-soft)'}}><s.I s={18} c={s.color}/></div>
                    <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.label}</div>
                    <div className="text-xl font-serif" style={{color:s.color}}>{s.value}</div>
                  </motion.div>
                ))}
              </div>
              <div className="kicker">COBROS RECIENTES</div>
              <div className="space-y-2">
                {(stats?.pagos_recientes||[]).map((p: any,i: number) => (
                  <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.05}} className="card px-4 py-3 flex items-center justify-between">
                    <div><div className="text-sm">{p.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{p.cobrador} · {p.metodo}</div></div>
                    <div className="text-right"><div className="text-sm font-semibold" style={{color:'#16A34A'}}>+${parseFloat(p.monto).toLocaleString()}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{p.recibo_num}</div></div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* CONTRATOS */}
      {tab==='contratos' && (
        <div className="px-4">
          <div className="kicker">CONTRATOS ACTIVOS</div>
          {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card h-20 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div> : (
            <div className="space-y-3">
              {(stats?.contratos_list||[]).map((c: any,i: number) => {
                const b = estBadge(c.estado)
                return (
                  <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} className="card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div><div className="font-medium text-sm">{c.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio} · {c.paquete}</div></div>
                      <div className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:b.bg,color:b.c}}>{c.estado}</div>
                    </div>
                    <div className="flex justify-between text-sm" style={{color:'var(--text-soft)'}}>
                      <span>Mensual: <span style={{color:'var(--brand)'}}>${parseFloat(c.monto_mensual).toLocaleString()}</span></span>
                      <span>Saldo: <span style={{color:'var(--text)'}}>${parseFloat(c.saldo_pendiente).toLocaleString()}</span></span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* CLIENTES */}
      {tab==='clientes' && (
        <div className="px-4">
          <div className="kicker">DIRECTORIO DE CLIENTES ({clientes.length})</div>
          {loading ? <div className="space-y-2">{[1,2,3,4].map(i=><div key={i} className="card h-16 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div> : (
            <div className="space-y-2">
              {clientes.map((c: any,i: number) => (
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="card px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{c.nombre}</div>
                    <div className="text-xs" style={{color:'var(--text-soft)'}}>{c.cobrador_nombre||'Sin cobrador'} · Zona {c.zona||'-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm" style={{color:'var(--brand)'}}>{c.num_contratos} contrato{c.num_contratos!==1?'s':''}</div>
                    <a href={`tel:${c.telefono}`} className="text-xs" style={{color:'var(--text-soft)'}}>{c.telefono}</a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EQUIPO */}
      {tab==='equipo' && (
        <div className="px-4">
          <div className="kicker">RENDIMIENTO DEL EQUIPO</div>
          <div className="space-y-4">
            {(stats?.cobradores||[]).map((c: any,i: number) => {
              const pct = Math.min(100,Math.round((parseFloat(c.cobrado_mes||0)/20000)*100))
              return (
                <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}} className="card p-4">
                  <div className="flex justify-between mb-3">
                    <div><div className="font-medium">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>Zona {c.zona} · {c.contratos_asignados} contratos</div></div>
                    <div className="text-right"><div className="font-semibold" style={{color:'var(--brand)'}}>${parseFloat(c.cobrado_mes||0).toLocaleString()}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{pct}% de meta</div></div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--surface-2)'}}>
                    <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.3+i*0.1,duration:0.8}}
                      className="h-full rounded-full" style={{background:pct>=90?'#16A34A':pct>=70?'var(--brand)':'#EA580C'}}/>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* NUEVO CONTRATO */}
      {tab==='nuevo' && (
        <div className="px-4">
          <div className="kicker">NUEVO CONTRATO</div>
          <form onSubmit={guardarContrato} className="reg-card">
            {[
              {f:'nombre',l:'Nombre del titular',p:'María González Pérez'},
              {f:'telefono',l:'Teléfono / WhatsApp',p:'998 200 0000'},
              {f:'direccion',l:'Dirección',p:'Av. Tulum 123'},
              {f:'colonia',l:'Colonia',p:'Centro'},
              {f:'beneficiario',l:'Beneficiario',p:'Juan González'},
            ].map(({f,l,p}) => (
              <label key={f} className="field"><span>{l}</span>
                <input required value={(nuevoForm as any)[f]} onChange={e=>setNuevoForm({...nuevoForm,[f]:e.target.value})} placeholder={p}/></label>
            ))}
            <label className="field"><span>Paquete</span>
              <select value={nuevoForm.paquete_id} onChange={e=>setNuevoForm({...nuevoForm,paquete_id:e.target.value})}>
                {metaNuevo.paquetes.map(p=><option key={p.id} value={p.id}>{p.nombre} — ${parseFloat(p.precio).toLocaleString()}</option>)}
              </select></label>
            <label className="field"><span>Cobrador asignado</span>
              <select value={nuevoForm.cobrador_id} onChange={e=>setNuevoForm({...nuevoForm,cobrador_id:e.target.value})}>
                {metaNuevo.cobradores.map(c=><option key={c.id} value={c.id}>{c.nombre} — Zona {c.zona}</option>)}
              </select></label>
            <label className="field"><span>Día de pago</span>
              <input type="number" min="1" max="28" value={nuevoForm.dia_pago} onChange={e=>setNuevoForm({...nuevoForm,dia_pago:e.target.value})}/></label>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
              {saving?'Guardando...':'Crear contrato'} {!saving && <Ic.arrow s={16} c="#fff"/>}
            </button>
          </form>
        </div>
      )}

      {/* REPORTES */}
      {tab==='reportes' && (
        <div className="px-4">
          <div className="kicker">REPORTE DE COBRANZA</div>
          {loading || !reportes ? <div className="card h-40 animate-pulse" style={{background:'var(--surface-2)'}}/> : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="card p-4">
                  <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Mes actual</div>
                  <div className="text-xl font-serif" style={{color:'#16A34A'}}>${parseFloat(reportes.mes_actual||0).toLocaleString()}</div>
                </div>
                <div className="card p-4">
                  <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Mes anterior</div>
                  <div className="text-xl font-serif" style={{color:'var(--text-soft)'}}>${parseFloat(reportes.mes_anterior||0).toLocaleString()}</div>
                </div>
              </div>
              <div className="kicker">EFICIENCIA POR COBRADOR</div>
              <div className="space-y-3 mb-4">
                {(reportes.por_cobrador||[]).map((c: any,i: number) => {
                  const pct = Math.min(100,Math.round((parseFloat(c.cobrado_mes||0)/Math.max(parseFloat(c.meta||20000),1))*100))
                  return (
                    <div key={i} className="card p-4">
                      <div className="flex justify-between mb-2">
                        <div><div className="font-medium text-sm">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>Zona {c.zona}</div></div>
                        <div className="text-right"><div style={{color:'var(--brand)',fontWeight:600}}>${parseFloat(c.cobrado_mes||0).toLocaleString()}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{pct}%</div></div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--surface-2)'}}>
                        <div className="h-full rounded-full" style={{width:`${pct}%`,background:pct>=80?'#16A34A':'var(--brand)',transition:'width 1s'}}/>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="kicker">ESTADO DE CARTERA</div>
              <div className="card p-4">
                {(reportes.cartera||[]).map((c: any,i: number) => (
                  <div key={i} className="flex justify-between py-2" style={{borderBottom:'1px solid var(--border)'}}>
                    <span className="text-sm" style={{color:'var(--text-soft)'}}>{c.estado}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium">{c.total}</span>
                      <span className="text-xs ml-2" style={{color:'var(--text-soft)'}}>${parseFloat(c.saldo).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              {(reportes.riesgo||[]).length>0 && (
                <>
                  <div className="kicker mt-4">⚠️ CONTRATOS EN RIESGO</div>
                  <div className="space-y-2">
                    {(reportes.riesgo||[]).map((c: any,i: number) => (
                      <div key={i} className="card px-4 py-3 flex justify-between" style={{borderColor:'rgba(234,88,12,0.3)'}}>
                        <div><div className="text-sm">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.cobrador} · {c.folio}</div></div>
                        <div className="text-sm font-medium" style={{color:'#EA580C'}}>${parseFloat(c.monto_mensual).toLocaleString()}/mes</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* CANCELAR */}
      {tab==='cancelar' && (
        <div className="px-4">
          <div className="kicker">CANCELACIÓN DE CONTRATOS</div>
          <p className="text-xs mb-4" style={{color:'var(--text-soft)'}}>Selecciona un contrato activo para cancelarlo. Esta acción es irreversible.</p>
          {loading ? <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="card h-16 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div> : (
            <div className="space-y-2">
              {(stats?.contratos_list||[]).filter((c:any)=>c.estado!=='cancelado'&&c.estado!=='liquidado').map((c: any,i: number) => (
                <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="card px-4 py-3 flex items-center justify-between">
                  <div><div className="text-sm font-medium">{c.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio} · {c.paquete}</div></div>
                  <button onClick={()=>setCancelModal(c)} className="qa" style={{background:'rgba(234,88,12,0.1)',color:'#EA580C',padding:'8px 14px'}}>
                    <Ic.cancel s={15} c="#EA580C"/>Cancelar
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REESTRUCTURAR */}
      {tab==='reestructurar' && (
        <div className="px-4">
          <div className="kicker">REESTRUCTURACIÓN DE PLAN</div>
          <div className="reg-card">
            <p className="text-xs mb-4" style={{color:'var(--text-soft)'}}>Busca el contrato por folio y modifica el monto mensual o el día de cobro.</p>
            <div className="flex gap-2 mb-4">
              <input value={folioBusca} onChange={e=>setFolioBusca(e.target.value.toUpperCase())}
                placeholder="PMX-2024-001" className="flex-1"
                style={{background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'10px 14px',color:'var(--text)',fontSize:'14px'}}/>
              <button onClick={buscarContrato} className="btn-primary" style={{padding:'10px 18px'}}>Buscar</button>
            </div>
            {contratoEncontrado && (
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <div className="card p-4 mb-4">
                  <div className="font-medium">{contratoEncontrado.cliente}</div>
                  <div className="text-xs" style={{color:'var(--text-soft)'}}>{contratoEncontrado.folio} · {contratoEncontrado.paquete}</div>
                  <div className="text-sm mt-1">Mensual actual: <span style={{color:'var(--brand)'}}>${parseFloat(contratoEncontrado.monto_mensual).toLocaleString()}</span></div>
                </div>
                <label className="field"><span>Nuevo monto mensual</span>
                  <input type="number" value={reestrMensual} onChange={e=>setReestrMensual(e.target.value)} placeholder="2800"/></label>
                <label className="field"><span>Nuevo día de pago</span>
                  <input type="number" min="1" max="28" value={reestrDia} onChange={e=>setReestrDia(e.target.value)} placeholder="5"/></label>
                <button onClick={reestructurar} disabled={saving} className="btn-primary w-full justify-center mt-2">
                  {saving?'Guardando...':'Aplicar reestructuración'} <Ic.check s={16} c="#fff"/>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CANCELAR */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{background:'rgba(0,0,0,0.6)'}}>
            <motion.div initial={{scale:0.8}} animate={{scale:1}} className="reg-card w-full max-w-xs">
              <h3 className="text-lg font-serif mb-1">Cancelar contrato</h3>
              <p className="text-sm mb-4" style={{color:'var(--text-soft)'}}>{cancelModal.cliente} · {cancelModal.folio}</p>
              <label className="field mb-4"><span>Motivo de cancelación</span>
                <select value={cancelMotivo} onChange={e=>setCancelMotivo(e.target.value)}>
                  <option value="voluntario">Decisión voluntaria</option>
                  <option value="pago">Falta de pago</option>
                  <option value="fallecimiento">Fallecimiento</option>
                  <option value="otro">Otro</option>
                </select></label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setCancelModal(null)} className="btn-outline">Cancelar</button>
                <button onClick={cancelar} disabled={saving} className="btn-primary justify-center" style={{background:'#dc2626'}}>
                  {saving?'...':'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
