'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn, PinLogin } from './shared'

export default function CobradorApp({ onBack }: { onBack?: ()=>void }) {
  const [session, setSession] = useState<any>(null)
  const { theme, toggle } = useTheme()
  const [ruta, setRuta] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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

  const handleLogin = async (pin: string) => {
    const r = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({pin}) })
    const d = await r.json()
    if (!r.ok) throw new Error(d.error||'PIN incorrecto')
    setSession(d.cobrador)
  }

  const fetchRuta = useCallback(async () => {
    if (!session?.id) return
    setLoading(true)
    try {
      const r = await fetch(`/api/ruta?cobrador_id=${session.id}`)
      const d = await r.json()
      setRuta(d.ruta || [])
    } catch {}
    setLoading(false)
  }, [session?.id])

  useEffect(() => { if (session) fetchRuta() }, [session, fetchRuta])

  // Handler global para el boton "Registrar cobro" dentro del popup de Leaflet
  useEffect(() => {
    (window as any).__pmxSelectCliente = (cid: string) => {
      const idx = ruta.findIndex((r:any)=>String(r.contrato_id)===String(cid))
      if (idx>=0) { setTabActivo('ruta'); setSelected(idx) }
    }
    return () => { try { delete (window as any).__pmxSelectCliente } catch {} }
  }, [ruta])

  useEffect(() => {
    if (tabActivo !== 'mapa' || !ruta.length || typeof window === 'undefined') return
    setTimeout(() => {
      const el = document.getElementById('premmex-map')
      if (!el || el.hasAttribute('data-map-init')) return
      el.setAttribute('data-map-init','1')
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id='leaflet-css'; link.rel='stylesheet'
        link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      import('leaflet').then((L) => {
        const leaflet: any = L.default || L
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
        const conCoords = ruta.filter((c:any)=>c.lat&&c.lng)
        const center = conCoords.length
          ? [parseFloat(conCoords[0].lat), parseFloat(conCoords[0].lng)]
          : [20.9585,-102.4720] // Capilla de Guadalupe, Jalisco
        const map = leaflet.map('premmex-map').setView(center,14)
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM',maxZoom:19}).addTo(map)
        const bounds:any[] = []
        ruta.forEach((c: any) => {
          if (!c.lat||!c.lng) return
          const paid = cobrados.has(c.contrato_id)
          const color = paid?'#16A34A':c.estado==='atrasado'?'#EA580C':'#0EA5E9'
          const icon = leaflet.divIcon({
            html:`<div style="width:34px;height:34px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid #fff">${paid?'✓':'●'}</div>`,
            iconSize:[34,34],className:''
          })
          const atraso = parseInt(c.dias_mora||'0')>0 ? `<div style="color:#EA580C;font-size:12px">${c.dias_mora} días de atraso</div>` : ''
          const btn = paid
            ? `<div style="color:#16A34A;font-weight:700;margin-top:6px">✓ Cobrado hoy</div>`
            : `<button onclick="window.__pmxSelectCliente&&window.__pmxSelectCliente('${c.contrato_id}')" style="margin-top:8px;width:100%;padding:8px;border:none;border-radius:8px;background:#0EA5E9;color:#fff;font-weight:700;font-size:12px;cursor:pointer">Registrar cobro</button>`
          leaflet.marker([parseFloat(c.lat),parseFloat(c.lng)],{icon})
            .addTo(map)
            .bindPopup(`<div style="min-width:160px"><b style="font-size:14px">${c.nombre}</b><br><span style="color:#666;font-size:12px">${c.direccion||''}, ${c.colonia||''}</span>${atraso}<div style="margin-top:5px;font-size:12px">Saldo: <b>$${parseFloat(c.saldo_pendiente||0).toLocaleString()}</b></div><div style="font-size:12px">Aportación: <b style="color:${color}">$${parseFloat(c.monto_mensual||0).toLocaleString()}</b></div>${btn}</div>`)
          bounds.push([parseFloat(c.lat),parseFloat(c.lng)])
        })
        if (bounds.length>1) { try { map.fitBounds(bounds,{padding:[40,40]}) } catch{} }
      }).catch(()=>{})
    },400)
  },[tabActivo,ruta,cobrados])

  const cobrar = async (item: any, metodo: string) => {
    setPagando(true)
    try {
      const r = await fetch('/api/cobrar',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contrato_id:item.contrato_id,cliente_id:item.cliente_id,cobrador_id:session.id,monto:item.monto_mensual,metodo})})
      const d = await r.json()
      if (!r.ok) { showToast(d.error||'Error',false); setPagando(false); return }
      setCobrados(p=>new Set(Array.from(p).concat(item.contrato_id)))
      const nuevoSaldo = Math.max(0, parseFloat(item.saldo_pendiente||0) - parseFloat(item.monto_mensual||0))
      setRecibo({...item,folio:d.folio,metodo,nuevoSaldo})
      setSelected(null); fetchRuta()
    } catch { showToast('Error de conexión',false) }
    setPagando(false)
  }

  const registrarVisita = async () => {
    if (!visitaModal) return
    try {
      let lat, lng
      try {
        const pos = await new Promise<GeolocationPosition>((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{timeout:5000}))
        lat=pos.coords.latitude; lng=pos.coords.longitude
      } catch {}
      await fetch('/api/visita',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contrato_id:visitaModal.contrato_id,cobrador_id:session.id,resultado:visitaRslt,nota:visitaNota,lat,lng})})
      showToast('Visita registrada')
    } catch { showToast('Error',false) }
    setVisitaModal(null); setVisitaNota('')
  }

  if (!session) return <PinLogin title="PREMMEX" subtitle="Acceso cobrador de campo" color="#0EA5E9" onLogin={handleLogin}
    extra={
      <>
        <p className="text-xs text-center mb-4" style={{color:'var(--text-soft)'}}>Demo: 0001 · 0002 · 0003</p>
        {onBack && <button onClick={onBack} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,width:'100%',marginBottom:8,padding:'10px',background:'none',border:'none',cursor:'pointer',color:'var(--text-soft)',fontSize:13}}><Ic.home s={14} c="var(--text-soft)"/>Volver al inicio</button>}
      </>
    }/>

  const totalCobrado = ruta.filter(r=>cobrados.has(r.contrato_id)).reduce((a,r)=>a+parseFloat(r.monto_mensual),0)
  const totalPendiente = ruta.filter(r=>!cobrados.has(r.contrato_id)).reduce((a,r)=>a+parseFloat(r.monto_mensual),0)

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-cobrador)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-5 flex items-end justify-between">
          <div>
            <div className="kicker !mb-1" style={{color:'#fff',opacity:0.85}}>COBRADOR · CAMPO</div>
            <h1 className="text-2xl font-serif" style={{color:'#fff'}}>{session.nombre}</h1>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.8)'}}>Zona {session.zona} · {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'short'})}</div>
          </div>
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={()=>setSession(null)} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-7 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {[{l:'Cobrado hoy',v:`$${totalCobrado.toLocaleString()}`,c:'#16A34A'},{l:'Pendiente',v:`$${totalPendiente.toLocaleString()}`,c:'#EA580C'}].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.1+i*0.1}} className="card p-4">
              <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.l}</div>
              <div className="text-xl font-serif" style={{color:s.c}}>{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex px-4 pt-5 gap-2 mb-4">
        {[{k:'ruta',l:'Ruta del Día',I:Ic.user},{k:'mapa',l:'Mapa',I:Ic.map}].map(t=>(
          <button key={t.k} onClick={()=>setTabActivo(t.k as any)} className="tab"
            style={tabActivo===t.k?{background:'#0EA5E9',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
            <t.I s={15} c={tabActivo===t.k?'#fff':'var(--text-soft)'}/>{t.l}
          </button>
        ))}
      </div>

      {tabActivo==='mapa' && (
        <div className="px-4">
          <div id="premmex-map" style={{height:'calc(100vh - 320px)',width:'100%',borderRadius:'16px',
            background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p className="text-sm" style={{color:'var(--text-soft)'}}>Cargando mapa OSM...</p>
          </div>
        </div>
      )}

      {tabActivo==='ruta' && (
        <div className="px-4">
          <div className="kicker">{loading?'CARGANDO...':`RUTA · ${ruta.length} VISITAS`}</div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="card h-20 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div>
          ) : (
            <div className="space-y-3">
              {ruta.map((c,i)=>{
                const cobrado = cobrados.has(c.contrato_id)||parseInt(c.pagos_este_mes||'0')>0
                return (
                  <motion.div key={c.contrato_id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="card overflow-hidden"
                    style={{borderColor:cobrado?'rgba(22,163,74,0.4)':c.estado==='atrasado'?'rgba(234,88,12,0.35)':'var(--border)'}}>
                    <div className="px-4 py-3 flex items-center justify-between cursor-pointer" onClick={()=>setSelected(selected===i?null:i)}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{background:cobrado?'rgba(22,163,74,0.15)':'var(--brand-soft)',color:cobrado?'#16A34A':'var(--brand)'}}>
                          {cobrado?<Ic.check s={16} c="#16A34A"/>:i+1}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{c.nombre}</div>
                          <div className="text-xs" style={{color:'var(--text-soft)'}}>{c.direccion}, {c.colonia}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold" style={{color:'var(--brand)'}}>${parseFloat(c.monto_mensual).toLocaleString()}</div>
                        {c.estado==='atrasado'&&!cobrado&&<div className="text-xs" style={{color:'#EA580C'}}>Atrasado</div>}
                        {cobrado&&<div className="text-xs" style={{color:'#16A34A'}}>✓ Cobrado</div>}
                      </div>
                    </div>
                    <AnimatePresence>
                      {selected===i&&(
                        <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                          <div className="px-4 pb-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
                            <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Folio: <span style={{color:'var(--text)'}}>{c.folio}</span> · {c.paquete}</div>
                            <div className="text-xs mb-3" style={{color:'var(--text-soft)'}}>Saldo: <span style={{color:'var(--text)'}}>${parseFloat(c.saldo_pendiente).toLocaleString()}</span></div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <a href={`tel:${c.telefono}`} className="qa" style={{background:'rgba(14,165,233,0.1)',color:'#0EA5E9'}}><Ic.phone s={15} c="#0EA5E9"/>Llamar</a>
                              <a href={`https://wa.me/52${c.telefono?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="qa" style={{background:'rgba(22,163,74,0.1)',color:'#16A34A'}}><Ic.chat s={15} c="#16A34A"/>WA</a>
                            </div>
                            {!cobrado&&(
                              <>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <button onClick={()=>cobrar(c,'efectivo')} disabled={pagando} className="qa" style={{background:'var(--brand-soft)',color:'var(--brand)'}}>
                                    <Ic.money s={15} c="var(--brand)"/>{pagando?'...':'Efectivo'}
                                  </button>
                                  <button onClick={()=>cobrar(c,'mercado_pago')} disabled={pagando} className="qa" style={{background:'rgba(106,27,154,0.1)',color:'#7C3AED'}}>
                                    <Ic.shield s={15} c="#7C3AED"/>{pagando?'...':'M.Pago'}
                                  </button>
                                </div>
                                <button onClick={()=>setVisitaModal(c)} className="qa w-full" style={{background:'rgba(234,88,12,0.08)',color:'#EA580C'}}>
                                  <Ic.pin s={15} c="#EA580C"/>Sin cobro · registrar visita
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

      {/* RECIBO */}
      <AnimatePresence>
        {recibo&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{background:'rgba(0,0,0,0.65)'}}>
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="reg-card w-full max-w-xs text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(22,163,74,0.12)'}}>
                <Ic.check s={28} c="#16A34A"/>
              </div>
              <h3 className="text-xl font-serif mb-1">¡Cobro registrado!</h3>
              <p className="text-2xl font-serif mt-2 mb-1" style={{color:'var(--brand)'}}>{recibo.folio}</p>
              <div className="mt-3 mb-4 space-y-1 text-sm" style={{color:'var(--text-soft)'}}>
                <div>Cliente: <span style={{color:'var(--text)'}}>{recibo.nombre}</span></div>
                <div>Contrato: <span style={{color:'var(--text)'}}>{recibo.ncontrato}</span></div>
                <div>Monto: <span style={{color:'#16A34A',fontWeight:600}}>${parseFloat(recibo.monto_mensual).toLocaleString()}</span></div>
                <div>Saldo restante: <span style={{color:'var(--text)'}}>${parseFloat(recibo.nuevoSaldo||0).toLocaleString()}</span></div>
              </div>
              {(() => {
                const texto = `PREMMEX · Recibo ${recibo.folio}\nFecha: ${new Date().toLocaleDateString('es-MX')}\nCliente: ${recibo.nombre}\nContrato: ${recibo.ncontrato||''}\nAportación: $${parseFloat(recibo.monto_mensual).toLocaleString()} (${recibo.metodo})\nSaldo restante: $${parseFloat(recibo.nuevoSaldo||0).toLocaleString()}\n¡Gracias por su preferencia!`
                return (
                  <>
                    <a href={`https://wa.me/52${recibo.telefono?.replace(/\D/g,'')}?text=${encodeURIComponent(texto)}`}
                      target="_blank" rel="noreferrer" className="btn-primary w-full justify-center mb-2" style={{background:'#16A34A'}}>
                      <Ic.chat s={16} c="#fff"/>Enviar por WhatsApp
                    </a>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button onClick={()=>{ navigator.clipboard?.writeText(texto).then(()=>showToast('Recibo copiado')).catch(()=>showToast('No se pudo copiar',false)) }}
                        className="qa" style={{background:'var(--surface-2)',color:'var(--text)'}}>
                        <Ic.doc s={15} c="var(--text)"/>Copiar
                      </button>
                      <a href={`/api/recibo/${recibo.folio}`} target="_blank" rel="noreferrer"
                        className="qa" style={{background:'var(--surface-2)',color:'var(--text)',textDecoration:'none'}}>
                        <Ic.doc s={15} c="var(--text)"/>Imprimir
                      </a>
                    </div>
                  </>
                )
              })()}
              <button onClick={()=>setRecibo(null)} className="btn-outline w-full justify-center">Continuar ruta</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VISITA */}
      <AnimatePresence>
        {visitaModal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-end justify-center" style={{background:'rgba(0,0,0,0.5)'}}>
            <motion.div initial={{y:300}} animate={{y:0}} className="w-full max-w-md"
              style={{background:'var(--surface)',borderRadius:'20px 20px 0 0',padding:'24px'}}>
              <h3 className="text-lg font-serif mb-1">Registrar visita</h3>
              <p className="text-sm mb-4" style={{color:'var(--text-soft)'}}>{visitaModal.nombre}</p>
              <div className="space-y-2 mb-4">
                {[{v:'no_encontrado',l:'No encontrado'},{v:'promesa_pago',l:'Promesa de pago'},{v:'rechazo',l:'Rechazó el cobro'}].map(op=>(
                  <button key={op.v} onClick={()=>setVisitaRslt(op.v as any)} className="w-full text-left px-4 py-3 rounded-xl text-sm"
                    style={{background:visitaRslt===op.v?'#0EA5E9':'var(--surface-2)',color:visitaRslt===op.v?'#fff':'var(--text)',border:'1px solid var(--border)'}}>
                    {op.l}
                  </button>
                ))}
              </div>
              <label className="field mb-4"><span>Nota (opcional)</span>
                <input value={visitaNota} onChange={e=>setVisitaNota(e.target.value)} placeholder="Observaciones..."/></label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setVisitaModal(null)} className="btn-outline">Cancelar</button>
                <button onClick={registrarVisita} className="btn-primary justify-center" style={{background:'#0EA5E9'}}><Ic.check s={16} c="#fff"/>Registrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
