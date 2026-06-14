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

/* ══════════ ICONS ══════════ */
type IP = { s?: number; c?: string }
const Ic = {
  globe:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>,
  user:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  gear:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 0 0-1.7-1l-.3-2.6H10.9l-.3 2.6a7.5 7.5 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 0 0 1.7 1l.3 2.6h3.2l.3-2.6a7.5 7.5 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5Z"/></svg>,
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
  shield: ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="M8.5 12l2.5 2.5L16 9"/></svg>,
  x:      ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
}

function Mark({ s=28 }: { s?: number }) {
  return <img src="/images/logo.png" alt="PREMMEX" width={s} height={s}
    style={{ width:s,height:s,borderRadius:'50%',objectFit:'cover',boxShadow:'0 0 0 1px var(--border)',background:'#fff' }} />
}
function ThemeBtn({ theme, toggle }: { theme: 'light'|'dark'; toggle: () => void }) {
  return <button onClick={toggle} aria-label="Cambiar tema" className="theme-btn">
    {theme==='light' ? <Ic.moon s={17}/> : <Ic.sun s={17}/>}
  </button>
}
function Toast({ msg, ok=true }: { msg: string; ok?: boolean }) {
  return <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="toast"
    style={{ background: ok ? 'linear-gradient(135deg,var(--brand),var(--brand-2))' : '#dc2626' }}>
    {ok ? <Ic.check s={16} c="#fff"/> : <Ic.x s={16} c="#fff"/>} {msg}
  </motion.div>
}

/* ══════════ LOGIN SCREEN ══════════ */
function LoginView({ onLogin }: { onLogin: (role: string, data: any) => void }) {
  const [tab, setTab] = useState<'cobrador'|'admin'>('cobrador')
  const [pin, setPin] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const handleLogin = async () => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(tab==='cobrador' ? {pin} : {adminPass: pass})
      })
      const d = await res.json()
      if (!res.ok) { setErr(d.error || 'Error'); setLoading(false); return }
      onLogin(d.role, d.cobrador || { nombre: 'Administrador' })
    } catch { setErr('Error de conexión'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mark s={52}/>
          <h1 className="text-3xl font-serif mt-4 tracking-widest" style={{color:'var(--text)'}}>PREMMEX</h1>
          <p className="text-xs mt-1 tracking-widest uppercase" style={{color:'var(--brand)'}}>Previsión · Mutual · de · México</p>
        </div>
        <div className="reg-card">
          <div className="flex gap-2 mb-6">
            {(['cobrador','admin'] as const).map(t => (
              <button key={t} onClick={()=>{setTab(t);setErr('');setPin('');setPass('')}}
                className="tab flex-1" style={tab===t?{background:'var(--brand)',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
                {t==='cobrador'?<Ic.user s={15} c={tab===t?'#fff':'var(--text-soft)'}/>:<Ic.lock s={15} c={tab===t?'#fff':'var(--text-soft)'}/>}
                {t==='cobrador'?'Cobrador':'Administrador'}
              </button>
            ))}
          </div>
          {tab==='cobrador' ? (
            <div>
              <p className="text-sm mb-4" style={{color:'var(--text-soft)'}}>Ingresa tu PIN de 4 dígitos</p>
              <div className="flex gap-2 justify-center mb-6">
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
                    style={{background: k?'var(--surface-2)':'transparent', color:'var(--text)',
                            border: k?'1px solid var(--border)':'none',
                            opacity: k?1:0}}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <label className="field mb-6">
              <span>Contraseña de administrador</span>
              <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
                placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/>
            </label>
          )}
          {err && <p className="text-xs text-center mb-3" style={{color:'#dc2626'}}>{err}</p>}
          <button onClick={handleLogin} disabled={loading||(tab==='cobrador'?pin.length<4:!pass)}
            className="btn-primary w-full justify-center"
            style={{opacity:(loading||(tab==='cobrador'?pin.length<4:!pass))?0.5:1}}>
            {loading?'Verificando...':'Entrar'} {!loading && <Ic.arrow s={16} c="#fff"/>}
          </button>
          <p className="text-xs text-center mt-3" style={{color:'var(--text-soft)'}}>Demo: cobrador PIN 1111 · admin: premmex2025</p>
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
    setMode(role as any)
  }
  const handleLogout = () => { setSession(null); setMode('publico') }

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
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.8,duration:1.2}}
            className="absolute bottom-12 h-[3px] w-48 rounded-full"
            style={{background:'linear-gradient(90deg,transparent,var(--brand),var(--brand-2),transparent)',transformOrigin:'left'}}/>
        </motion.div>
      )}
    </AnimatePresence>

    {/* MODE SWITCHER */}
    <motion.div initial={{y:100}} animate={{y:0}} transition={{delay:2.4,duration:0.5}}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 switcher" style={{minWidth:'300px'}}>
      {(['publico','cobrador','admin'] as const).map(m => {
        const meta = {publico:{c:'var(--brand)',l:'Público',I:Ic.globe},cobrador:{c:'#0EA5E9',l:'Cobrador',I:Ic.user},admin:{c:'#7C3AED',l:'Admin',I:Ic.gear}}[m]
        return (
          <button key={m} onClick={()=>{
            if(m==='publico'){setMode('publico');setSession(null)}
            else if(!session||session.role!==m) setMode(m==='cobrador'?'login_cobrador':'login_admin' as any)
            else setMode(m)
          }} className="switcher-btn"
            style={{background:mode===m?meta.c:'transparent',color:mode===m?'#fff':'var(--text-soft)'}}>
            <meta.I s={15} c={mode===m?'#fff':'var(--text-soft)'}/>
            <span>{meta.l}</span>
          </button>
        )
      })}
    </motion.div>

    {(mode==='login_cobrador'||mode==='login_admin') && (
      <LoginView onLogin={handleLogin}/>
    )}
    {mode==='publico' && <PublicoView theme={theme} toggle={toggle} onDemo={()=>setMode('login_cobrador' as any)}/>}
    {mode==='cobrador' && session && <CobradorView theme={theme} toggle={toggle} session={session} onLogout={handleLogout}/>}
    {mode==='admin' && session && <AdminView theme={theme} toggle={toggle} session={session} onLogout={handleLogout}/>}
  </>)
}

