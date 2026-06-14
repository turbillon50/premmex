'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, useTheme } from '@/components/shared'

// Apps de rol — login propio (no Clerk). Se cargan solo cuando el usuario QUIERE USAR.
const SocioApp    = dynamic(() => import('@/components/SocioApp'),    { ssr: false })
const CobradorApp = dynamic(() => import('@/components/CobradorApp'), { ssr: false })
const AdminApp    = dynamic(() => import('@/components/AdminApp'),    { ssr: false })

type Screen = 'home' | 'planes' | 'plan-detail' | 'contacto' | 'socio' | 'cobrador' | 'admin'

// Iconos locales que no están en shared
const leaf  = ({ s=18, c='currentColor' }: { s?: number; c?: string }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20C4 11 10 4 20 4c0 10-7 16-16 16Z"/><path d="M4 20c4-7 8-10 12-12"/></svg>
const clock = ({ s=18, c='currentColor' }: { s?: number; c?: string }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
const back  = ({ s=18, c='currentColor' }: { s?: number; c?: string }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>

const PLANES = [
  {
    id: 'serenidad', name: 'Serenidad', price: '$15,000', monthly: '$1,500', color: '#0f766e',
    tagline: 'Lo esencial, con dignidad',
    features: ['Traslado local del cuerpo', 'Velación 24 horas', 'Ataúd digno seleccionado', 'Trámites legales incluidos', 'Carroza fúnebre'],
    garantias: ['Cobertura inmediata desde el primer pago', 'Sin estudios médicos', 'Precio congelado de por vida'],
  },
  {
    id: 'paz', name: 'Paz Familiar', price: '$28,000', monthly: '$2,800', color: '#059669', featured: true,
    tagline: 'El equilibrio que eligen las familias',
    features: ['Traslado ilimitado en tu ciudad', 'Velación 48 horas', 'Ataúd premium', 'Flores y libro de condolencias', 'Recordatorios impresos', 'Apoyo emocional 24/7'],
    garantias: ['Cobertura inmediata', 'Incluye hasta 4 beneficiarios', 'Atención prioritaria 24/7', 'Precio congelado de por vida'],
  },
  {
    id: 'eternidad', name: 'Eternidad Plus', price: '$45,000', monthly: '$4,500', color: '#047857',
    tagline: 'Máxima protección y honor',
    features: ['Traslado nacional', 'Velación 72 horas', 'Ataúd de lujo', 'Transmisión en vivo del servicio', 'Nicho o cremación premium', 'Memorial digital permanente'],
    garantias: ['Cobertura nacional inmediata', 'Beneficiarios ilimitados', 'Concierge funerario dedicado', 'Precio congelado de por vida'],
  },
]

const BENEFICIOS = [
  { i: Ic.shield, t: 'Cobertura inmediata', d: 'Tu familia queda protegida desde el primer pago, sin periodos de espera.' },
  { i: Ic.money,  t: 'Pagos cómodos',       d: 'Mensualidades fijas que se ajustan a tu presupuesto, sin sorpresas.' },
  { i: Ic.team,   t: '+12,400 familias',    d: 'Generaciones de mexicanos que ya confían su tranquilidad en PREMMEX.' },
  { i: Ic.check,  t: 'Sin letra chica',     d: 'Contratos claros y honestos. El precio que ves es el precio congelado.' },
]

const TESTIMONIOS = [
  { n: 'María González', c: 'Cancún, Q. Roo', t: 'Cuando perdimos a mi padre, PREMMEX se encargó de todo en menos de una hora. No tuvimos que preocuparnos por nada.' },
  { n: 'Roberto Méndez', c: 'Mérida, Yuc.',   t: 'Llevo 8 años pagando mi plan. La tranquilidad de saber que mi familia está protegida no tiene precio.' },
  { n: 'Lucía Ramírez',  c: 'Playa del Carmen', t: 'El cobrador siempre llega puntual y con una sonrisa. Te tratan como familia, no como un número.' },
]

export default function PremmexSPA() {
  const [splash, setSplash] = useState(true)
  const [screen, setScreen] = useState<Screen>('home')
  const [planIdx, setPlanIdx] = useState(0)
  const { theme, toggle } = useTheme()
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', colonia: '' })
  const [toast, setToast] = useState('')

  useEffect(() => { const t = setTimeout(() => setSplash(false), 1800); return () => clearTimeout(t) }, [])
  useEffect(() => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' }) }, [screen])

  const go = (s: Screen) => setScreen(s)
  const openPlan = (i: number) => { setPlanIdx(i); setScreen('plan-detail') }

  const submitContacto = (e: React.FormEvent) => {
    e.preventDefault()
    setToast('¡Gracias! Un asesor te contactará muy pronto.')
    setForm({ nombre: '', telefono: '', email: '', colonia: '' })
    setTimeout(() => setToast(''), 3500)
  }

  const plan = PLANES[planIdx]
  const isPublic = screen === 'home' || screen === 'planes' || screen === 'plan-detail' || screen === 'contacto'

  // ---------- APPS DE ROL (login al usar) ----------
  const RoleBack = () => (
    <button onClick={() => go('home')} aria-label="Volver al inicio"
      style={{ position: 'fixed', top: 14, left: 14, zIndex: 70, display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
        color: '#fff', background: 'rgba(8,20,16,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
      {back({ s: 15, c: '#fff' })} Inicio
    </button>
  )

  if (screen === 'socio')    return (<><RoleBack /><SocioApp /></>)
  if (screen === 'cobrador') return (<><RoleBack /><CobradorApp /></>)
  if (screen === 'admin')    return (<><RoleBack /><AdminApp /></>)

  // ---------- SPA PÚBLICA ----------
  return (<>
    {/* SPLASH */}
    <AnimatePresence>
      {splash && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.12, duration: 0.55 }} className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid transparent', borderTopColor: 'var(--brand)', borderRightColor: 'var(--brand-2)' }} />
              <div className="absolute inset-0 flex items-center justify-center"><Mark s={44} /></div>
            </div>
            <h1 className="text-4xl font-serif tracking-[0.28em]" style={{ color: 'var(--text)' }}>PREMMEX</h1>
            <p className="text-xs tracking-[0.22em] uppercase mt-2" style={{ color: 'var(--brand)' }}>Previsión · Mutual · de · México</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100svh', paddingBottom: 'calc(76px + env(safe-area-inset-bottom))' }}>
      {/* NAV TOP */}
      <nav className="nav-bar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
        <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Mark s={26} />
          <span className="font-serif" style={{ fontSize: 18, letterSpacing: '0.18em', color: 'var(--text)' }}>PREMMEX</span>
        </button>
        <button onClick={() => go('contacto')} className="btn-ghost" style={{ fontSize: 13 }}>Solicitar info</button>
      </nav>

      <AnimatePresence mode="wait">
        {/* ======================= HOME ======================= */}
        {screen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* HERO */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden px-6" style={{ minHeight: '92svh', paddingTop: 96, paddingBottom: 56 }}>
              <div className="hero-img" /><div className="hero-veil" />
              <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: splash ? 1.9 : 0.1, duration: 0.8 }} className="text-center relative z-10" style={{ maxWidth: 560 }}>
                <span className="badge"><span className="dot" />PREVISIÓN · DIGNIDAD · CONFIANZA</span>
                <h1 className="font-serif" style={{ fontSize: 'clamp(2.6rem, 9vw, 4rem)', lineHeight: 1.08, margin: '26px 0 18px' }}>
                  Protegemos<br /><span style={{ color: 'var(--brand)' }}>lo que más</span><br />importa
                </h1>
                <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 34, color: 'var(--text-soft)' }}>
                  Planes funerarios con pagos mensuales cómodos.<br />Más de 12,400 familias confían en nosotros.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => go('planes')} className="btn-primary justify-center">Ver planes {Ic.arrow({ s: 16, c: '#fff' })}</button>
                  <button onClick={() => go('contacto')} className="btn-outline justify-center">Contactar</button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: splash ? 2.3 : 0.4 }} className="relative z-10" style={{ marginTop: 52, display: 'flex', gap: 'clamp(28px,8vw,64px)' }}>
                {[{ l: 'Familias protegidas', v: '12,400+' }, { l: 'Años de experiencia', v: '28' }, { l: 'Estados con cobertura', v: '18' }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="font-serif" style={{ fontSize: 'clamp(1.5rem,5vw,2rem)', color: 'var(--brand)' }}>{s.v}</div>
                    <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-soft)' }}>{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </header>

            {/* PLANES PREVIEW */}
            <section className="px-4 py-16" style={{ maxWidth: 1080, margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: 36 }}>
                <div className="kicker">NUESTROS PLANES</div>
                <h2 className="font-serif" style={{ fontSize: 30, marginBottom: 6 }}>Elige tu tranquilidad</h2>
                <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Sin letra chica · Cobertura inmediata · Pagos cómodos</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {PLANES.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }} onClick={() => openPlan(i)} className={`plan-card${p.featured ? ' plan-featured' : ''}`}>
                    {p.featured && <div className="plan-badge">Más popular</div>}
                    <div className="font-serif" style={{ fontSize: 20, marginBottom: 8, color: p.color }}>{p.name}</div>
                    <div style={{ fontSize: 30, fontWeight: 300, marginBottom: 2 }}>{p.price}</div>
                    <div style={{ fontSize: 14, marginBottom: 18, color: 'var(--brand-2)' }}>{p.monthly} / mes</div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                      {p.features.slice(0, 4).map((f, j) => (
                        <li key={j} className="flex items-center gap-2.5" style={{ fontSize: 14, color: 'var(--text-soft)' }}>{Ic.check({ s: 15, c: p.color })}{f}</li>
                      ))}
                    </ul>
                    <span className={p.featured ? 'btn-primary w-full justify-center' : 'btn-outline w-full justify-center'}>Ver detalle</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* POR QUÉ PREMMEX */}
            <section className="px-4 py-14" style={{ maxWidth: 1000, margin: '0 auto' }}>
              <div className="text-center" style={{ marginBottom: 32 }}>
                <div className="kicker">¿POR QUÉ PREMMEX?</div>
                <h2 className="font-serif" style={{ fontSize: 28 }}>Acompañamos a tu familia</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {BENEFICIOS.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="card" style={{ padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-soft)' }}>
                      {b.i({ s: 22, c: 'var(--brand)' })}
                    </div>
                    <div>
                      <div className="font-serif" style={{ fontSize: 18, marginBottom: 4 }}>{b.t}</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-soft)' }}>{b.d}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* TESTIMONIOS — scroll horizontal */}
            <section className="py-12">
              <div className="px-6 text-center" style={{ marginBottom: 24 }}>
                <div className="kicker">TESTIMONIOS</div>
                <h2 className="font-serif" style={{ fontSize: 28 }}>Lo que dicen las familias</h2>
              </div>
              <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '4px 20px 8px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                {TESTIMONIOS.map((t, i) => (
                  <div key={i} className="card" style={{ flex: '0 0 84%', maxWidth: 340, padding: 24, scrollSnapAlign: 'center' }}>
                    <div style={{ fontSize: 30, lineHeight: 1, color: 'var(--brand)', fontFamily: 'Cormorant Garamond, serif' }}>“</div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: '4px 0 16px', color: 'var(--text)' }}>{t.t}</p>
                    <div className="font-serif" style={{ fontSize: 16, color: 'var(--brand)' }}>{t.n}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{t.c}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA FINAL */}
            <section className="px-4 py-16 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="cta-card"
                style={{ background: 'linear-gradient(135deg, var(--brand), var(--brand-2))', border: 'none' }}>
                {leaf({ s: 36, c: '#fff' })}
                <h3 className="font-serif" style={{ fontSize: 26, margin: '12px 0 12px', color: '#fff' }}>Tu tranquilidad, nuestra misión</h3>
                <p style={{ fontSize: 14.5, marginBottom: 24, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, color: 'rgba(255,255,255,0.92)' }}>
                  Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.
                </p>
                <button onClick={() => go('contacto')} className="btn-ghost" style={{ background: '#fff', color: 'var(--brand)', fontSize: 14, padding: '12px 28px' }}>
                  Solicitar información
                </button>
              </motion.div>
            </section>

            {/* FOOTER + acceso discreto a equipo */}
            <footer className="px-6 py-9 text-center" style={{ fontSize: 12, color: 'var(--text-soft)', borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center justify-center gap-2" style={{ marginBottom: 8 }}><Mark s={20} /><span className="font-serif" style={{ letterSpacing: '0.16em', color: 'var(--text)' }}>PREMMEX</span></div>
              <div>© 2026 Previsión Mutual de México · Todos los derechos reservados</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => go('socio')} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', fontSize: 12 }}>Portal de socios</button>
                <button onClick={() => go('cobrador')} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', fontSize: 12 }}>Acceso cobrador</button>
                <button onClick={() => go('admin')} style={{ background: 'none', border: 'none', color: 'var(--text-soft)', cursor: 'pointer', fontSize: 12 }}>Administración</button>
              </div>
            </footer>
          </motion.div>
        )}

        {/* ======================= PLANES ======================= */}
        {screen === 'planes' && (
          <motion.div key="planes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
            className="px-4" style={{ paddingTop: 92, paddingBottom: 40, maxWidth: 1080, margin: '0 auto' }}>
            <div className="text-center" style={{ marginBottom: 32 }}>
              <div className="kicker">NUESTROS PLANES</div>
              <h1 className="font-serif" style={{ fontSize: 34, marginBottom: 6 }}>Planes de previsión</h1>
              <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Explora cada plan sin compromiso. Contrata cuando estés listo.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANES.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }} onClick={() => openPlan(i)} className={`plan-card${p.featured ? ' plan-featured' : ''}`}>
                  {p.featured && <div className="plan-badge">Más popular</div>}
                  <div className="font-serif" style={{ fontSize: 22, marginBottom: 4, color: p.color }}>{p.name}</div>
                  <div style={{ fontSize: 13, marginBottom: 12, color: 'var(--text-soft)' }}>{p.tagline}</div>
                  <div style={{ fontSize: 32, fontWeight: 300, marginBottom: 2 }}>{p.price}</div>
                  <div style={{ fontSize: 14, marginBottom: 20, color: 'var(--brand-2)' }}>{p.monthly} / mes</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5" style={{ fontSize: 14, color: 'var(--text-soft)' }}>{Ic.check({ s: 15, c: p.color })}{f}</li>
                    ))}
                  </ul>
                  <span className={p.featured ? 'btn-primary w-full justify-center' : 'btn-outline w-full justify-center'}>Ver detalle {Ic.arrow({ s: 15, c: p.featured ? '#fff' : p.color })}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ======================= PLAN DETAIL ======================= */}
        {screen === 'plan-detail' && (
          <motion.div key="detail" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
            style={{ paddingBottom: 120 }}>
            {/* hero del plan */}
            <div style={{ paddingTop: 92, paddingBottom: 40, paddingLeft: 24, paddingRight: 24, textAlign: 'center',
              background: `linear-gradient(160deg, ${plan.color}, color-mix(in srgb, ${plan.color} 65%, #000))`, color: '#fff' }}>
              <button onClick={() => go('planes')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.16)', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: 999, fontSize: 13, cursor: 'pointer', marginBottom: 18 }}>
                {back({ s: 15, c: '#fff' })} Planes
              </button>
              {plan.featured && <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.22)', marginBottom: 12 }}>MÁS POPULAR</div>}
              <h1 className="font-serif" style={{ fontSize: 38, marginBottom: 6 }}>{plan.name}</h1>
              <p style={{ fontSize: 14.5, opacity: 0.92, marginBottom: 18 }}>{plan.tagline}</p>
              <div className="font-serif" style={{ fontSize: 52, lineHeight: 1 }}>{plan.price}</div>
              <div style={{ fontSize: 16, opacity: 0.95, marginTop: 6 }}>{plan.monthly} al mes</div>
            </div>

            <div className="px-5" style={{ maxWidth: 620, margin: '0 auto' }}>
              <section style={{ paddingTop: 32 }}>
                <div className="kicker">QUÉ INCLUYE</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, fontSize: 15 }}>
                      <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-soft)' }}>{Ic.check({ s: 16, c: plan.color })}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              <section style={{ paddingTop: 28 }}>
                <div className="kicker">GARANTÍAS</div>
                <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {plan.garantias.map((g, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14.5, color: 'var(--text)' }}>
                      {Ic.shield({ s: 19, c: plan.color })} {g}
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ paddingTop: 28 }}>
                <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {clock({ s: 22, c: 'var(--brand)' })}
                  <div style={{ fontSize: 13.5, color: 'var(--text-soft)', lineHeight: 1.5 }}>Activación inmediata. Tu familia queda protegida desde el primer pago, sin periodos de espera.</div>
                </div>
              </section>
            </div>

            {/* CTA fijo */}
            <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(76px + env(safe-area-inset-bottom))', zIndex: 35, padding: '12px 16px', background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(14px)', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => go('contacto')} className="btn-primary w-full justify-center" style={{ maxWidth: 620, margin: '0 auto', display: 'flex', background: `linear-gradient(135deg, ${plan.color}, var(--brand-2))` }}>
                Contratar {plan.name} {Ic.arrow({ s: 16, c: '#fff' })}
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================= CONTACTO ======================= */}
        {screen === 'contacto' && (
          <motion.div key="contacto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
            className="px-5" style={{ paddingTop: 92, paddingBottom: 40, maxWidth: 560, margin: '0 auto' }}>
            <div className="text-center" style={{ marginBottom: 28 }}>
              <div className="kicker">EMPIEZA HOY</div>
              <h1 className="font-serif" style={{ fontSize: 32, marginBottom: 8 }}>Solicita tu plan</h1>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-soft)' }}>Un asesor te contactará sin compromiso para orientarte en el mejor plan para tu familia.</p>
            </div>

            <form onSubmit={submitContacto} className="reg-card">
              <label className="field"><span>Nombre completo</span>
                <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="María González" /></label>
              <label className="field"><span>Teléfono / WhatsApp</span>
                <input required value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="998 000 0000" /></label>
              <label className="field"><span>Correo electrónico</span>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="maria@correo.com" /></label>
              <label className="field"><span>Colonia / Ciudad</span>
                <input required value={form.colonia} onChange={e => setForm({ ...form, colonia: e.target.value })} placeholder="Centro, Cancún" /></label>
              <button type="submit" className="btn-primary w-full justify-center" style={{ marginTop: 4 }}>
                Solicitar información {Ic.arrow({ s: 16, c: '#fff' })}
              </button>
            </form>

            <a href="tel:9987175692" className="card" style={{ marginTop: 18, padding: 18, display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'var(--text)' }}>
              <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-soft)' }}>{Ic.phone({ s: 22, c: 'var(--brand)' })}</span>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Llámanos directo</div>
                <div className="font-serif" style={{ fontSize: 20, color: 'var(--brand)' }}>998 717 5692</div>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* BOTTOM NAV (solo público) */}
    {isPublic && (
      <nav style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 45, display: 'flex',
        background: 'color-mix(in srgb, var(--surface) 92%, transparent)', backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {([
          { k: 'home',     label: 'Inicio',      icon: Ic.home,  on: screen === 'home',     act: () => go('home') },
          { k: 'planes',   label: 'Planes',      icon: Ic.doc,   on: screen === 'planes' || screen === 'plan-detail', act: () => go('planes') },
          { k: 'socio',    label: 'Mi contrato', icon: Ic.user,  on: false, act: () => go('socio') },
          { k: 'contacto', label: 'Contactar',   icon: Ic.phone, on: screen === 'contacto', act: () => go('contacto') },
          { k: 'tema',     label: 'Tema',        icon: theme === 'light' ? Ic.moon : Ic.sun, on: false, act: toggle },
        ]).map(item => (
          <button key={item.k} onClick={item.act}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 2px 12px',
              background: 'none', border: 'none', cursor: 'pointer', color: item.on ? 'var(--brand)' : 'var(--text-soft)' }}>
            {item.icon({ s: 21, c: item.on ? 'var(--brand)' : 'var(--text-soft)' })}
            <span style={{ fontSize: 10.5, fontWeight: item.on ? 700 : 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    )}

    {/* TOAST */}
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="toast" style={{ bottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
          {Ic.check({ s: 16, c: '#fff' })} {toast}
        </motion.div>
      )}
    </AnimatePresence>
  </>)
}
