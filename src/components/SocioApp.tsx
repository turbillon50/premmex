'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn } from './shared'

export default function SocioApp() {
  const [session, setSession] = useState<any>(null)
  const { theme, toggle } = useTheme()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'folio'|'tel'>('tel')
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
      // cargar datos completos
      fetch(`/api/cliente/contratos?cliente_id=${d.socio.cliente_id}`).then(x=>x.json()).then(c=>setData(c))
    } catch { setErr('Error de conexión') }
    setLogging(false)
  }

  const estColor = (e: string) => e==='liquidado'?'#16A34A':e==='atrasado'?'#EA580C':'#059669'

  if (!session) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mark s={52}/>
          <h1 className="text-2xl font-serif mt-4 tracking-widest" style={{color:'var(--text)'}}>Mi Contrato</h1>
          <p className="text-xs mt-1" style={{color:'#059669'}}>Portal del Socio PREMMEX</p>
        </div>
        <div className="reg-card">
          <div className="flex gap-2 mb-5">
            {(['tel','folio'] as const).map(t=>(
              <button key={t} onClick={()=>{setTab(t);setErr('')}} className="tab flex-1"
                style={tab===t?{background:'#059669',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
                {t==='tel'?'Teléfono':'N° Contrato'}
              </button>
            ))}
          </div>
          {tab==='tel' ? (
            <label className="field"><span>Teléfono registrado</span>
              <input type="tel" value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="998 200 0001"/></label>
          ) : (
            <label className="field"><span>Número de contrato</span>
              <input value={folio} onChange={e=>setFolio(e.target.value.toUpperCase())} placeholder="PMX-2024-001"/></label>
          )}
          <label className="field mb-2"><span>PIN (últimos 4 dígitos de tu teléfono)</span>
            <input type="password" maxLength={4} value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()} placeholder="••••"/></label>
          {err&&<p className="text-xs text-center mb-3" style={{color:'#dc2626'}}>{err}</p>}
          <button onClick={login} disabled={logging||pin.length<4} className="btn-primary w-full justify-center"
            style={{opacity:(logging||pin.length<4)?0.5:1,background:'#059669'}}>
            {logging?'Verificando...':'Ver mi contrato'} {!logging&&<Ic.arrow s={16} c="#fff"/>}
          </button>
          <a href="/" className="flex items-center justify-center gap-1.5 mt-3 text-xs" style={{color:'var(--text-soft)'}}>
            <Ic.home s={14} c="var(--text-soft)"/>Volver al inicio
          </a>
        </div>
      </motion.div>
    </div>
  )

  const contratos = data?.contratos || []
  const pagos = data?.pagos || []

  return (
    <div className="min-h-screen pb-20" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-admin)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mark s={26}/>
            <div>
              <div className="kicker !mb-0.5" style={{color:'#fff',opacity:0.85}}>MI PREVISIÓN PREMMEX</div>
              <h1 className="text-xl font-serif" style={{color:'#fff'}}>{session.nombre}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={()=>setSession(null)} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="kicker">MIS CONTRATOS</div>
        {contratos.length===0 ? (
          <div className="card p-6 text-center" style={{color:'var(--text-soft)'}}>No se encontraron contratos activos.</div>
        ) : (
          <div className="space-y-3">
            {contratos.map((c: any,i: number)=>(
              <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="card overflow-hidden">
                <div className="p-4 cursor-pointer" onClick={()=>setExpanded(expanded===i?null:i)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-serif text-lg" style={{color:'var(--brand)'}}>{c.paquete}</div>
                      <div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio}</div>
                    </div>
                    <div className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:`${estColor(c.estado)}18`,color:estColor(c.estado)}}>
                      {c.estado?.replace('_',' ')}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><div className="text-xs" style={{color:'var(--text-soft)'}}>Mensualidad</div><div className="font-medium">${parseFloat(c.monto_mensual).toLocaleString()}</div></div>
                    <div><div className="text-xs" style={{color:'var(--text-soft)'}}>Saldo</div><div className="font-medium">${parseFloat(c.saldo_pendiente).toLocaleString()}</div></div>
                    <div><div className="text-xs" style={{color:'var(--text-soft)'}}>Día pago</div><div className="font-medium">Día {c.dia_pago}</div></div>
                  </div>
                  {parseFloat(c.monto_total)>0&&(
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1" style={{color:'var(--text-soft)'}}>
                        <span>Avance</span>
                        <span>{Math.round(((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{background:'var(--surface-2)'}}>
                        <motion.div initial={{width:0}} animate={{width:`${((parseFloat(c.monto_total)-parseFloat(c.saldo_pendiente))/parseFloat(c.monto_total))*100}%`}}
                          transition={{delay:0.5,duration:1}} className="h-full rounded-full" style={{background:'#059669'}}/>
                      </div>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {expanded===i&&(
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-3" style={{borderTop:'1px solid var(--border)'}}>
                        {c.beneficiario&&<div className="text-sm mb-3"><span style={{color:'var(--text-soft)'}}>Beneficiario: </span><span style={{color:'#059669'}}>{c.beneficiario}</span></div>}
                        <button onClick={()=>showToast('Pago en línea disponible pronto · Llama al 998 717 5692')} className="btn-primary w-full justify-center" style={{background:'#059669'}}>
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

        {pagos.length>0&&(
          <>
            <div className="kicker mt-6">HISTORIAL DE PAGOS</div>
            <div className="space-y-2">
              {pagos.slice(0,8).map((p: any,i: number)=>(
                <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}} className="card px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm">{p.cobrador||'Pago registrado'}</div>
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

        <div className="mt-6 p-4 rounded-2xl" style={{background:'rgba(5,150,105,0.06)',border:'1px solid rgba(5,150,105,0.18)'}}>
          <div className="flex items-center gap-3">
            <Ic.phone s={20} c="#059669"/>
            <div>
              <div className="text-sm font-medium">¿Necesitas ayuda?</div>
              <a href="tel:9987175692" className="text-xs" style={{color:'#059669'}}>998 717 5692 · Lun-Sáb 9am-7pm</a>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
