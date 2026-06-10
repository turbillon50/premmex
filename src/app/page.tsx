'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [mode, setMode] = useState<'publico'|'usuario'|'admin'>('publico')

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2800)
    return () => clearTimeout(t)
  }, [])

  const modeColors = { publico: '#C9A84C', usuario: '#4CAF50', admin: '#9C27B0' }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: '#0A0A0A' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-24 h-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid transparent', borderTopColor: '#C9A84C' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                    <path d="M24 6 L24 42" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M14 16 Q24 6 34 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <path d="M14 32 Q24 42 34 32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    <circle cx="24" cy="24" r="3" fill="#C9A84C"/>
                  </svg>
                </div>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-serif tracking-[0.3em] shimmer-text"
              >
                PREMMEX
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.9 }}
                className="text-xs tracking-[0.25em] text-stone-400 uppercase"
              >
                Previsión · Mutual · de · México
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1.2, ease: 'easeInOut' }}
              className="absolute bottom-12 h-px w-48"
              style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)', transformOrigin: 'left' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODE SWITCHER */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass rounded-full px-2 py-2 flex gap-1 shadow-2xl"
        style={{ minWidth: '280px' }}
      >
        {(['publico','usuario','admin'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              background: mode === m ? modeColors[m] : 'transparent',
              color: mode === m ? '#0A0A0A' : '#9A9A9A',
            }}
          >
            {m === 'publico' ? '🌐 Público' : m === 'usuario' ? '👤 Cobrador' : '⚙️ Admin'}
          </button>
        ))}
      </motion.div>

      {mode === 'publico' && <PublicoView />}
      {mode === 'usuario' && <CobradorView />}
      {mode === 'admin' && <AdminView />}
    </>
  )
}

