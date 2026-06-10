'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'

const EMERALD = '#047857'
const EMERALD_LIGHT = '#10b981'

type Theme = 'night' | 'day'
type Palette = { bg: string; bg2: string; panel: string; panelBorder: string; text: string; sub: string; glassShadow: string; heroOverlay: string; line: string }

const T: Record<Theme, Palette> = {
  night: {
    bg: '#04130d', bg2: '#06231a', panel: 'rgba(255,255,255,0.04)',
    panelBorder: 'rgba(16,185,129,0.16)', text: '#eaf5ef', sub: '#9db8ac',
    glassShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
    heroOverlay: 'linear-gradient(180deg, rgba(4,19,13,0.35) 0%, rgba(4,19,13,0.82) 78%, #04130d 100%)',
    line: 'rgba(255,255,255,0.08)',
  },
  day: {
    bg: '#f3f8f5', bg2: '#e7f1ec', panel: 'rgba(255,255,255,0.72)',
    panelBorder: 'rgba(4,120,87,0.18)', text: '#0d2a20', sub: '#4c6b5e',
    glassShadow: '0 24px 60px -28px rgba(4,120,87,0.28)',
    heroOverlay: 'linear-gradient(180deg, rgba(243,248,245,0.25) 0%, rgba(243,248,245,0.78) 80%, #f3f8f5 100%)',
    line: 'rgba(4,120,87,0.12)',
  },
}

const Icon = ({ d, size = 24 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d.split('|').map((p, i) => <path key={i} d={p} />)}
  </svg>
)
const ICONS = {
  shield: 'M12 3l7 3v6c0 4.2-2.9 7.4-7 8.5C7.9 19.4 5 16.2 5 12V6l7-3z',
  users: 'M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1|M9.5 11a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4|M21 19v-1a4 4 0 00-3-3.8|M16.5 4.8a3.2 3.2 0 010 6.2',
  route: 'M6 19a2 2 0 100-4 2 2 0 000 4z|M18 7a2 2 0 100-4 2 2 0 000 4z|M6 17V9a4 4 0 014-4h4',
  gauge: 'M12 13l3-3|M3.5 16a9 9 0 1117 0|M12 13a1 1 0 100-2 1 1 0 000 2z',
  leaf: 'M5 21c8 0 14-5 14-14 0 0-9-1-12 5-1.6 3.2-2 6-2 9z|M5 21c2-6 5-9 9-11',
  spark: 'M12 3v4|M12 17v4|M5 12H1|M23 12h-4|M6 6l2.5 2.5|M15.5 15.5L18 18|M18 6l-2.5 2.5|M8.5 15.5L6 18',
  card: 'M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z|M3 10h18',
  chat: 'M21 12a8 8 0 01-11.6 7.1L4 20l1-4.5A8 8 0 1121 12z',
  mail: 'M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11A1.5 1.5 0 0119.5 19h-15A1.5 1.5 0 013 17.5v-11z|M3.5 7l8.5 6 8.5-6',
  db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z|M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6|M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  lock: 'M6 11V8a6 6 0 0112 0v3|M5 11h14v9H5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  flag: 'M5 21V4|M5 4h11l-1.5 4L16 12H5',
  heart: 'M12 20s-7-4.6-9.2-9C1 7.6 3 4 6.2 4 8.3 4 9.6 5.4 12 8c2.4-2.6 3.7-4 5.8-4C21 4 23 7.6 21.2 11 19 15.4 12 20 12 20z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z|M12 7v5l3 2',
  layers: 'M12 3l9 5-9 5-9-5 9-5z|M3 13l9 5 9-5|M3 17l9 5 9-5',
  check: 'M5 12.5l4.5 4.5L19 7',
  sun: 'M12 4V2|M12 22v-2|M4 12H2|M22 12h-2|M5.6 5.6L4.2 4.2|M19.8 19.8l-1.4-1.4|M18.4 5.6l1.4-1.4|M4.2 19.8l1.4-1.4|M12 17a5 5 0 100-10 5 5 0 000 10z',
  moon: 'M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 109.8 9.8z',
  arrow: 'M5 12h14|M13 6l6 6-6 6',
}

