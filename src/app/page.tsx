'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark } from '@/components/shared'

/* ── Paleta obsidiana (landing pública, siempre oscura) ── */
const VOID = '#03020a'
const BG = '#0a0814'
const NACAR = '#f0f4ff'
const SOFT = 'rgba(240,244,255,0.62)'
const BRAND = '#15a07f'
const BRAND_2 = '#0f766e'
const LINE = 'rgba(240,244,255,0.10)'
const PANEL = 'rgba(240,244,255,0.035)'

const BENEFICIOS = [
  { I: Ic.team,   t: 'Personal profesional', d: 'Equipo capacitado y humano que acompaña a la familia en cada paso, con respeto y discreción.' },
  { I: Ic.map,    t: 'Recolección y traslado', d: 'Servicio de recolección y traslado de la unidad médica dentro de la región, sin que la familia se preocupe.' },
  { I: Ic.doc,    t: 'Asesoría en trámites', d: 'Apoyo en certificado médico, acta de defunción y permisos, para que todo quede en orden.' },
  { I: Ic.phone,  t: 'Atención 24/7', d: 'Estamos disponibles los 365 días del año, a cualquier hora. Una llamada basta.' },
]

export default function Landing() {
  const [form, setForm] = useState({ nombre:'', telefono:'', domicilio:'', mensaje:'' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const upd = (k:string,v:string) => setForm(f => ({ ...f, [k]:v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) { setErr('Escribe tu nombre por favor'); return }
    setSending(true); setErr('')
    try {
      const r = await fetch('/api/leads', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'No se pudo enviar')
      setSent(true)
    } catch (e:any) { setErr(e.message || 'Error de conexión') }
    setSending(false)
  }

  const input: React.CSSProperties = {
    width:'100%', padding:'14px 16px', borderRadius:14, boxSizing:'border-box',
    border:`1px solid ${LINE}`, background:'rgba(0,0,0,0.25)', color:NACAR,
    fontSize:15, outline:'none', fontFamily:'inherit',
  }

  return (
    <main style={{ background:`radial-gradient(120% 80% at 50% -10%, #0d0a1c 0%, ${BG} 55%, ${VOID} 100%)`,
      color:NACAR, minHeight:'100svh', fontFamily:'Inter, system-ui, sans-serif', overflowX:'hidden' }}>

      {/* NAV */}
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px clamp(16px,5vw,44px)', background:'rgba(10,8,20,0.55)',
        backdropFilter:'blur(14px)', borderBottom:`1px solid ${LINE}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Mark s={30} />
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, letterSpacing:'0.2em' }}>PREMMEX</span>
        </div>
        <a href="/acceso" style={{ display:'inline-flex', alignItems:'center', gap:7, textDecoration:'none',
          padding:'8px 16px', borderRadius:999, fontSize:13, fontWeight:600, color:NACAR,
          border:`1px solid ${LINE}`, background:PANEL }}>
          <Ic.lock s={14} c={BRAND}/> Acceso
        </a>
      </header>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center',
        padding:'0 clamp(20px,6vw,90px)' }}>
        <div style={{ position:'absolute', inset:0, zIndex:0, opacity:0.5,
          background:'radial-gradient(60% 50% at 70% 30%, rgba(21,160,127,0.18), transparent 70%)' }}/>
        <div style={{ position:'relative', zIndex:2, maxWidth:820 }}>
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:999,
              border:`1px solid ${LINE}`, background:PANEL, fontSize:12.5, fontWeight:600, color:BRAND,
              letterSpacing:'0.06em', marginBottom:22 }}>
            <span style={{ width:6, height:6, borderRadius:999, background:BRAND }}/>
            Capilla de Guadalupe · Tepatitlán · Jalisco
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:0.1 }}
            style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:500, lineHeight:1.04,
              fontSize:'clamp(40px,8vw,80px)', margin:'0 0 22px', color:NACAR }}>
            Previsión funeraria<br/>digna, para tu familia
          </motion.h1>
          <motion.p initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:0.25 }}
            style={{ fontSize:'clamp(16px,2.2vw,20px)', lineHeight:1.6, color:SOFT, maxWidth:600, margin:'0 0 34px' }}>
            En PREMMEX acompañamos a cada familia con serenidad y respeto. Protege hoy lo que más importa,
            con la tranquilidad de saber que estaremos ahí cuando más se necesite.
          </motion.p>
          <motion.div initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:0.4 }}
            style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
            <a href="#contacto" style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'15px 28px',
              borderRadius:14, textDecoration:'none', fontSize:15, fontWeight:700, color:'#fff',
              background:`linear-gradient(135deg, ${BRAND}, ${BRAND_2})`, boxShadow:'0 12px 34px -12px rgba(21,160,127,0.6)' }}>
              Quiero informes <Ic.arrow s={18} c="#fff"/>
            </a>
            <a href="#nosotros" style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'15px 26px',
              borderRadius:14, textDecoration:'none', fontSize:15, fontWeight:600, color:NACAR,
              border:`1px solid ${LINE}`, background:PANEL }}>
              Conócenos
            </a>
          </motion.div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" style={{ maxWidth:1080, margin:'0 auto', padding:'clamp(48px,9vw,110px) clamp(20px,5vw,44px)' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.6 }} style={{ maxWidth:720 }}>
          <div style={{ fontSize:12.5, letterSpacing:'0.18em', textTransform:'uppercase', color:BRAND, fontWeight:700, marginBottom:16 }}>
            Quiénes somos
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:500, fontSize:'clamp(28px,4.6vw,44px)',
            lineHeight:1.1, margin:'0 0 18px' }}>
            Previsión Mutual de México
          </h2>
          <p style={{ fontSize:'clamp(15px,1.9vw,18px)', lineHeight:1.7, color:SOFT, margin:0 }}>
            Somos una empresa de previsión funeraria con raíces en Capilla de Guadalupe. Creemos que despedir
            a un ser querido debe hacerse con dignidad y sin la angustia de los gastos imprevistos. Por eso
            ofrecemos un acompañamiento cercano, profesional y humano a las familias de la región.
          </p>
        </motion.div>
      </section>

      {/* BENEFICIOS (genéricos, sin precios ni planes) */}
      <section style={{ maxWidth:1080, margin:'0 auto', padding:'0 clamp(20px,5vw,44px) clamp(48px,9vw,90px)' }}>
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.5 }} style={{ marginBottom:34 }}>
          <div style={{ fontSize:12.5, letterSpacing:'0.18em', textTransform:'uppercase', color:BRAND, fontWeight:700, marginBottom:14 }}>
            Nuestro servicio
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:500, fontSize:'clamp(26px,4vw,40px)', margin:0 }}>
            Un acompañamiento completo
          </h2>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:18 }}>
          {BENEFICIOS.map((b,i) => (
            <motion.div key={i} initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
              transition={{ duration:0.5, delay:i*0.08 }}
              style={{ padding:'26px 22px', borderRadius:20, background:PANEL, border:`1px solid ${LINE}` }}>
              <div style={{ width:50, height:50, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(21,160,127,0.12)', border:`1px solid ${LINE}`, marginBottom:16 }}>
                <b.I s={24} c={BRAND}/>
              </div>
              <h3 style={{ fontSize:18, margin:'0 0 8px', fontWeight:600, color:NACAR }}>{b.t}</h3>
              <p style={{ fontSize:14, lineHeight:1.55, color:SOFT, margin:0 }}>{b.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONFIANZA / TESTIMONIAL */}
      <section style={{ maxWidth:900, margin:'0 auto', padding:'0 clamp(20px,5vw,44px) clamp(48px,9vw,90px)' }}>
        <motion.figure initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }}
          transition={{ duration:0.6 }}
          style={{ margin:0, padding:'clamp(32px,5vw,52px)', borderRadius:26, textAlign:'center',
            background:`linear-gradient(135deg, rgba(21,160,127,0.08), ${PANEL})`, border:`1px solid ${LINE}` }}>
          <div style={{ display:'inline-flex', width:52, height:52, borderRadius:'50%', alignItems:'center', justifyContent:'center',
            background:'rgba(21,160,127,0.14)', marginBottom:20 }}>
            <Ic.shield s={26} c={BRAND}/>
          </div>
          <blockquote style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(22px,3.4vw,32px)', lineHeight:1.3,
            fontStyle:'italic', margin:'0 0 18px', color:NACAR }}>
            “Cuando más lo necesitamos, PREMMEX estuvo con nosotros. Nos guiaron con calma y respeto en un
            momento muy difícil. Eso no tiene precio.”
          </blockquote>
          <figcaption style={{ fontSize:13, color:SOFT, letterSpacing:'0.04em' }}>
            — Familia socia de Capilla de Guadalupe
          </figcaption>
        </motion.figure>
      </section>

      {/* CTA FORMULARIO */}
      <section id="contacto" style={{ maxWidth:560, margin:'0 auto', padding:'0 clamp(20px,5vw,44px) clamp(64px,10vw,120px)' }}>
        <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }}
          transition={{ duration:0.6 }}
          style={{ padding:'clamp(26px,4vw,40px)', borderRadius:26, background:PANEL, border:`1px solid ${LINE}`,
            boxShadow:'0 30px 80px -40px rgba(0,0,0,0.8)' }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                style={{ textAlign:'center', padding:'20px 0' }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.1 }}
                  style={{ width:70, height:70, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(21,160,127,0.16)', margin:'0 auto 22px' }}>
                  <Ic.check s={36} c={BRAND}/>
                </motion.div>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, margin:'0 0 10px', color:NACAR }}>
                  ¡Gracias!
                </h3>
                <p style={{ fontSize:15, lineHeight:1.6, color:SOFT, margin:0 }}>
                  Un asesor te contactará muy pronto para brindarte toda la información con gusto.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <div style={{ fontSize:12.5, letterSpacing:'0.16em', textTransform:'uppercase', color:BRAND, fontWeight:700, marginBottom:10 }}>
                    Solicita informes
                  </div>
                  <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:500, fontSize:'clamp(24px,4vw,32px)', margin:'0 0 6px', color:NACAR }}>
                    Déjanos tus datos
                  </h2>
                  <p style={{ fontSize:14, color:SOFT, margin:0, lineHeight:1.5 }}>
                    Sin compromiso. Un asesor te contactará para resolver todas tus dudas.
                  </p>
                </div>
                <input style={input} placeholder="Nombre completo *" value={form.nombre} onChange={e=>upd('nombre',e.target.value)} />
                <input style={input} type="tel" placeholder="Teléfono / WhatsApp" value={form.telefono} onChange={e=>upd('telefono',e.target.value)} />
                <input style={input} placeholder="Domicilio o colonia" value={form.domicilio} onChange={e=>upd('domicilio',e.target.value)} />
                <textarea style={{ ...input, minHeight:80, resize:'vertical' }} placeholder="Mensaje (opcional)" value={form.mensaje} onChange={e=>upd('mensaje',e.target.value)} />
                {err && <div style={{ fontSize:13, color:'#fca5a5', fontWeight:600 }}>{err}</div>}
                <button type="submit" disabled={sending}
                  style={{ padding:'15px', borderRadius:14, border:'none', cursor:'pointer', marginTop:4,
                    background:`linear-gradient(135deg, ${BRAND}, ${BRAND_2})`, color:'#fff', fontSize:15, fontWeight:700,
                    opacity:sending?0.6:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {sending ? 'Enviando...' : <>Enviar solicitud <Ic.arrow s={17} c="#fff"/></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:`1px solid ${LINE}`, padding:'28px clamp(20px,5vw,44px)',
        display:'flex', flexWrap:'wrap', gap:12, justifyContent:'space-between', alignItems:'center',
        fontSize:13, color:SOFT }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Mark s={26}/>
          <span>PREMMEX · Previsión Mutual de México</span>
        </div>
        <span>Vicente Guerrero #134 · Tel. 378 138 26 70</span>
      </footer>
    </main>
  )
}