function PublicoView() {
  const stats = [
    { label: 'Familias protegidas', value: '12,400+' },
    { label: 'Años de experiencia', value: '28' },
    { label: 'Estados con cobertura', value: '18' },
  ]
  const planes = [
    { name: 'Serenidad Básico', price: '$15,000', monthly: '$1,500/mes', features: ['Traslado local','Velación 24h','Ataúd digno','Trámites legales'], color: '#9A9A9A' },
    { name: 'Paz Familiar', price: '$28,000', monthly: '$2,800/mes', features: ['Traslado ilimitado','Velación 48h','Ataúd premium','Flores y recordatorios'], color: '#C9A84C', featured: true },
    { name: 'Eternidad Plus', price: '$45,000', monthly: '$4,500/mes', features: ['Traslado nacional','72h velación','Ataúd de lujo','Transmisión + Nicho'], color: '#E8C97A' },
  ]
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="font-serif text-lg shimmer-text tracking-widest">PREMMEX</div>
        <div className="flex items-center gap-6">
          <a href="#planes" className="text-xs text-stone-400 nav-item hidden md:block">Planes</a>
          <a href="#contacto" className="text-xs text-stone-400 nav-item hidden md:block">Contacto</a>
          <button className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
            Mi contrato
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)' }}/>
        
        <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:2.9,duration:0.8 }}
          className="text-center max-w-xl relative z-10">
          <motion.div
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:3.0 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs tracking-widest"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }}/>
            PREVENCIÓN · DIGNIDAD · CONFIANZA
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight text-stone-100">
            Protegemos<br/>
            <span className="shimmer-text">lo que más</span><br/>
            importa
          </h1>
          <p className="text-stone-400 text-base mb-10 leading-relaxed">
            Planes funerarios con pagos mensuales cómodos.<br/>
            Más de 12,400 familias confían en nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#planes"
              className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', color: '#0A0A0A' }}>
              Ver planes →
            </a>
            <button className="px-8 py-3 rounded-full text-sm font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9A9A9A' }}>
              Acceder a mi contrato
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:3.3}}
          className="absolute bottom-16 flex gap-10 md:gap-16">
          {stats.map((s,i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-serif shimmer-text">{s.value}</div>
              <div className="text-xs text-stone-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }}/>
      </div>

      {/* PLANES */}
      <section id="planes" className="px-4 py-20 max-w-5xl mx-auto">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="text-center mb-12">
          <div className="text-xs text-stone-500 tracking-widest mb-3">NUESTROS PLANES</div>
          <h2 className="text-3xl font-serif text-stone-100 mb-2">Elige tu plan</h2>
          <p className="text-stone-500 text-sm">Sin letra chica · Cobertura inmediata · Pagos cómodos</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {planes.map((p,i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{delay:i*0.15}} whileHover={{y:-4,transition:{duration:0.2}}}
              className="relative rounded-2xl p-6 cursor-pointer"
              style={p.featured
                ? { background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.35)' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#C9A84C', color: '#0A0A0A' }}>Más popular</div>
              )}
              <div className="text-xl font-serif mb-2" style={{ color: p.color }}>{p.name}</div>
              <div className="text-3xl font-light mb-1 text-stone-100">{p.price}</div>
              <div className="text-sm mb-6" style={{ color: p.color, opacity: 0.8 }}>{p.monthly}</div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f,j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-stone-400">
                    <span style={{ color: p.color }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={p.featured
                  ? { background: '#C9A84C', color: '#0A0A0A' }
                  : { border: `1px solid ${p.color}55`, color: p.color }}>
                Contratar ahora
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="max-w-lg mx-auto glass-gold rounded-3xl p-10">
          <div className="text-3xl mb-4">🕯️</div>
          <h3 className="text-2xl font-serif text-stone-100 mb-3">Tu tranquilidad, nuestra misión</h3>
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            Desde 1996 acompañando a familias mexicanas con dignidad y respeto en los momentos más difíciles.
          </p>
          <div className="text-sm" style={{ color: '#C9A84C' }}>📞 998 717 5692</div>
        </motion.div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-stone-600 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="font-serif shimmer-text text-sm mb-2">PREMMEX</div>
        <div>© 2024 Previsión Mutual de México · Todos los derechos reservados</div>
      </footer>
    </div>
  )
}

function CobradorView() {
  const [selected, setSelected] = useState<number|null>(null)
  const [cobrados, setCobrados] = useState<number[]>([2])

  const ruta = [
    { nombre: 'María González', dir: 'Av. Tulum 123, Centro', monto: 2800, contrato: 'PMX-2024-001', tel: '9982000001', atrasado: false },
    { nombre: 'José Luis Ramírez', dir: 'Calle Jazmín 45, Jardines', monto: 1500, contrato: 'PMX-2024-002', tel: '9982000002', atrasado: true },
    { nombre: 'Roberto Silva', dir: 'Av. Cobá 340, SM-5', monto: 2800, contrato: 'PMX-2024-006', tel: '9982000006', atrasado: false },
    { nombre: 'Lucía Martínez', dir: 'Calle Cedro 12, Bonampak', monto: 1500, contrato: 'PMX-2024-005', tel: '9982000005', atrasado: true },
    { nombre: 'Héctor Jiménez', dir: 'Av. Nichupté 123, R-100', monto: 1500, contrato: 'PMX-2024-010', tel: '9982000010', atrasado: false },
  ]

  const totalCobrado = cobrados.reduce((a,i) => a + ruta[i].monto, 0)
  const totalPendiente = ruta.filter((_,i) => !cobrados.includes(i)).reduce((a,r) => a+r.monto,0)

  const toggleCobro = (i: number) => {
    setCobrados(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i])
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: '#0A0A0A' }}>
      {/* Header cobrador */}
      <div className="px-4 pt-12 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          <div className="text-xs text-stone-500 tracking-widest mb-1">COBRADOR · MODO CAMPO</div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-serif text-stone-100">Roberto Méndez</h1>
              <div className="text-xs text-stone-500">Zona Norte · Martes 10 Jun 2025</div>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
              👤
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Cobrado', value: `$${totalCobrado.toLocaleString()}`, color: '#4CAF50' },
            { label: 'Pendiente', value: `$${totalPendiente.toLocaleString()}`, color: '#FF9800' },
          ].map((s,i) => (
            <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1+i*0.1}}
              className="rounded-xl p-3"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}33` }}>
              <div className="text-xs text-stone-500 mb-1">{s.label}</div>
              <div className="text-xl font-serif" style={{ color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ruta del día */}
      <div className="px-4 pt-4">
        <div className="text-xs text-stone-500 tracking-widest mb-3">RUTA DEL DÍA · {ruta.length} VISITAS</div>
        <div className="space-y-3">
          {ruta.map((c,i) => {
            const esCobrado = cobrados.includes(i)
            return (
              <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                className="rounded-2xl overflow-hidden"
                style={{ border: esCobrado ? '1px solid rgba(76,175,80,0.4)' : c.atrasado ? '1px solid rgba(255,152,0,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  background: esCobrado ? 'rgba(76,175,80,0.05)' : 'rgba(255,255,255,0.02)' }}>
                <div className="px-4 py-3 flex items-center justify-between cursor-pointer"
                  onClick={() => setSelected(selected===i?null:i)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: esCobrado ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.05)' }}>
                      {esCobrado ? '✓' : (i+1)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-stone-100">{c.nombre}</div>
                      <div className="text-xs text-stone-500">{c.dir}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: '#C9A84C' }}>${c.monto.toLocaleString()}</div>
                    {c.atrasado && <div className="text-xs text-orange-400">⚠ Atrasado</div>}
                    {esCobrado && <div className="text-xs text-green-400">Cobrado</div>}
                  </div>
                </div>
                <AnimatePresence>
                  {selected === i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-xs text-stone-500 mb-3">Folio: <span className="text-stone-300">{c.contrato}</span></div>
                        <div className="grid grid-cols-3 gap-2">
                          <a href={`tel:${c.tel}`}
                            className="flex flex-col items-center py-2.5 rounded-xl text-xs gap-1"
                            style={{ background: 'rgba(33,150,243,0.12)', color: '#2196F3' }}>
                            <span className="text-lg">📞</span>Llamar
                          </a>
                          <a href={`https://wa.me/52${c.tel}`}
                            className="flex flex-col items-center py-2.5 rounded-xl text-xs gap-1"
                            style={{ background: 'rgba(37,211,102,0.12)', color: '#25D166' }}>
                            <span className="text-lg">💬</span>WA
                          </a>
                          <button onClick={() => toggleCobro(i)}
                            className="flex flex-col items-center py-2.5 rounded-xl text-xs gap-1"
                            style={{ background: esCobrado ? 'rgba(255,87,34,0.12)' : 'rgba(201,168,76,0.18)', color: esCobrado ? '#FF5722' : '#C9A84C' }}>
                            <span className="text-lg">{esCobrado ? '↩' : '💰'}</span>
                            {esCobrado ? 'Deshacer' : 'Cobrar'}
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