const SECTIONS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'alcances', label: 'Alcances' },
  { id: 'operacion', label: 'Operación' },
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'integraciones', label: 'Integraciones' },
  { id: 'valor', label: 'Valor agregado' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'cierre', label: 'Cierre' },
]

const IMG = {
  hero: '/pres/hero.jpg', socios: '/pres/socios.jpg', cobranza: '/pres/cobranza.jpg',
  jardin: '/pres/jardin.jpg', cierre: '/pres/cierre.jpg',
}

export default function Presentacion() {
  const [theme, setTheme] = useState<Theme>('night')
  const [active, setActive] = useState('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const c = T[theme]

  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main style={{
      background: `radial-gradient(120% 80% at 50% -10%, ${c.bg2} 0%, ${c.bg} 55%)`,
      color: c.text, minHeight: '100vh', transition: 'background .6s ease, color .6s ease',
      fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden',
    }}>
      <style>{globalCss}</style>

      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, transformOrigin: '0%',
        scaleX: bar, zIndex: 60, background: `linear-gradient(90deg, ${EMERALD}, ${EMERALD_LIGHT})`,
      }} />

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px clamp(16px,4vw,48px)',
        background: theme === 'night' ? 'rgba(4,19,13,0.55)' : 'rgba(243,248,245,0.6)',
        backdropFilter: 'blur(14px)', borderBottom: `1px solid ${c.line}`,
      }}>
        <button onClick={() => go('inicio')} className="brandbtn" style={{ color: c.text }}>
          <span style={{ fontWeight: 800, letterSpacing: '.5px' }}>VMomentum</span>
          <span style={{ opacity: .5, margin: '0 8px' }}>×</span>
          <span style={{ color: EMERALD_LIGHT, fontWeight: 700 }}>PREMMEX</span>
        </button>
        <nav className="desk-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => go(s.id)} style={{
              color: active === s.id ? EMERALD_LIGHT : c.sub, fontWeight: active === s.id ? 700 : 500,
            }}>{s.label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}
            aria-label="Cambiar tema" className="iconbtn" style={{ borderColor: c.panelBorder, color: c.text }}>
            <Icon d={theme === 'night' ? ICONS.sun : ICONS.moon} size={18} />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú"
            className="iconbtn mobile-only" style={{ borderColor: c.panelBorder, color: c.text }}>
            <Icon d={menuOpen ? 'M6 6l12 12|M18 6L6 18' : 'M4 7h16|M4 12h16|M4 17h16'} size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mobile-menu" style={{
              background: theme === 'night' ? 'rgba(4,19,13,0.96)' : 'rgba(243,248,245,0.97)',
              borderBottom: `1px solid ${c.line}`,
            }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => go(s.id)}
                style={{ color: active === s.id ? EMERALD_LIGHT : c.text }}>{s.label}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section id="inicio" className="hero">
        <div className="hero-img" style={{ backgroundImage: `url(${IMG.hero})` }} />
        <div className="hero-img-overlay" style={{ background: c.heroOverlay }} />
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}
            className="pill" style={{ borderColor: c.panelBorder, color: EMERALD_LIGHT, background: c.panel }}>
            <Icon d={ICONS.leaf} size={15} /> Una propuesta de VMomentum
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .1 }}>
            Previsión Mutual<br />de México
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .25 }}
            style={{ color: c.text }}>
            Acompañar a cada familia con serenidad, certeza y respeto.
            Una plataforma digna para proteger lo que más importa — hoy, para el mañana.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .4 }}
            className="hero-cta">
            <button onClick={() => go('alcances')} className="btn-primary">
              Conocer la propuesta <Icon d={ICONS.arrow} size={18} />
            </button>
            <button onClick={() => go('roadmap')} className="btn-ghost" style={{ borderColor: c.panelBorder, color: c.text }}>
              Ver el plan de entrega
            </button>
          </motion.div>
        </div>
        <div className="scroll-hint" style={{ color: c.sub }}>
          <span>Desliza</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <Icon d="M12 5v14|M6 13l6 6 6-6" size={18} />
          </motion.div>
        </div>
      </section>

      <Section id="alcances" c={c} kicker="Alcances del proyecto" icon={ICONS.layers}
        title="Una sola plataforma, tres experiencias"
        intro="Construimos un ecosistema completo que conecta a la familia, al cobrador de campo y a la administración — cada quien con la herramienta exacta que necesita.">
        <div className="grid3">
          {[
            { ic: ICONS.users, t: 'Público & Socio', d: 'Afiliación digital, consulta de contrato y saldo, pagos en línea, beneficiarios y avisos. La tranquilidad de tener todo a la mano.', tag: 'PWA · móvil primero' },
            { ic: ICONS.route, t: 'Cobrador de campo', d: 'Ruta del día, cobro con evidencia, estados de cuenta al instante y registro offline. El campo, ordenado y transparente.', tag: 'App de ruta' },
            { ic: ICONS.gauge, t: 'Administración', d: 'Tablero en tiempo real: cartera, cobranza, socios activos, productividad por cobrador y reportes para decidir mejor.', tag: 'Panel ejecutivo' },
          ].map((r, i) => (
            <Card key={i} c={c} delay={i * .1}>
              <div className="card-ic" style={{ color: EMERALD_LIGHT, background: c.panel, borderColor: c.panelBorder }}>
                <Icon d={r.ic} size={26} />
              </div>
              <h3>{r.t}</h3>
              <p style={{ color: c.sub }}>{r.d}</p>
              <span className="tag" style={{ color: EMERALD_LIGHT, borderColor: c.panelBorder }}>{r.tag}</span>
            </Card>
          ))}
        </div>
        <div className="modrow">
          {['Afiliación & contratos', 'Cobranza en campo', 'Pagos & facturación', 'Beneficiarios', 'Notificaciones', 'Reportes & cartera'].map((m, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * .05 }} className="chip" style={{ background: c.panel, borderColor: c.panelBorder, color: c.text }}>
              <Icon d={ICONS.check} size={14} /> {m}
            </motion.span>
          ))}
        </div>
      </Section>

      <Section id="operacion" c={c} kicker="Cómo se opera" icon={ICONS.heart}
        title="El modelo de previsión mutual, claro y digno"
        intro="La previsión funeraria mexicana protege a la familia con cuotas accesibles y tarifa congelada contra la inflación. Así fluye, de principio a fin:">
        <div className="flow">
          {[
            { n: '01', ic: ICONS.users, t: 'El socio se afilia', d: 'Una familia elige su plan de previsión. Define hasta dos beneficiarios y una tarifa que se congela desde el primer día.' },
            { n: '02', ic: ICONS.route, t: 'Cobranza en campo', d: 'El cobrador visita el domicilio en su ruta — semanal, quincenal o mensual — o se domicilia el pago. Cada cobro queda registrado con evidencia.' },
            { n: '03', ic: ICONS.shield, t: 'Protección activa', d: 'El socio mantiene su cobertura al día. Servicio disponible 24/7, los 365 días, en una red de convenios funerarios.' },
            { n: '04', ic: ICONS.heart, t: 'Beneficio cumplido', d: 'Cuando la familia lo necesita, recibe el servicio digno acordado, sin sorpresas de precio y con acompañamiento humano.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: .6, delay: i * .08 }} className="flow-step glass" style={panelStyle(c)}>
              <div className="flow-num" style={{ color: EMERALD_LIGHT }}>{s.n}</div>
              <div className="card-ic" style={{ color: EMERALD_LIGHT, background: c.panel, borderColor: c.panelBorder }}>
                <Icon d={s.ic} size={22} />
              </div>
              <h3>{s.t}</h3>
              <p style={{ color: c.sub }}>{s.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="split">
          <Card c={c}>
            <h3 style={{ color: EMERALD_LIGHT }}>Lo que sostiene el modelo</h3>
            <ul className="ul">
              {['Tarifa congelada: protección real contra la inflación', 'Cobranza domiciliaria flexible (semanal/quincenal/mensual)', 'Beneficiarios designados con derechos claros', 'Red de convenios y servicio 24/7/365', 'Afiliación presencial, telefónica o digital'].map((x, i) => (
                <li key={i}><Icon d={ICONS.check} size={16} /> <span style={{ color: c.sub }}>{x}</span></li>
              ))}
            </ul>
          </Card>
          <div className="opimg" style={{ backgroundImage: `url(${IMG.cobranza})` }}>
            <div className="opimg-cap" style={{ background: theme === 'night' ? 'linear-gradient(0deg,rgba(4,19,13,.9),transparent)' : 'linear-gradient(0deg,rgba(13,42,32,.7),transparent)' }}>
              El cobrador de campo: el corazón de la relación con el socio.
            </div>
          </div>
        </div>
      </Section>

      <Section id="tecnologia" c={c} kicker="Tecnologías" icon={ICONS.spark}
        title="Tecnología moderna, beneficio concreto"
        intro="Elegimos un stack de primer nivel — el mismo que usan las plataformas líderes del mundo — traducido en ventajas reales para PREMMEX.">
        <div className="grid2">
          {[
            { ic: ICONS.spark, t: 'Next.js + Vercel', b: 'Velocidad y disponibilidad', d: 'La plataforma carga al instante y está siempre en línea, con escala automática. Sin servidores que mantener.' },
            { ic: ICONS.phone, t: 'PWA instalable', b: 'App sin tiendas', d: 'Socios y cobradores la instalan en su celular como una app, funciona con conexión débil y se actualiza sola.' },
            { ic: ICONS.db, t: 'Neon Postgres', b: 'Datos seguros y vivos', d: 'Una base de datos confiable en la nube que guarda contratos, pagos y rutas con respaldo y trazabilidad.' },
            { ic: ICONS.clock, t: 'Tiempo real', b: 'Información al momento', d: 'Cada cobro se refleja en el tablero al instante. Dirección y campo ven lo mismo, sin esperar reportes.' },
          ].map((r, i) => (
            <Card key={i} c={c} delay={i * .08}>
              <div className="card-ic" style={{ color: EMERALD_LIGHT, background: c.panel, borderColor: c.panelBorder }}>
                <Icon d={r.ic} size={24} />
              </div>
              <h3>{r.t}</h3>
              <span className="tag" style={{ color: EMERALD_LIGHT, borderColor: c.panelBorder, marginBottom: 8 }}>{r.b}</span>
              <p style={{ color: c.sub }}>{r.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="integraciones" c={c} kicker="Integraciones" icon={ICONS.layers}
        title="Siete piezas que trabajan para el negocio"
        intro="Cada integración resuelve algo concreto: cobrar, comunicar, proteger. Así se conectan al servicio de PREMMEX.">
        <div className="grid3">
          {[
            { ic: ICONS.db, t: 'Neon', d: 'El núcleo de datos: socios, contratos, pagos y rutas, siempre disponibles y respaldados.' },
            { ic: ICONS.lock, t: 'Clerk', d: 'Acceso seguro por rol. Cada quien entra a lo suyo — socio, cobrador o admin — sin fricción.' },
            { ic: ICONS.card, t: 'Mercado Pago', d: 'Cobro en línea con el método favorito de México: el socio paga desde su celular en segundos.' },
            { ic: ICONS.card, t: 'Stripe', d: 'Pagos con tarjeta de talla mundial para suscripciones y cobros recurrentes, con seguridad bancaria.' },
            { ic: ICONS.chat, t: 'WhatsApp', d: 'Recordatorios de pago y avisos por el canal que todos abren, con link de pago integrado.' },
            { ic: ICONS.mail, t: 'Resend', d: 'Correos confiables: comprobantes, facturas y bienvenidas que sí llegan a la bandeja.' },
            { ic: ICONS.phone, t: 'Twilio', d: 'SMS y verificación para confirmar identidad y mandar avisos urgentes a cualquier teléfono.' },
          ].map((r, i) => (
            <Card key={i} c={c} delay={i * .06}>
              <div className="card-ic" style={{ color: EMERALD_LIGHT, background: c.panel, borderColor: c.panelBorder }}>
                <Icon d={r.ic} size={22} />
              </div>
              <h3>{r.t}</h3>
              <p style={{ color: c.sub }}>{r.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="valor" c={c} kicker="Sugerencias · valor agregado" icon={ICONS.spark}
        title="Lo que nos pone por delante"
        intro="No solo digitalizamos lo que ya existe. Estas propuestas — basadas en lo que mueve hoy al sector — hacen a PREMMEX superior a la competencia.">
        <div className="grid2">
          {[
            { t: 'Ruta inteligente para cobradores', d: 'Optimización de recorrido, geolocalización del cobro y evidencia fotográfica. Más visitas efectivas, cero dudas en la cartera.' },
            { t: 'Cobranza conversacional', d: 'Recordatorios automáticos por WhatsApp con link de pago. El socio liquida desde el mensaje, sin esperar al cobrador.' },
            { t: 'Tarifa congelada visible', d: 'El socio ve en pantalla cuánto ahorra frente a la inflación. Transparencia que genera confianza y retención.' },
            { t: 'Memorial digital', d: 'Un espacio sereno para honrar y recordar a los seres queridos: un valor humano que la competencia no ofrece.' },
            { t: 'Tablero anti-fraude', d: 'Trazabilidad total de cada peso cobrado en campo. Protege a la familia y a la empresa de irregularidades.' },
            { t: 'Score de cartera', d: 'Alertas tempranas de socios en riesgo de caer. Actuar a tiempo para conservar la cobertura y la relación.' },
          ].map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: .55, delay: i * .07 }} className="value glass" style={panelStyle(c)}>
              <div className="value-bullet" style={{ background: `linear-gradient(135deg, ${EMERALD}, ${EMERALD_LIGHT})` }}>
                <Icon d={ICONS.spark} size={16} />
              </div>
              <div>
                <h3>{r.t}</h3>
                <p style={{ color: c.sub }}>{r.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="roadmap" c={c} kicker="Roadmap · próximos días" icon={ICONS.flag}
        title="Lo que VMomentum entregará"
        intro="Un plan claro, por fases, para llevar PREMMEX de la visión a una plataforma viva en operación.">
        <div className="timeline">
          {[
            { f: 'Fase 1 · Días 1–3', t: 'Cimientos & socio', d: 'Modelo de datos en Neon, accesos por rol con Clerk, afiliación digital y consulta de contrato/saldo del socio.' },
            { f: 'Fase 2 · Días 4–6', t: 'Cobranza en campo', d: 'App de ruta para el cobrador, registro de cobro con evidencia, modo offline y estados de cuenta al instante.' },
            { f: 'Fase 3 · Días 7–9', t: 'Pagos & avisos', d: 'Mercado Pago y Stripe en línea, recordatorios por WhatsApp/SMS/correo y facturación automática.' },
            { f: 'Fase 4 · Días 10–12', t: 'Inteligencia & cartera', d: 'Tablero ejecutivo en tiempo real, score de cartera, ruta inteligente y reportes de productividad.' },
            { f: 'Fase 5 · Entrega', t: 'Pulido & lanzamiento', d: 'Memorial digital, ajustes de marca, pruebas de campo y puesta en producción con acompañamiento.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: .5, delay: i * .08 }} className="tl-item">
              <div className="tl-dot" style={{ background: EMERALD_LIGHT, boxShadow: `0 0 0 5px ${theme === 'night' ? 'rgba(16,185,129,.14)' : 'rgba(4,120,87,.12)'}` }} />
              <div className="tl-card glass" style={panelStyle(c)}>
                <span className="tl-phase" style={{ color: EMERALD_LIGHT }}>{s.f}</span>
                <h3>{s.t}</h3>
                <p style={{ color: c.sub }}>{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <section id="cierre" className="closing">
        <div className="hero-img" style={{ backgroundImage: `url(${IMG.cierre})`, filter: theme === 'day' ? 'saturate(1.05)' : 'none' }} />
        <div className="hero-img-overlay" style={{ background: c.heroOverlay }} />
        <div className="closing-content">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="pill" style={{ borderColor: c.panelBorder, color: EMERALD_LIGHT, background: c.panel }}>
            <Icon d={ICONS.leaf} size={15} /> Estamos listos para construir
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}>
            Hagamos de PREMMEX<br />una plataforma que cuida.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
            style={{ color: c.text }}>
            Con tecnología seria, diseño digno y un equipo que ejecuta.
            VMomentum acompaña a Previsión Mutual de México en cada paso.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .3 }}
            className="hero-cta">
            <a href="https://wa.me/" className="btn-primary">
              Avanzar con VMomentum <Icon d={ICONS.arrow} size={18} />
            </a>
            <button onClick={() => go('inicio')} className="btn-ghost" style={{ borderColor: c.panelBorder, color: c.text }}>
              Volver al inicio
            </button>
          </motion.div>
          <div className="foot" style={{ color: c.sub, borderColor: c.line }}>
            <span><b style={{ color: c.text }}>VMomentum</b> · Forge Labs</span>
            <span>Previsión Mutual de México — Propuesta {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    </main>
  )
}

function panelStyle(c: Palette) {
  return { background: c.panel, border: `1px solid ${c.panelBorder}`, boxShadow: c.glassShadow } as React.CSSProperties
}

function Section({ id, c, kicker, title, intro, icon, children }: {
  id: string; c: Palette; kicker: string; title: string; intro: string; icon: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="sect">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: .6 }} className="sect-head">
        <span className="kicker" style={{ color: EMERALD_LIGHT, borderColor: c.panelBorder, background: c.panel }}>
          <Icon d={icon} size={15} /> {kicker}
        </span>
        <h2>{title}</h2>
        <p style={{ color: c.sub }}>{intro}</p>
      </motion.div>
      {children}
    </section>
  )
}

function Card({ c, children, delay = 0 }: { c: Palette; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: .55, delay }} className="card glass" style={panelStyle(c)}>
      {children}
    </motion.div>
  )
}

const globalCss = `
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: ${EMERALD}; border-radius: 4px; }
html { scroll-behavior: smooth; }
h1,h2,h3 { font-family: Georgia, 'Times New Roman', serif; font-weight: 600; letter-spacing: -.01em; }
header .desk-nav { display: flex; gap: clamp(10px,1.4vw,22px); }
header .desk-nav button { background: none; border: none; cursor: pointer; font-size: 14px; transition: color .25s; }
.brandbtn { background: none; border: none; cursor: pointer; font-size: clamp(15px,1.6vw,18px); }
.iconbtn { width: 38px; height: 38px; border-radius: 11px; border: 1px solid; background: transparent; cursor: pointer; display: grid; place-items: center; transition: .2s; }
.iconbtn:hover { transform: translateY(-1px); }
.mobile-only { display: none; }
.mobile-menu { position: fixed; top: 66px; left: 0; right: 0; z-index: 49; display: flex; flex-direction: column; padding: 8px 16px 16px; backdrop-filter: blur(16px); }
.mobile-menu button { background: none; border: none; text-align: left; padding: 13px 4px; font-size: 16px; cursor: pointer; border-bottom: 1px solid rgba(150,150,150,.12); }
.hero, .closing { position: relative; min-height: 100svh; display: flex; align-items: center; overflow: hidden; }
.hero-img { position: absolute; inset: 0; background-size: cover; background-position: center; }
.hero-img-overlay { position: absolute; inset: 0; }
.hero-content, .closing-content { position: relative; z-index: 2; padding: 0 clamp(20px,6vw,90px); max-width: 920px; }
.hero-content h1 { font-size: clamp(40px,8vw,86px); line-height: 1.02; margin: 18px 0 22px; }
.hero-content p, .closing-content p { font-size: clamp(16px,2.1vw,21px); line-height: 1.6; max-width: 620px; opacity: .95; }
.closing-content h2 { font-size: clamp(34px,6.5vw,68px); line-height: 1.05; margin: 16px 0 20px; }
.pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px; border: 1px solid; font-size: 13px; font-weight: 600; backdrop-filter: blur(8px); }
.hero-cta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
.btn-primary { display: inline-flex; align-items: center; gap: 9px; padding: 14px 26px; border-radius: 13px; border: none; cursor: pointer; font-size: 15px; font-weight: 700; color: #fff; text-decoration: none; background: linear-gradient(135deg, ${EMERALD}, ${EMERALD_LIGHT}); box-shadow: 0 12px 30px -10px rgba(4,120,87,.6); transition: .25s; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -12px rgba(4,120,87,.7); }
.btn-ghost { padding: 14px 24px; border-radius: 13px; border: 1px solid; background: transparent; cursor: pointer; font-size: 15px; font-weight: 600; backdrop-filter: blur(8px); transition: .25s; }
.btn-ghost:hover { transform: translateY(-2px); }
.scroll-hint { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; }
.sect { max-width: 1180px; margin: 0 auto; padding: clamp(72px,11vw,130px) clamp(20px,5vw,48px); }
.sect-head { max-width: 760px; margin-bottom: clamp(34px,5vw,56px); }
.kicker { display: inline-flex; align-items: center; gap: 7px; padding: 7px 15px; border-radius: 999px; border: 1px solid; font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 18px; }
.sect-head h2 { font-size: clamp(28px,4.6vw,48px); line-height: 1.08; margin-bottom: 16px; }
.sect-head p { font-size: clamp(15px,1.9vw,18px); line-height: 1.65; }
.grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.grid2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
.card { padding: 26px; border-radius: 20px; display: flex; flex-direction: column; transition: transform .3s ease; }
.card:hover { transform: translateY(-4px); }
.card-ic { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; border: 1px solid; margin-bottom: 16px; }
.card h3, .flow-step h3, .value h3, .tl-card h3 { font-size: 20px; margin-bottom: 9px; }
.card p { font-size: 14.5px; line-height: 1.6; }
.tag { display: inline-flex; align-items: center; align-self: flex-start; margin-top: 13px; padding: 5px 12px; border: 1px solid; border-radius: 999px; font-size: 12px; font-weight: 700; }
.modrow { display: flex; flex-wrap: wrap; gap: 11px; margin-top: 26px; }
.chip { display: inline-flex; align-items: center; gap: 7px; padding: 9px 15px; border: 1px solid; border-radius: 999px; font-size: 13.5px; font-weight: 600; }
.flow { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.flow-step { padding: 24px; border-radius: 18px; position: relative; }
.flow-num { font-family: Georgia, serif; font-size: 30px; font-weight: 700; opacity: .5; margin-bottom: 10px; }
.flow-step p { font-size: 14px; line-height: 1.55; }
.split { display: grid; grid-template-columns: 1.1fr .9fr; gap: 22px; margin-top: 26px; align-items: stretch; }
.ul { list-style: none; display: flex; flex-direction: column; gap: 13px; margin-top: 6px; }
.ul li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; line-height: 1.5; }
.ul li svg { color: ${EMERALD_LIGHT}; flex-shrink: 0; margin-top: 2px; }
.opimg { border-radius: 20px; background-size: cover; background-position: center; min-height: 280px; position: relative; overflow: hidden; }
.opimg-cap { position: absolute; bottom: 0; left: 0; right: 0; padding: 22px; font-size: 14px; line-height: 1.45; color: #fff; }
.value { display: flex; gap: 16px; padding: 22px; border-radius: 18px; align-items: flex-start; transition: transform .3s; }
.value:hover { transform: translateY(-3px); }
.value-bullet { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; color: #fff; flex-shrink: 0; }
.value p { font-size: 14px; line-height: 1.55; }
.timeline { position: relative; display: flex; flex-direction: column; gap: 18px; padding-left: 8px; }
.timeline::before { content: ''; position: absolute; left: 14px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(${EMERALD}, transparent); }
.tl-item { position: relative; padding-left: 42px; }
.tl-dot { position: absolute; left: 8px; top: 24px; width: 14px; height: 14px; border-radius: 50%; }
.tl-card { padding: 22px 24px; border-radius: 16px; }
.tl-phase { font-size: 12.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; }
.tl-card h3 { margin: 7px 0 8px; }
.tl-card p { font-size: 14.5px; line-height: 1.55; }
.foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; margin-top: 44px; padding-top: 22px; border-top: 1px solid; font-size: 13px; }
@media (max-width: 900px) {
  .desk-nav { display: none; }
  .mobile-only { display: grid; }
  .grid3, .grid2, .flow { grid-template-columns: 1fr; }
  .split { grid-template-columns: 1fr; }
}
@media (min-width: 640px) and (max-width: 900px) {
  .grid3, .grid2 { grid-template-columns: repeat(2,1fr); }
}
`
