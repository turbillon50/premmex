'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ============ THEME ============ */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('pmx_theme')) as
      | 'light'
      | 'dark'
      | null
    const initial = saved || 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])
  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      try { localStorage.setItem('pmx_theme', next) } catch {}
      return next
    })
  }
  return { theme, toggle }
}

/* ============ ICONS (SVG propios inline) ============ */
type IP = { s?: number; c?: string }
const Ic = {
  globe: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></svg>
  ),
  user: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
  ),
  gear: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 0 0-1.7-1l-.3-2.6H10.9l-.3 2.6a7.5 7.5 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 0 0 1.7 1l.3 2.6h3.2l.3-2.6a7.5 7.5 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5Z" /></svg>
  ),
  phone: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h3.5l1.5 5-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2 5 1.5V21a1 1 0 0 1-1.1 1A18 18 0 0 1 4 5.1 1 1 0 0 1 5 3Z" /></svg>
  ),
  chat: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-4 4V5Z" /></svg>
  ),
  money: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" /></svg>
  ),
  check: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5" /></svg>
  ),
  sun: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  ),
  moon: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" /></svg>
  ),
  shield: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z" /><path d="M8.5 12l2.5 2.5L16 9" /></svg>
  ),
  doc: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v4h4M9 13h6M9 17h6" /></svg>
  ),
  chart: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" /></svg>
  ),
  team: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2 1-3.5 3-3.5s4 1.5 4 3.5" /></svg>
  ),
  map: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>
  ),
  bell: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
  ),
  undo: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10" /></svg>
  ),
  leaf: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16Z" /><path d="M4 20c4-7 8-10 12-12" /></svg>
  ),
  arrow: ({ s = 18, c = 'currentColor' }: IP) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
}

/* ============ BRAND MARK (emblema Higgsfield premium) ============ */
function Mark({ s = 28 }: { s?: number }) {
  return (
    <img src="/images/logo.png" alt="PREMMEX" width={s} height={s}
      style={{ width: s, height: s, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 1px var(--border)', background: '#fff' }} />
  )
}

function ThemeBtn({ theme, toggle }: { theme: 'light' | 'dark'; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label="Cambiar tema" className="theme-btn">
      {theme === 'light' ? <Ic.moon s={17} /> : <Ic.sun s={17} />}
    </button>
  )
}

/* ============ ROOT ============ */
export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [mode, setMode] = useState<'publico' | 'usuario' | 'admin'>('publico')
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(t)
  }, [])

  const modeMeta = {
    publico: { c: 'var(--brand)', label: 'Público', I: Ic.globe },
    usuario: { c: '#0EA5E9', label: 'Cobrador', I: Ic.user },
    admin: { c: '#7C3AED', label: 'Admin', I: Ic.gear },
  } as const

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }} className="flex flex-col items-center gap-5">
              <div className="relative w-24 h-24">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full" style={{ border: '2px solid transparent', borderTopColor: 'var(--brand)', borderRightColor: 'var(--brand-2)' }} />
                <div className="absolute inset-0 flex items-center justify-center"><Mark s={46} /></div>
              </div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-4xl font-serif tracking-[0.28em]" style={{ color: 'var(--text)' }}>PREMMEX</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}
                className="text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--brand)' }}>Previsión · Mutual · de · México</motion.p>
            </motion.div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 1.2, ease: 'easeInOut' }}
              className="absolute bottom-12 h-[3px] w-48 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, var(--brand), var(--brand-2), transparent)', transformOrigin: 'left' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODE SWITCHER */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2.7, duration: 0.5 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 switcher" style={{ minWidth: '300px' }}>
        {(['publico', 'usuario', 'admin'] as const).map(m => {
          const M = modeMeta[m]
          return (
            <button key={m} onClick={() => setMode(m)} className="switcher-btn"
              style={{ background: mode === m ? M.c : 'transparent', color: mode === m ? '#fff' : 'var(--text-soft)' }}>
              <M.I s={15} c={mode === m ? '#fff' : 'var(--text-soft)'} />
              <span>{M.label}</span>
            </button>
          )
        })}
      </motion.div>

      {mode === 'publico' && <PublicoView theme={theme} toggle={toggle} onDemo={() => setMode('usuario')} />}
      {mode === 'usuario' && <CobradorView theme={theme} toggle={toggle} />}
      {mode === 'admin' && <AdminView theme={theme} toggle={toggle} />}
    </>
  )
}