function AdminView() {
  const [tab, setTab] = useState<'dashboard'|'contratos'|'cobradores'>('dashboard')

  const stats = [
    { label: 'Contratos activos', value: '164', icon: '📋', color: '#C9A84C' },
    { label: 'Cobrado este mes', value: '$67,600', icon: '💰', color: '#4CAF50' },
    { label: 'Por cobrar', value: '$18,900', icon: '⏳', color: '#FF9800' },
    { label: 'Cobradores', value: '4', icon: '👥', color: '#9C27B0' },
  ]

  const cobradores = [
    { nombre: 'Javier Hernández', zona: 'Centro', contratos: 52, cobrado: 22100, meta: 24000 },
    { nombre: 'Roberto Méndez', zona: 'Norte', contratos: 45, cobrado: 18500, meta: 20000 },
    { nombre: 'Carmen Torres', zona: 'Sur', contratos: 38, cobrado: 15200, meta: 18000 },
    { nombre: 'Daniela Ruiz', zona: 'Oriente', contratos: 29, cobrado: 11800, meta: 14000 },
  ]

  const contratos = [
    { folio: 'PMX-2024-001', cliente: 'María González', paquete: 'Paz Familiar', mensual: 2800, saldo: 16800, estado: 'al_corriente' },
    { folio: 'PMX-2024-002', cliente: 'José Luis Ramírez', paquete: 'Serenidad Básico', mensual: 1500, saldo: 12000, estado: 'atrasado' },
    { folio: 'PMX-2024-003', cliente: 'Ana Patricia Flores', paquete: 'Eternidad Plus', mensual: 4500, saldo: 36000, estado: 'al_corriente' },
    { folio: 'PMX-2024-004', cliente: 'Carlos Morales', paquete: 'Paz Familiar', mensual: 2800, saldo: 5600, estado: 'al_corriente' },
    { folio: 'PMX-2024-007', cliente: 'Esperanza Díaz', paquete: 'Eternidad Plus', mensual: 4500, saldo: 0, estado: 'liquidado' },
  ]

  const pagos = [
    { cliente: 'Roberto Silva', monto: 2800, metodo: 'Efectivo', hora: '12 min', folio: 'REC-006' },
    { cliente: 'Héctor Jiménez', monto: 1500, metodo: 'Mercado Pago', hora: '28 min', folio: 'REC-009' },
    { cliente: 'Ana Flores', monto: 4500, metodo: 'Efectivo', hora: '1h', folio: 'REC-003' },
    { cliente: 'María González', monto: 2800, metodo: 'Efectivo', hora: '5 días', folio: 'REC-001' },
  ]

  return (
    <div className="min-h-screen pb-28" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs text-stone-500 tracking-widest mb-1">PANEL ADMINISTRATIVO</div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif shimmer-text">PREMMEX</h1>
          <div className="text-xs glass-gold px-3 py-1 rounded-full" style={{ color: '#C9A84C' }}>
            Sede Cancún
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 pt-4 gap-2 mb-4">
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'contratos', label: '📋 Contratos' },
          { key: 'cobradores', label: '👥 Equipo' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className="px-4 py-2 rounded-full text-xs font-medium transition-all"
            style={tab === t.key
              ? { background: '#C9A84C', color: '#0A0A0A' }
              : { background: 'rgba(255,255,255,0.05)', color: '#9A9A9A' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="px-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {stats.map((s,i) => (
              <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.08}}
                className="glass rounded-2xl p-4"
                style={{ borderColor: `${s.color}22` }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xs text-stone-500 mb-1">{s.label}</div>
                <div className="text-xl font-serif" style={{ color: s.color }}>{s.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Pagos recientes */}
          <div className="text-xs text-stone-500 tracking-widest mb-3">COBROS RECIENTES</div>
          <div className="space-y-2 mb-6">
            {pagos.map((p,i) => (
              <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.07}}
                className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-stone-200">{p.cliente}</div>
                  <div className="text-xs text-stone-500">{p.metodo} · hace {p.hora}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: '#4CAF50' }}>+${p.monto.toLocaleString()}</div>
                  <div className="text-xs text-stone-600">{p.folio}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Acciones */}
          <div className="text-xs text-stone-500 tracking-widest mb-3">ACCIONES RÁPIDAS</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nuevo contrato', icon: '📋', color: '#C9A84C' },
              { label: 'Reporte mensual', icon: '📊', color: '#9C27B0' },
              { label: 'Mapa de rutas', icon: '🗺️', color: '#2196F3' },
              { label: 'Enviar recibos', icon: '📱', color: '#4CAF50' },
            ].map((a,i) => (
              <motion.button key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.7+i*0.06}}
                className="glass rounded-2xl p-4 text-left hover:opacity-80 transition-opacity"
                style={{ borderColor: `${a.color}33` }}
                whileHover={{ scale: 1.02 }}>
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="text-sm text-stone-300">{a.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {tab === 'contratos' && (
        <div className="px-4">
          <div className="text-xs text-stone-500 tracking-widest mb-3">CONTRATOS ACTIVOS</div>
          <div className="space-y-3">
            {contratos.map((c,i) => (
              <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                className="glass rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-stone-100 text-sm">{c.cliente}</div>
                    <div className="text-xs text-stone-500">{c.folio} · {c.paquete}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    c.estado==='liquidado' ? 'bg-green-500/20 text-green-400' :
                    c.estado==='atrasado' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-stone-700/50 text-stone-400'}`}>
                    {c.estado.replace('_',' ')}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Mensual: <span style={{ color: '#C9A84C' }}>${c.mensual.toLocaleString()}</span></span>
                  <span className="text-stone-500">Saldo: <span className="text-stone-300">${c.saldo.toLocaleString()}</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === 'cobradores' && (
        <div className="px-4">
          <div className="text-xs text-stone-500 tracking-widest mb-3">RENDIMIENTO DEL EQUIPO</div>
          <div className="space-y-4">
            {cobradores.map((c,i) => {
              const pct = Math.round(c.cobrado/c.meta*100)
              return (
                <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.09}}
                  className="glass rounded-2xl p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="font-medium text-stone-100">{c.nombre}</div>
                      <div className="text-xs text-stone-500">Zona {c.zona} · {c.contratos} contratos</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium" style={{ color: '#C9A84C' }}>${c.cobrado.toLocaleString()}</div>
                      <div className="text-xs text-stone-500">{pct}% de meta</div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.4+i*0.1,duration:0.8}}
                      className="h-full rounded-full"
                      style={{ background: pct>=90 ? '#4CAF50' : pct>=70 ? '#C9A84C' : '#FF5722' }}/>
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