/* ══════════ PÚBLICO ══════════ */
function PublicoView({ theme, toggle, onDemo }: { theme: 'light'|'dark'; toggle: ()=>void; onDemo: ()=>void }) {
  const stats = [{label:'Familias protegidas',value:'12,400+'},{label:'Años de experiencia',value:'28'},{label:'Estados con cobertura',value:'18'}]
  const planes = [
    {name:'Serenidad',price:'$15,000',monthly:'$1,500/mes',features:['Traslado local','Velación 24h','Ataúd digno','Trámites legales']},
    {name:'Paz Familiar',price:'$28,000',monthly:'$2,800/mes',features:['Traslado ilimitado','Velación 48h','Ataúd premium','Flores y recordatorios'],featured:true},
    {name:'Eternidad Plus',price:'$45,000',monthly:'$4,500/mes',features:['Traslado nacional','Velación 72h','Ataúd de lujo','Transmisión + Nicho']},
  ]
  const [toast,setToast] = useState(false)
  const [form,setForm] = useState({nombre:'',email:'',whatsapp:''})
  const submit = (e: React.FormEvent) => { e.preventDefault(); setToast(true); setForm({nombre:'',email:'',whatsapp:''}); setTimeout(()=>setToast(false),3000) }

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <nav className="fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-3.5 flex items-center justify-between nav-bar">
        <div className="flex items-center gap-2.5"><Mark s={26}/><span className="font-serif text-lg tracking-widest" style={{color:'var(--text)'}}>PREMMEX</span></div>
        <div className="flex items-center gap-3">
          <a href="#planes" className="text-sm hidden md:block nav-link">Planes</a>
          <a href="#registro" className="text-sm hidden md:block nav-link">Contratar</a>
          <ThemeBtn theme={theme} toggle={toggle}/>
          <button onClick={onDemo} className="btn-ghost text-xs">Mi contrato</button>
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
            <button onClick={onDemo} className="btn-outline">Explorar demo</button>
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
                {p.features.map((f,j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm" style={{color:'var(--text-soft)'}}>
                    <Ic.check s={15} c="var(--brand-2)"/>{f}
                  </li>
                ))}
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
            <p className="text-sm mb-6 leading-relaxed" style={{color:'var(--text-soft)'}}>
              Déjanos tus datos y un asesor te contactará sin compromiso.
            </p>
            <button onClick={onDemo} className="btn-outline"><Ic.shield s={16} c="var(--brand)"/>Explorar demo sin registro</button>
          </motion.div>
          <motion.form onSubmit={submit} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="reg-card">
            <label className="field"><span>Nombre completo</span>
              <input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="María González"/></label>
            <label className="field"><span>Correo electrónico</span>
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="maria@correo.com"/></label>
            <label className="field"><span>WhatsApp</span>
              <input required value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="998 000 0000"/></label>
            <button type="submit" className="btn-primary w-full justify-center mt-1">Solicitar contacto <Ic.arrow s={16} c="#fff"/></button>
            <p className="text-[11px] text-center mt-1" style={{color:'var(--text-soft)'}}>Demostración · no se envían datos reales</p>
          </motion.form>
        </div>
      </section>

      <section className="px-4 py-16 text-center">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="cta-card">
          <Ic.leaf s={34} c="var(--brand)"/>
          <h3 className="text-2xl font-serif mt-3 mb-3">Tu tranquilidad, nuestra misión</h3>
          <p className="text-sm mb-6 leading-relaxed max-w-md mx-auto" style={{color:'var(--text-soft)'}}>
            Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-medium" style={{color:'var(--brand)'}}>
            <Ic.phone s={16} c="var(--brand)"/>998 717 5692
          </div>
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

/* ══════════ COBRADOR ══════════ */
function CobradorView({ theme, toggle, session, onLogout }: { theme: 'light'|'dark'; toggle: ()=>void; session: any; onLogout: ()=>void }) {
  const [ruta, setRuta] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number|null>(null)
  const [cobrados, setCobrados] = useState<Set<number>>(new Set<number>())
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [recibo, setRecibo] = useState<string|null>(null)
  const [pagando, setPagando] = useState(false)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const fetchRuta = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/ruta?cobrador_id=${session.id}`)
      const d = await r.json()
      setRuta(d.ruta || [])
    } catch { showToast('Error cargando ruta','false' as any) }
    setLoading(false)
  }, [session.id])

  useEffect(() => { fetchRuta() }, [fetchRuta])

  const cobrar = async (item: any, metodo: string) => {
    setPagando(true)
    try {
      const r = await fetch('/api/cobrar', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          contrato_id: item.contrato_id, cliente_id: item.cliente_id,
          cobrador_id: session.id, monto: item.monto_mensual, metodo
        })
      })
      const d = await r.json()
      if (!r.ok) { showToast(d.error || 'Error al cobrar', false); setPagando(false); return }
      setCobrados(prev => new Set(Array.from(prev).concat(item.contrato_id)))
      setRecibo(d.recibo_num)
      showToast(`Cobro registrado · ${d.recibo_num}`)
      setSelected(null)
      fetchRuta()
    } catch { showToast('Error de conexión', false) }
    setPagando(false)
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
            <h1 className="text-2xl font-serif" style={{color:'#fff'}}>{session.nombre}</h1>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.8)'}}>Zona {session.zona} · {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'short'})}</div>
          </div>
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={onLogout} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {[{label:'Cobrado hoy',value:`$${totalCobrado.toLocaleString()}`,color:'#16A34A'},{label:'Pendiente',value:`$${totalPendiente.toLocaleString()}`,color:'#EA580C'}].map((s,i) => (
            <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1+i*0.1}} className="card p-4">
              <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.label}</div>
              <div className="text-xl font-serif" style={{color:s.color}}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="kicker">RUTA DEL DÍA · {loading?'...':`${ruta.length} VISITAS`}</div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i=><div key={i} className="card h-20 animate-pulse" style={{background:'var(--surface-2)'}}/>)}
          </div>
        ) : (
          <div className="space-y-3">
            {ruta.map((c,i) => {
              const esCobrado = cobrados.has(c.contrato_id) || parseInt(c.pagos_este_mes) > 0
              return (
                <motion.div key={c.contrato_id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  className="card overflow-hidden"
                  style={{borderColor: esCobrado?'rgba(22,163,74,0.45)':c.estado==='atrasado'?'rgba(234,88,12,0.4)':'var(--border)'}}>
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
                      {c.estado==='atrasado' && !esCobrado && <div className="text-xs" style={{color:'#EA580C'}}>Atrasado</div>}
                      {esCobrado && <div className="text-xs" style={{color:'#16A34A'}}>Cobrado</div>}
                    </div>
                  </div>
                  <AnimatePresence>
                    {selected===i && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
                          <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Folio: <span style={{color:'var(--text)'}}>{c.folio}</span> · {c.paquete}</div>
                          <div className="text-xs mb-3" style={{color:'var(--text-soft)'}}>Saldo pendiente: <span style={{color:'var(--text)'}}>${parseFloat(c.saldo_pendiente).toLocaleString()}</span></div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <a href={`tel:${c.telefono}`} className="qa" style={{background:'rgba(14,165,233,0.12)',color:'#0EA5E9'}}>
                              <Ic.phone s={16} c="#0EA5E9"/>Llamar
                            </a>
                            <a href={`https://wa.me/52${c.telefono?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="qa" style={{background:'rgba(22,163,74,0.12)',color:'#16A34A'}}>
                              <Ic.chat s={16} c="#16A34A"/>WhatsApp
                            </a>
                          </div>
                          {!esCobrado && (
                            <div className="grid grid-cols-2 gap-2">
                              <button onClick={()=>cobrar(c,'efectivo')} disabled={pagando} className="qa"
                                style={{background:'var(--brand-soft)',color:'var(--brand)'}}>
                                <Ic.money s={16} c="var(--brand)"/>{pagando?'...':'Efectivo'}
                              </button>
                              <button onClick={()=>cobrar(c,'mercado_pago')} disabled={pagando} className="qa"
                                style={{background:'rgba(106,27,154,0.1)',color:'#7C3AED'}}>
                                <Ic.shield s={16} c="#7C3AED"/>{pagando?'...':'M. Pago'}
                              </button>
                            </div>
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

      {recibo && (
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
          className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="reg-card w-full max-w-xs text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{background:'rgba(22,163,74,0.15)'}}>
              <Ic.check s={28} c="#16A34A"/>
            </div>
            <h3 className="text-xl font-serif mb-1">¡Cobro registrado!</h3>
            <p className="text-2xl font-serif mt-2 mb-1" style={{color:'var(--brand)'}}>{recibo}</p>
            <p className="text-xs mb-5" style={{color:'var(--text-soft)'}}>Número de recibo</p>
            <button onClick={()=>setRecibo(null)} className="btn-primary w-full justify-center">Continuar ruta <Ic.arrow s={16} c="#fff"/></button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}

/* ══════════ ADMIN ══════════ */
function AdminView({ theme, toggle, session, onLogout }: { theme: 'light'|'dark'; toggle: ()=>void; session: any; onLogout: ()=>void }) {
  const [tab, setTab] = useState<'dashboard'|'contratos'|'equipo'|'nuevo'>('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [form, setForm] = useState({nombre:'',telefono:'',direccion:'',colonia:'',cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
  const [paquetes, setPaquetes] = useState<any[]>([])
  const [cobradores, setCobradores] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/stats'); const d = await r.json(); setStats(d)
    } catch {}
    setLoading(false)
  }

  const fetchMeta = async () => {
    try {
      const r = await fetch('/api/contratos'); const d = await r.json()
      setPaquetes(d.paquetes||[]); setCobradores(d.cobradores||[])
    } catch {}
  }

  useEffect(() => { fetchStats(); fetchMeta() }, [])

  const guardarContrato = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await fetch('/api/contratos', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,cobrador_id:parseInt(form.cobrador_id),paquete_id:parseInt(form.paquete_id),dia_pago:parseInt(form.dia_pago)})})
      const d = await r.json()
      if (!r.ok) { showToast(d.error||'Error',false); setSaving(false); return }
      showToast(`Contrato ${d.folio} creado exitosamente`)
      setForm({nombre:'',telefono:'',direccion:'',colonia:'',cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
      setTab('contratos'); fetchStats()
    } catch { showToast('Error de conexión',false) }
    setSaving(false)
  }

  const estBadge = (e: string) => e==='liquidado'?{bg:'rgba(22,163,74,0.15)',c:'#16A34A'}:e==='atrasado'?{bg:'rgba(234,88,12,0.15)',c:'#EA580C'}:{bg:'var(--surface-2)',c:'var(--text-soft)'}

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
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={onLogout} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="flex px-4 pt-5 gap-2 mb-4 overflow-x-auto">
        {[{k:'dashboard',l:'Dashboard',I:Ic.chart},{k:'contratos',l:'Contratos',I:Ic.doc},{k:'equipo',l:'Equipo',I:Ic.team},{k:'nuevo',l:'+ Contrato',I:Ic.plus}].map(t => (
          <button key={t.k} onClick={()=>setTab(t.k as any)} className="tab"
            style={tab===t.k?{background:'var(--brand)',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
            <t.I s={15} c={tab===t.k?'#fff':'var(--text-soft)'}/>{t.l}
          </button>
        ))}
      </div>

      {tab==='dashboard' && (
        <div className="px-4">
          {loading ? <div className="grid grid-cols-2 gap-3 mb-6">{[1,2,3,4].map(i=><div key={i} className="card h-24 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div> : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {label:'Contratos activos',value:stats?.contratos||0,color:'var(--brand)',I:Ic.doc},
                  {label:'Cobrado este mes',value:`$${parseFloat(stats?.cobrado_mes||0).toLocaleString()}`,color:'#16A34A',I:Ic.money},
                  {label:'Por cobrar',value:`$${parseFloat(stats?.pendientes||0).toLocaleString()}`,color:'#EA580C',I:Ic.bell},
                  {label:'Cobrado hoy',value:`$${parseFloat(stats?.cobrado_hoy||0).toLocaleString()}`,color:'#7C3AED',I:Ic.chart},
                ].map((s,i) => (
                  <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} className="card p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:'var(--brand-soft)'}}>
                      <s.I s={18} c={s.color}/>
                    </div>
                    <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.label}</div>
                    <div className="text-xl font-serif" style={{color:s.color}}>{s.value}</div>
                  </motion.div>
                ))}
              </div>
              <div className="kicker">COBROS RECIENTES</div>
              <div className="space-y-2 mb-4">
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

      {tab==='equipo' && (
        <div className="px-4">
          <div className="kicker">RENDIMIENTO DEL EQUIPO</div>
          <div className="space-y-4">
            {(stats?.cobradores||[]).map((c: any,i: number) => {
              const meta = c.contratos_asignados * parseFloat(c.cobrado_mes||0) / Math.max(c.contratos_asignados,1) * 1.2 || 20000
              const pct = Math.min(100, Math.round((parseFloat(c.cobrado_mes)||0) / 20000 * 100))
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

      {tab==='nuevo' && (
        <div className="px-4">
          <div className="kicker">NUEVO CONTRATO</div>
          <form onSubmit={guardarContrato} className="reg-card space-y-0">
            <p className="text-xs mb-4" style={{color:'var(--text-soft)'}}>Registra un nuevo cliente y contrato</p>
            <label className="field"><span>Nombre del titular</span>
              <input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="María González Pérez"/></label>
            <label className="field"><span>Teléfono / WhatsApp</span>
              <input required value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} placeholder="998 200 0000"/></label>
            <label className="field"><span>Dirección</span>
              <input required value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} placeholder="Av. Tulum 123"/></label>
            <label className="field"><span>Colonia</span>
              <input required value={form.colonia} onChange={e=>setForm({...form,colonia:e.target.value})} placeholder="Centro"/></label>
            <label className="field"><span>Beneficiario</span>
              <input required value={form.beneficiario} onChange={e=>setForm({...form,beneficiario:e.target.value})} placeholder="Juan González"/></label>
            <label className="field"><span>Paquete</span>
              <select value={form.paquete_id} onChange={e=>setForm({...form,paquete_id:e.target.value})}>
                {paquetes.map(p=><option key={p.id} value={p.id}>{p.nombre} — ${parseFloat(p.precio).toLocaleString()}</option>)}
              </select></label>
            <label className="field"><span>Cobrador asignado</span>
              <select value={form.cobrador_id} onChange={e=>setForm({...form,cobrador_id:e.target.value})}>
                {cobradores.map(c=><option key={c.id} value={c.id}>{c.nombre} — Zona {c.zona}</option>)}
              </select></label>
            <label className="field"><span>Día de pago mensual</span>
              <input type="number" min="1" max="28" value={form.dia_pago} onChange={e=>setForm({...form,dia_pago:e.target.value})}/></label>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
              {saving?'Guardando...':'Crear contrato'} {!saving && <Ic.arrow s={16} c="#fff"/>}
            </button>
          </form>
        </div>
      )}

      <AnimatePresence>{toast && <Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}