/* ============ PÚBLICO ============ */
function PublicoView({ theme, toggle, onDemo }: { theme: 'light' | 'dark'; toggle: () => void; onDemo: () => void }) {
  const stats = [
    { label: 'Familias protegidas', value: '12,400+' },
    { label: 'Años de experiencia', value: '28' },
    { label: 'Estados con cobertura', value: '18' },
  ]
  const planes = [
    { name: 'Serenidad', price: '$15,000', monthly: '$1,500/mes', features: ['Traslado local', 'Velación 24h', 'Ataúd digno', 'Trámites legales'] },
    { name: 'Paz Familiar', price: '$28,000', monthly: '$2,800/mes', features: ['Traslado ilimitado', 'Velación 48h', 'Ataúd premium', 'Flores y recordatorios'], featured: true },
    { name: 'Eternidad Plus', price: '$45,000', monthly: '$4,500/mes', features: ['Traslado nacional', 'Velación 72h', 'Ataúd de lujo', 'Transmisión + Nicho'] },
  ]
  const [toast, setToast] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' })
  const submit = (e: React.FormEvent) => { e.preventDefault(); setToast(true); setForm({ nombre: '', email: '', whatsapp: '' }); setTimeout(() => setToast(false), 3200) }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <nav className="fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-3.5 flex items-center justify-between nav-bar">
        <div className="flex items-center gap-2.5"><Mark s={26} /><span className="font-serif text-lg tracking-widest" style={{ color: 'var(--text)' }}>PREMMEX</span></div>
        <div className="flex items-center gap-3 md:gap-5">
          <a href="#planes" className="text-sm hidden md:block nav-link">Planes</a>
          <a href="#registro" className="text-sm hidden md:block nav-link">Contratar</a>
          <ThemeBtn theme={theme} toggle={toggle} />
          <button onClick={onDemo} className="btn-ghost text-xs">Mi contrato</button>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <div className="hero-img" />
        <div className="hero-veil" />
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.8 }}
          className="text-center max-w-xl relative z-10">
          <span className="badge"><span className="dot" />PREVISIÓN · DIGNIDAD · CONFIANZA</span>
          <h1 className="text-5xl md:text-6xl font-serif mt-7 mb-5 leading-[1.08]">
            Protegemos<br /><span style={{ color: 'var(--brand)' }}>lo que más</span><br />importa
          </h1>
          <p className="text-base mb-9 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Planes funerarios con pagos mensuales cómodos.<br />Más de 12,400 familias confían en nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#planes" className="btn-primary">Ver planes <Ic.arrow s={16} c="#fff" /></a>
            <button onClick={onDemo} className="btn-outline">Explorar demo</button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}
          className="relative z-10 mt-14 flex gap-8 md:gap-16">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-serif" style={{ color: 'var(--brand)' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-soft)' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </header>

      {/* PLANES */}
      <section id="planes" className="px-4 py-20 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="kicker">NUESTROS PLANES</div>
          <h2 className="text-3xl font-serif mb-2">Elige tu plan</h2>
          <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Sin letra chica · Cobertura inmediata · Pagos cómodos</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {planes.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12 }} whileHover={{ y: -5 }} className={`plan-card ${p.featured ? 'plan-featured' : ''}`}>
              {p.featured && <div className="plan-badge">Más popular</div>}
              <div className="text-xl font-serif mb-2" style={{ color: 'var(--brand)' }}>{p.name}</div>
              <div className="text-3xl font-light mb-1">{p.price}</div>
              <div className="text-sm mb-6" style={{ color: 'var(--brand-2)' }}>{p.monthly}</div>
              <ul className="space-y-2.5 mb-7">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-soft)' }}>
                    <Ic.check s={15} c="var(--brand-2)" />{f}
                  </li>
                ))}
              </ul>
              <a href="#registro" className={p.featured ? 'btn-primary w-full justify-center' : 'btn-outline w-full justify-center'}>Contratar</a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REGISTRO */}
      <section id="registro" className="px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="kicker">EMPIEZA HOY</div>
            <h2 className="text-3xl font-serif mb-3">Solicita tu plan</h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              Déjanos tus datos y un asesor te contactará sin compromiso. O explora la plataforma ahora mismo, sin registrarte.
            </p>
            <button onClick={onDemo} className="btn-outline"><Ic.shield s={16} c="var(--brand)" />Explorar demo sin registro</button>
          </motion.div>
          <motion.form onSubmit={submit} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="reg-card">
            <label className="field"><span>Nombre completo</span>
              <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="María González" /></label>
            <label className="field"><span>Correo electrónico</span>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="maria@correo.com" /></label>
            <label className="field"><span>WhatsApp</span>
              <input required value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="998 000 0000" /></label>
            <button type="submit" className="btn-primary w-full justify-center mt-1">Solicitar contacto <Ic.arrow s={16} c="#fff" /></button>
            <p className="text-[11px] text-center mt-1" style={{ color: 'var(--text-soft)' }}>Demostración · no se envían datos reales</p>
          </motion.form>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="cta-card">
          <Ic.leaf s={34} c="var(--brand)" />
          <h3 className="text-2xl font-serif mt-3 mb-3">Tu tranquilidad, nuestra misión</h3>
          <p className="text-sm mb-6 leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-soft)' }}>
            Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--brand)' }}><Ic.phone s={16} c="var(--brand)" />998 717 5692</div>
        </motion.div>
      </section>

      <footer className="px-6 py-9 text-center text-xs" style={{ color: 'var(--text-soft)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-2"><Mark s={20} /><span className="font-serif tracking-widest" style={{ color: 'var(--text)' }}>PREMMEX</span></div>
        <div>© 2025 Previsión Mutual de México · Todos los derechos reservados</div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="toast">
            <Ic.check s={16} c="#fff" /> ¡Gracias! Un asesor te contactará pronto.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ============ COBRADOR ============ */
function CobradorView({ theme, toggle }: { theme: 'light' | 'dark'; toggle: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [cobrados, setCobrados] = useState<number[]>([2])
  const ruta = [
    { nombre: 'María González', dir: 'Av. Tulum 123, Centro', monto: 2800, contrato: 'PMX-2024-001', tel: '9982000001', atrasado: false },
    { nombre: 'José Luis Ramírez', dir: 'Calle Jazmín 45, Jardines', monto: 1500, contrato: 'PMX-2024-002', tel: '9982000002', atrasado: true },
    { nombre: 'Roberto Silva', dir: 'Av. Cobá 340, SM-5', monto: 2800, contrato: 'PMX-2024-006', tel: '9982000006', atrasado: false },
    { nombre: 'Lucía Martínez', dir: 'Calle Cedro 12, Bonampak', monto: 1500, contrato: 'PMX-2024-005', tel: '9982000005', atrasado: true },
    { nombre: 'Héctor Jiménez', dir: 'Av. Nichupté 123, R-100', monto: 1500, contrato: 'PMX-2024-010', tel: '9982000010', atrasado: false },
  ]
  const totalCobrado = cobrados.reduce((a, i) => a + ruta[i].monto, 0)
  const totalPendiente = ruta.filter((_, i) => !cobrados.includes(i)).reduce((a, r) => a + r.monto, 0)
  const toggleCobro = (i: number) => setCobrados(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]))

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="app-banner" style={{ backgroundImage: 'var(--img-cobrador)' }}>
        <div className="app-banner-veil" />
        <div className="relative z-10 px-5 pt-10 pb-5 flex items-end justify-between">
          <div>
            <div className="kicker !mb-1" style={{ color: '#fff', opacity: 0.85 }}>COBRADOR · MODO CAMPO</div>
            <h1 className="text-2xl font-serif" style={{ color: '#fff' }}>Roberto Méndez</h1>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Zona Norte · Martes 10 Jun 2025</div>
          </div>
          <ThemeBtn theme={theme} toggle={toggle} />
        </div>
      </div>

      <div className="px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Cobrado', value: `$${totalCobrado.toLocaleString()}`, color: '#16A34A' },
            { label: 'Pendiente', value: `$${totalPendiente.toLocaleString()}`, color: '#EA580C' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.1 }}
              className="card p-4">
              <div className="text-xs mb-1" style={{ color: 'var(--text-soft)' }}>{s.label}</div>
              <div className="text-xl font-serif" style={{ color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="kicker">RUTA DEL DÍA · {ruta.length} VISITAS</div>
        <div className="space-y-3">
          {ruta.map((c, i) => {
            const esCobrado = cobrados.includes(i)
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="card overflow-hidden" style={{ borderColor: esCobrado ? 'rgba(22,163,74,0.45)' : c.atrasado ? 'rgba(234,88,12,0.4)' : 'var(--border)' }}>
                <div className="px-4 py-3 flex items-center justify-between cursor-pointer" onClick={() => setSelected(selected === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{ background: esCobrado ? 'rgba(22,163,74,0.18)' : 'var(--brand-soft)', color: esCobrado ? '#16A34A' : 'var(--brand)' }}>
                      {esCobrado ? <Ic.check s={16} c="#16A34A" /> : i + 1}
                    </div>
                    <div><div className="text-sm font-medium">{c.nombre}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>{c.dir}</div></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>${c.monto.toLocaleString()}</div>
                    {c.atrasado && !esCobrado && <div className="text-xs" style={{ color: '#EA580C' }}>Atrasado</div>}
                    {esCobrado && <div className="text-xs" style={{ color: '#16A34A' }}>Cobrado</div>}
                  </div>
                </div>
                <AnimatePresence>
                  {selected === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="text-xs mb-3" style={{ color: 'var(--text-soft)' }}>Folio: <span style={{ color: 'var(--text)' }}>{c.contrato}</span></div>
                        <div className="grid grid-cols-3 gap-2">
                          <a href={`tel:${c.tel}`} className="qa" style={{ background: 'rgba(14,165,233,0.12)', color: '#0EA5E9' }}><Ic.phone s={18} c="#0EA5E9" />Llamar</a>
                          <a href={`https://wa.me/52${c.tel}`} className="qa" style={{ background: 'rgba(22,163,74,0.12)', color: '#16A34A' }}><Ic.chat s={18} c="#16A34A" />WhatsApp</a>
                          <button onClick={() => toggleCobro(i)} className="qa"
                            style={{ background: esCobrado ? 'rgba(234,88,12,0.12)' : 'var(--brand-soft)', color: esCobrado ? '#EA580C' : 'var(--brand)' }}>
                            {esCobrado ? <Ic.undo s={18} c="#EA580C" /> : <Ic.money s={18} c="var(--brand)" />}{esCobrado ? 'Deshacer' : 'Cobrar'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============ ADMIN ============ */
function AdminView({ theme, toggle }: { theme: 'light' | 'dark'; toggle: () => void }) {
  const [tab, setTab] = useState<'dashboard' | 'contratos' | 'cobradores'>('dashboard')
  const stats = [
    { label: 'Contratos activos', value: '164', I: Ic.doc, color: 'var(--brand)' },
    { label: 'Cobrado este mes', value: '$67,600', I: Ic.money, color: '#16A34A' },
    { label: 'Por cobrar', value: '$18,900', I: Ic.bell, color: '#EA580C' },
    { label: 'Cobradores', value: '4', I: Ic.team, color: '#7C3AED' },
  ]
  const cobradores = [
    { nombre: 'Javier Hernández', zona: 'Centro', contratos: 52, cobrado: 22100, meta: 24000 },
    { nombre: 'Roberto Méndez', zona: 'Norte', contratos: 45, cobrado: 18500, meta: 20000 },
    { nombre: 'Carmen Torres', zona: 'Sur', contratos: 38, cobrado: 15200, meta: 18000 },
    { nombre: 'Daniela Ruiz', zona: 'Oriente', contratos: 29, cobrado: 11800, meta: 14000 },
  ]
  const contratos = [
    { folio: 'PMX-2024-001', cliente: 'María González', paquete: 'Paz Familiar', mensual: 2800, saldo: 16800, estado: 'al corriente' },
    { folio: 'PMX-2024-002', cliente: 'José Luis Ramírez', paquete: 'Serenidad', mensual: 1500, saldo: 12000, estado: 'atrasado' },
    { folio: 'PMX-2024-003', cliente: 'Ana Patricia Flores', paquete: 'Eternidad Plus', mensual: 4500, saldo: 36000, estado: 'al corriente' },
    { folio: 'PMX-2024-004', cliente: 'Carlos Morales', paquete: 'Paz Familiar', mensual: 2800, saldo: 5600, estado: 'al corriente' },
    { folio: 'PMX-2024-007', cliente: 'Esperanza Díaz', paquete: 'Eternidad Plus', mensual: 4500, saldo: 0, estado: 'liquidado' },
  ]
  const pagos = [
    { cliente: 'Roberto Silva', monto: 2800, metodo: 'Efectivo', hora: '12 min', folio: 'REC-006' },
    { cliente: 'Héctor Jiménez', monto: 1500, metodo: 'Mercado Pago', hora: '28 min', folio: 'REC-009' },
    { cliente: 'Ana Flores', monto: 4500, metodo: 'Efectivo', hora: '1h', folio: 'REC-003' },
    { cliente: 'María González', monto: 2800, metodo: 'Efectivo', hora: '5 días', folio: 'REC-001' },
  ]
  const estBadge = (e: string) => e === 'liquidado' ? { bg: 'rgba(22,163,74,0.15)', c: '#16A34A' } : e === 'atrasado' ? { bg: 'rgba(234,88,12,0.15)', c: '#EA580C' } : { bg: 'var(--surface-2)', c: 'var(--text-soft)' }

  return (
    <div className="min-h-screen pb-28" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="app-banner" style={{ backgroundImage: 'var(--img-admin)' }}>
        <div className="app-banner-veil" />
        <div className="relative z-10 px-5 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5"><Mark s={26} /><div>
            <div className="kicker !mb-0.5" style={{ color: '#fff', opacity: 0.85 }}>PANEL ADMINISTRATIVO</div>
            <h1 className="text-xl font-serif" style={{ color: '#fff' }}>PREMMEX · Sede Cancún</h1></div></div>
          <ThemeBtn theme={theme} toggle={toggle} />
        </div>
      </div>

      <div className="flex px-4 pt-5 gap-2 mb-4 overflow-x-auto">
        {[{ key: 'dashboard', label: 'Dashboard', I: Ic.chart }, { key: 'contratos', label: 'Contratos', I: Ic.doc }, { key: 'cobradores', label: 'Equipo', I: Ic.team }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)} className="tab"
            style={tab === t.key ? { background: 'var(--brand)', color: '#fff' } : { background: 'var(--surface-2)', color: 'var(--text-soft)' }}>
            <t.I s={15} c={tab === t.key ? '#fff' : 'var(--text-soft)'} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }} className="card p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: 'var(--brand-soft)' }}><s.I s={18} c={s.color} /></div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-soft)' }}>{s.label}</div>
                <div className="text-xl font-serif" style={{ color: s.color }}>{s.value}</div>
              </motion.div>
            ))}
          </div>
          <div className="kicker">COBROS RECIENTES</div>
          <div className="space-y-2 mb-6">
            {pagos.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }} className="card px-4 py-3 flex items-center justify-between">
                <div><div className="text-sm">{p.cliente}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>{p.metodo} · hace {p.hora}</div></div>
                <div className="text-right"><div className="text-sm font-semibold" style={{ color: '#16A34A' }}>+${p.monto.toLocaleString()}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>{p.folio}</div></div>
              </motion.div>
            ))}
          </div>
          <div className="kicker">ACCIONES RÁPIDAS</div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Nuevo contrato', I: Ic.doc, color: 'var(--brand)' }, { label: 'Reporte mensual', I: Ic.chart, color: '#7C3AED' }, { label: 'Mapa de rutas', I: Ic.map, color: '#0EA5E9' }, { label: 'Enviar recibos', I: Ic.chat, color: '#16A34A' }].map((a, i) => (
              <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.05 }} whileHover={{ scale: 1.02 }} className="card p-4 text-left">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: 'var(--brand-soft)' }}><a.I s={18} c={a.color} /></div>
                <div className="text-sm">{a.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {tab === 'contratos' && (
        <div className="px-4">
          <div className="kicker">CONTRATOS ACTIVOS</div>
          <div className="space-y-3">
            {contratos.map((c, i) => {
              const b = estBadge(c.estado)
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><div className="font-medium text-sm">{c.cliente}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>{c.folio} · {c.paquete}</div></div>
                    <div className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: b.bg, color: b.c }}>{c.estado}</div>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: 'var(--text-soft)' }}>
                    <span>Mensual: <span style={{ color: 'var(--brand)' }}>${c.mensual.toLocaleString()}</span></span>
                    <span>Saldo: <span style={{ color: 'var(--text)' }}>${c.saldo.toLocaleString()}</span></span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'cobradores' && (
        <div className="px-4">
          <div className="kicker">RENDIMIENTO DEL EQUIPO</div>
          <div className="space-y-4">
            {cobradores.map((c, i) => {
              const pct = Math.round((c.cobrado / c.meta) * 100)
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="card p-4">
                  <div className="flex justify-between mb-3">
                    <div><div className="font-medium">{c.nombre}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>Zona {c.zona} · {c.contratos} contratos</div></div>
                    <div className="text-right"><div className="font-semibold" style={{ color: 'var(--brand)' }}>${c.cobrado.toLocaleString()}</div><div className="text-xs" style={{ color: 'var(--text-soft)' }}>{pct}% de meta</div></div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full" style={{ background: pct >= 90 ? '#16A34A' : pct >= 70 ? 'var(--brand)' : '#EA580C' }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
