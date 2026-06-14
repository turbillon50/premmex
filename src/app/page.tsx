'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

type IP = { s?: number; c?: string }
const Ic = {
  moon:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>,
  sun:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  arrow:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  check:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>,
  phone:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h3.5l1.5 5-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2 5 1.5V21a1 1 0 0 1-1.1 1A18 18 0 0 1 4 5.1 1 1 0 0 1 5 3Z"/></svg>,
  leaf:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16Z"/><path d="M4 20c4-7 8-10 12-12"/></svg>,
  x:      ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
}

function Mark({ s=28 }: { s?: number }) {
  return <img src="/images/logo.png" alt="PREMMEX" width={s} height={s}
    style={{ width:s,height:s,borderRadius:'50%',objectFit:'cover',boxShadow:'0 0 0 1px var(--border)',background:'#fff' }} />
}

export default function LandingPage() {
  const [splash, setSplash] = useState(true)
  const { theme, toggle } = useTheme()
  const [toast, setToast] = useState(false)
  const [form, setForm] = useState({nombre:'',email:'',whatsapp:''})

  useEffect(() => { const t = setTimeout(()=>setSplash(false), 2000); return ()=>clearTimeout(t) }, [])

  const planes = [
    {name:'Serenidad',price:'$15,000',monthly:'$1,500/mes',features:['Traslado local','Velación 24h','Ataúd digno','Trámites legales']},
    {name:'Paz Familiar',price:'$28,000',monthly:'$2,800/mes',features:['Traslado ilimitado','Velación 48h','Ataúd premium','Flores y recordatorios'],featured:true},
    {name:'Eternidad Plus',price:'$45,000',monthly:'$4,500/mes',features:['Traslado nacional','Velación 72h','Ataúd de lujo','Transmisión + Nicho']},
  ]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setToast(true); setForm({nombre:'',email:'',whatsapp:''})
    setTimeout(()=>setToast(false),3500)
  }

  return (<>
    <AnimatePresence>
      {splash && (
        <motion.div initial={{opacity:1}} exit={{opacity:0}} transition={{duration:0.7}}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{background:'var(--bg)'}}>
          <motion.div initial={{scale:0.7,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.15,duration:0.6}} className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}}
                className="absolute inset-0 rounded-full"
                style={{border:'2px solid transparent',borderTopColor:'var(--brand)',borderRightColor:'var(--brand-2)'}}/>
              <div className="absolute inset-0 flex items-center justify-center"><Mark s={44}/></div>
            </div>
            <h1 className="text-4xl font-serif tracking-[0.28em]" style={{color:'var(--text)'}}>PREMMEX</h1>
            <p className="text-xs tracking-[0.22em] uppercase mt-2" style={{color:'var(--brand)'}}>Previsión · Mutual · de · México</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-3.5 flex items-center justify-between nav-bar">
        <div className="flex items-center gap-2.5">
          <Mark s={26}/>
          <span className="font-serif text-lg tracking-widest" style={{color:'var(--text)'}}>PREMMEX</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#planes" className="text-sm hidden md:block nav-link">Planes</a>
          <a href="#registro" className="text-sm hidden md:block nav-link">Contratar</a>
          <button onClick={toggle} aria-label="Cambiar tema" className="theme-btn">
            {theme==='light' ? <Ic.moon s={17}/> : <Ic.sun s={17}/>}
          </button>
          {/* CTA discreto para socios — no un switcher de roles */}
          <a href="/mi-contrato" className="btn-ghost text-sm" style={{padding:'7px 16px'}}>Mi contrato</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative min-h-[94vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <div className="hero-img"/><div className="hero-veil"/>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:2.2,duration:0.9}} className="text-center max-w-xl relative z-10">
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
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:2.6}} className="relative z-10 mt-14 flex gap-10 md:gap-16">
          {[{l:'Familias protegidas',v:'12,400+'},{l:'Años de experiencia',v:'28'},{l:'Estados con cobertura',v:'18'}].map((s,i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-serif" style={{color:'var(--brand)'}}>{s.v}</div>
              <div className="text-xs mt-1" style={{color:'var(--text-soft)'}}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </header>

      {/* PLANES */}
      <section id="planes" className="px-4 py-20 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
          <div className="kicker">NUESTROS PLANES</div>
          <h2 className="text-3xl font-serif mb-2">Elige tu plan</h2>
          <p className="text-sm" style={{color:'var(--text-soft)'}}>Sin letra chica · Cobertura inmediata · Pagos cómodos</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {planes.map((p,i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{delay:i*0.12}} whileHover={{y:-5}} className={`plan-card${p.featured?' plan-featured':''}`}>
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

      {/* REGISTRO */}
      <section id="registro" className="px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="kicker">EMPIEZA HOY</div>
            <h2 className="text-3xl font-serif mb-4">Solicita tu plan</h2>
            <p className="text-sm leading-relaxed mb-6" style={{color:'var(--text-soft)'}}>Un asesor te contactará sin compromiso para orientarte en el mejor plan para tu familia.</p>
            <div className="flex items-center gap-2 text-sm" style={{color:'var(--brand)'}}>
              <Ic.phone s={16} c="var(--brand)"/>998 717 5692
            </div>
          </motion.div>
          <motion.form onSubmit={submit} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="reg-card">
            <label className="field"><span>Nombre completo</span>
              <input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="María González"/></label>
            <label className="field"><span>Correo electrónico</span>
              <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="maria@correo.com"/></label>
            <label className="field"><span>WhatsApp</span>
              <input required value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="998 000 0000"/></label>
            <button type="submit" className="btn-primary w-full justify-center mt-1">
              Solicitar información <Ic.arrow s={16} c="#fff"/>
            </button>
          </motion.form>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="cta-card">
          <Ic.leaf s={34} c="var(--brand)"/>
          <h3 className="text-2xl font-serif mt-3 mb-3">Tu tranquilidad, nuestra misión</h3>
          <p className="text-sm mb-6 max-w-md mx-auto leading-relaxed" style={{color:'var(--text-soft)'}}>Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.</p>
          <a href="https://wa.me/529987175692" target="_blank" rel="noreferrer" className="btn-primary" style={{display:'inline-flex'}}>
            <Ic.phone s={16} c="#fff"/>Contactar por WhatsApp
          </a>
        </motion.div>
      </section>

      <footer className="px-6 py-9 text-center text-xs" style={{color:'var(--text-soft)',borderTop:'1px solid var(--border)'}}>
        <div className="flex items-center justify-center gap-2 mb-2"><Mark s={20}/><span className="font-serif tracking-widest" style={{color:'var(--text)'}}>PREMMEX</span></div>
        <div>© 2025 Previsión Mutual de México · Todos los derechos reservados</div>
        <div className="mt-2"><a href="/mi-contrato" style={{color:'var(--text-soft)'}}>Portal de socios</a></div>
      </footer>
    </div>

    <AnimatePresence>
      {toast && (
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="toast"
          style={{background:'linear-gradient(135deg,var(--brand),var(--brand-2))'}}>
          <Ic.check s={16} c="#fff"/> ¡Gracias! Un asesor te contactará pronto.
        </motion.div>
      )}
    </AnimatePresence>
  </>)
}
