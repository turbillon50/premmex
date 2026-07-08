'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn } from './shared'

export default function SocioApp({ onBack }: { onBack?: ()=>void }) {
  const [session, setSession] = useState<any>(null)
  const { theme, toggle } = useTheme()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'tel'|'folio'>('tel')
  const [telefono, setTelefono] = useState('')
  const [folio, setFolio] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)
  const [expanded, setExpanded] = useState<number|null>(null)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const login = async () => {
    setLogging(true); setErr('')
    try {
      const body = tab==='folio' ? {folio,pin} : {telefono,pin}
      const r = await fetch('/api/cliente/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      const d = await r.json()
      if(!r.ok) { setErr(d.error||'Datos incorrectos'); setLogging(false); return }
      setSession(d.socio)
      setData({contratos:d.contratos||[],pagos:[],beneficiarios:[]})
      fetch(`/api/cliente/contratos?cliente_id=${d.socio.cliente_id}`).then(x=>x.json()).then(c=>setData(c))
    } catch { setErr('Error de conexión') }
    setLogging(false)
  }

  const estColor = (e: string) => e==='liquidado'?'#16A34A':e==='atrasado'?'#EA580C':'#059669'

  // ── LOGIN ──
  if (!session) return (
    <div style={{minHeight:'100svh',display:'flex',flexDirection:'column',background:'var(--bg)'}}>
      {/* Header con volver */}
      <div style={{padding:'52px 20px 20px',background:'var(--surface)',borderBottom:'1px solid var(--border)'}}>
        {onBack && (
          <button onClick={onBack}
            style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',
                    cursor:'pointer',color:'var(--brand)',fontSize:14,fontWeight:600,marginBottom:16}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Inicio
          </button>
        )}
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:14,background:'var(--brand-soft)',
                       display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Ic.shield s={26} c="var(--brand)"/>
          </div>
          <div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,color:'var(--text)'}}>Mi contrato</div>
            <div style={{fontSize:13,color:'#059669',fontWeight:600}}>Portal del Socio PREMMEX</div>
          </div>
        </div>
        <p style={{fontSize:13,color:'var(--text-soft)',lineHeight:1.5,margin:0}}>
          Consulta tu saldo, historial de pagos y beneficiario.
        </p>
      </div>

      <div style={{padding:'24px 20px',flex:1}}>
        {/* Tabs teléfono / contrato */}
        <div style={{display:'flex',gap:4,marginBottom:22,background:'var(--surface-2)',borderRadius:12,padding:4}}>
          {(['tel','folio'] as const).map(m=>(
            <button key={m} onClick={()=>{setTab(m);setErr('')}}
              style={{flex:1,padding:'10px',borderRadius:9,border:'none',cursor:'pointer',
                      fontSize:13,fontWeight:600,transition:'all .2s',
                      background:tab===m?'var(--surface)':'transparent',
                      color:tab===m?'var(--brand)':'var(--text-soft)',
                      boxShadow:tab===m?'0 2px 8px rgba(0,0,0,0.08)':undefined}}>
              {m==='tel'?'Por teléfono':'Por contrato'}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {tab==='tel' ? (
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Teléfono registrado</div>
              <input type="tel" value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="998 200 0001"
                style={{width:'100%',padding:'14px 16px',borderRadius:14,border:'1.5px solid var(--border)',
                        background:'var(--surface-2)',color:'var(--text)',fontSize:15,outline:'none',boxSizing:'border-box'}}/>
            </div>
          ):(
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Número de contrato</div>
              <input value={folio} onChange={e=>setFolio(e.target.value.toUpperCase())} placeholder="PMX-2024-001"
                style={{width:'100%',padding:'14px 16px',borderRadius:14,border:'1.5px solid var(--border)',
                        background:'var(--surface-2)',color:'var(--text)',fontSize:15,outline:'none',boxSizing:'border-box'}}/>
            </div>
          )}
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>
              PIN — últimos 4 dígitos de tu teléfono
            </div>
            <input type="password" maxLength={4} value={pin}
              onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="••••"
              style={{width:'100%',padding:'14px',borderRadius:14,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:26,letterSpacing:10,
                      outline:'none',boxSizing:'border-box',textAlign:'center'}}/>
          </div>
          {err && (
            <div style={{padding:'12px 16px',borderRadius:12,background:'#fee2e2',color:'#dc2626',fontSize:13,fontWeight:600}}>
              {err}
            </div>
          )}
          <button onClick={login} disabled={logging||pin.length<4}
            style={{padding:'15px',borderRadius:16,border:'none',cursor:'pointer',
                    background:'linear-gradient(135deg,#059669,#0f766e)',color:'#fff',
                    fontSize:15,fontWeight:700,opacity:(logging||pin.length<4)?.5:1,
                    display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {logging?'Verificando...':<>Ver mi contrato <Ic.arrow s={17} c="#fff"/></>}
          </button>
          <p style={{textAlign:'center',fontSize:12,color:'var(--text-soft)'}}>
            ¿No recuerdas tu PIN? Llama al{' '}
            <a href="tel:9987175692" style={{color:'var(--brand)',fontWeight:600}}>998 717 5692</a>
          </p>
        </div>
      </div>
    </div>
  )

  // ── DASHBOARD ──
  const contratos = data?.contratos || []
  const pagos = data?.pagos || []
  const socio = session

  return (
    <div style={{minHeight:'100svh',paddingBottom:32,background:'var(--bg)'}}>
      {/* Banner */}
      <div style={{background:'linear-gradient(135deg,#059669,var(--brand))',padding:'52px 20px 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Mark s={36}/>
            <div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.7)',letterSpacing:'.12em',fontWeight:600}}>MI PREVISIÓN</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'#fff',fontWeight:500}}>{socio.nombre}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={()=>setSession(null)}
              style={{background:'rgba(255,255,255,.15)',border:'1px solid rgba(255,255,255,.3)',
                      borderRadius:999,padding:'8px 14px',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{padding:'20px'}}>
        <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:14}}>MIS CONTRATOS</div>

        {contratos.length===0 ? (
          <div style={{padding:'28px',textAlign:'center',color:'var(--text-soft)',background:'var(--surface)',
                       borderRadius:18,border:'1px solid var(--border)'}}>
            {loading ? 'Cargando...' : 'No se encontraron contratos activos.'}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {contratos.map((c: any, i: number) => (
              <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',
                                    borderRadius:20,overflow:'hidden',boxShadow:'var(--shadow)'}}>
                <div style={{padding:'18px 20px',cursor:'pointer'}} onClick={()=>setExpanded(expanded===i?null:i)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'#059669',fontWeight:500}}>{c.paquete}</div>
                      <div style={{fontSize:12,color:'var(--text-soft)',marginTop:2}}>{c.folio}</div>
                    </div>
                    <div style={{padding:'5px 12px',borderRadius:999,fontSize:11,fontWeight:700,
                                  background:`${estColor(c.estado)}15`,color:estColor(c.estado)}}>
                      {c.estado?.replace('_',' ')}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[
                      {l:'Mensualidad',v:`$${parseFloat(c.monto_mensual).toLocaleString()}`},
                      {l:'Saldo',v:`$${parseFloat(c.saldo_pendiente).toLocaleString()}`},
                      {l:'Día pago',v:`Día ${c.dia_pago}`},
                    ].map(({l,v},j)=>(
                      <div key={j} style={{background:'var(--surface-2)',borderRadius:12,padding:'10px'}}>
                        <div style={{fontSize:10,color:'var(--text-soft)',fontWeight:600}}>{l}</div>
                        <div style={{fontSize:14,fontWeight:700,color:'var(--text)',marginTop:2}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {parseFloat(c.monto_total)>0 && (
                    <div style={{marginTop:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,
                                    color:'var(--text-soft)',marginBottom:5}}>
                        <span>Avance del plan</span>
                        <span style={{fontWeight:700,color:'#059669'}}>
                          {Math.round(((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100)}%
                        </span>
                      </div>
                      <div style={{height:6,borderRadius:999,background:'var(--surface-2)',overflow:'hidden'}}>
                        <motion.div
                          initial={{width:0}}
                          animate={{width:`${((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100}%`}}
                          transition={{delay:.4,duration:1.1}}
                          style={{height:'100%',borderRadius:999,background:'linear-gradient(90deg,#059669,var(--brand))'}}/>
                      </div>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {expanded===i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
                      <div style={{padding:'0 20px 20px',borderTop:'1px solid var(--border)'}}>
                        {c.beneficiario && (
                          <div style={{background:'var(--brand-soft)',borderRadius:12,padding:'12px 14px',marginTop:14,marginBottom:14}}>
                            <div style={{fontSize:11,color:'var(--brand)',fontWeight:700,marginBottom:2}}>BENEFICIARIO</div>
                            <div style={{fontSize:15,fontWeight:600,color:'var(--text)'}}>{c.beneficiario}</div>
                          </div>
                        )}
                        <button onClick={()=>showToast('Pago en línea próximamente · Llama al 998 717 5692')}
                          style={{width:'100%',padding:'14px',borderRadius:14,border:'none',cursor:'pointer',
                                  background:'linear-gradient(135deg,#059669,var(--brand))',color:'#fff',
                                  fontSize:15,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                          <Ic.money s={16} c="#fff"/>Pagar mensualidad
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}

        {pagos.length>0 && (
          <>
            <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,margin:'24px 0 12px'}}>ÚLTIMOS PAGOS</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {pagos.slice(0,12).map((p: any,i: number)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                      padding:'14px 16px',background:'var(--surface)',borderRadius:14,
                                      border:'1px solid var(--border)'}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{p.cobrador||'Pago registrado'}</div>
                    <div style={{fontSize:11,color:'var(--text-soft)',marginTop:2}}>
                      {p.metodo} · {new Date(p.fecha).toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'})}
                    </div>
                    {p.recibo_num && (
                      <a href={`/api/recibo/${p.recibo_num}`} target="_blank" rel="noreferrer"
                        style={{display:'inline-flex',alignItems:'center',gap:4,marginTop:6,fontSize:11,
                                fontWeight:700,color:'#059669',textDecoration:'none'}}>
                        <Ic.doc s={13} c="#059669"/>Ver recibo
                      </a>
                    )}
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:15,fontWeight:700,color:'#16A34A'}}>+${parseFloat(p.monto).toLocaleString()}</div>
                    <div style={{fontSize:10,color:'var(--text-soft)'}}>{p.recibo_num}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{marginTop:24,padding:'18px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:18}}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>¿Necesitas ayuda?</div>
          <a href="tel:9987175692" style={{display:'flex',alignItems:'center',gap:8,
            color:'#059669',fontWeight:600,fontSize:15,textDecoration:'none',marginBottom:12}}>
            <Ic.phone s={18} c="#059669"/>998 717 5692
          </a>
          <a href="https://wa.me/529987175692" target="_blank" rel="noreferrer"
            style={{display:'flex',alignItems:'center',gap:8,padding:'12px 14px',borderRadius:12,
                    background:'var(--brand-soft)',color:'var(--brand)',fontSize:14,fontWeight:600,textDecoration:'none'}}>
            <Ic.chat s={16} c="var(--brand)"/>Escribir por WhatsApp
          </a>
        </div>
      </div>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
