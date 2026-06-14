'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn } from './shared'

function PassLogin({ onLogin }: { onLogin: (pass: string)=>Promise<void> }) {
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const attempt = async () => {
    setLoading(true); setErr('')
    try { await onLogin(pass) }
    catch(e: any) { setErr(e.message||'Error'); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mark s={52}/>
          <h1 className="text-2xl font-serif mt-4 tracking-widest" style={{color:'var(--text)'}}>PREMMEX</h1>
          <p className="text-xs mt-1" style={{color:'#7C3AED'}}>Panel administrativo</p>
        </div>
        <div className="reg-card">
          <label className="field mb-5">
            <span>Contraseña de acceso</span>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
              placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&attempt()}/>
          </label>
          {err&&<p className="text-xs text-center mb-3" style={{color:'#dc2626'}}>{err}</p>}
          <button onClick={attempt} disabled={loading||!pass} className="btn-primary w-full justify-center"
            style={{opacity:(loading||!pass)?0.5:1,background:'#7C3AED'}}>
            {loading?'Verificando...':'Entrar'} {!loading&&<Ic.arrow s={16} c="#fff"/>}
          </button>
          <a href="/" className="flex items-center justify-center gap-1.5 mt-3 text-xs" style={{color:'var(--text-soft)'}}>
            <Ic.home s={14} c="var(--text-soft)"/>Volver al inicio
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(false)
  const { theme, toggle } = useTheme()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [reportes, setReportes] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [cancelModal, setCancelModal] = useState<any>(null)
  const [cancelMotivo, setCancelMotivo] = useState('voluntario')
  const [folio, setFolio] = useState('')
  const [contrato, setContrato] = useState<any>(null)
  const [nuevoMensual, setNuevoMensual] = useState('')
  const [nuevoDia, setNuevoDia] = useState('5')
  const [nuevoForm, setNuevoForm] = useState({nombre:'',telefono:'',direccion:'',colonia:'',cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
  const [meta, setMeta] = useState<{paquetes:any[];cobradores:any[]}>({paquetes:[],cobradores:[]})
  const [saving, setSaving] = useState(false)

  const showToast = (msg: string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const handleLogin = async (pass: string) => {
    const r = await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminPass:pass})})
    const d = await r.json()
    if (!r.ok) throw new Error(d.error||'Contraseña incorrecta')
    setSession(true)
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s,c,r,m] = await Promise.all([
        fetch('/api/stats').then(x=>x.json()),
        fetch('/api/admin/clientes').then(x=>x.json()),
        fetch('/api/admin/reportes').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
      ])
      setStats(s); setClientes(c.clientes||[]); setReportes(r); setMeta({paquetes:m.paquetes||[],cobradores:m.cobradores||[]})
    } catch {}
    setLoading(false)
  },[])

  useEffect(()=>{ if(session) fetchAll() },[session,fetchAll])

  const estBadge = (e: string) => e==='liquidado'?{bg:'rgba(22,163,74,0.15)',c:'#16A34A'}:e==='atrasado'||e==='cancelado'?{bg:'rgba(234,88,12,0.15)',c:'#EA580C'}:{bg:'var(--surface-2)',c:'var(--text-soft)'}

  const cancelar = async () => {
    if(!cancelModal) return; setSaving(true)
    try {
      await fetch('/api/admin/cancelar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:cancelModal.id,motivo:cancelMotivo})})
      showToast(`Contrato cancelado`); setCancelModal(null); fetchAll()
    } catch { showToast('Error',false) }
    setSaving(false)
  }

  const buscarContrato = () => {
    const c = (stats?.contratos_list||[]).find((x:any)=>x.folio?.toUpperCase()===folio.toUpperCase())
    if(c) { setContrato(c); setNuevoMensual(String(c.monto_mensual)) }
    else showToast('Contrato no encontrado',false)
  }

  const reestructurar = async () => {
    if(!contrato) return; setSaving(true)
    try {
      await fetch('/api/admin/reestructurar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:contrato.id,nuevo_mensual:parseFloat(nuevoMensual),dia_pago:parseInt(nuevoDia)||5})})
      showToast('Reestructuración aplicada'); setContrato(null); setFolio(''); fetchAll()
    } catch { showToast('Error',false) }
    setSaving(false)
  }

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await fetch('/api/contratos',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...nuevoForm,cobrador_id:parseInt(nuevoForm.cobrador_id),paquete_id:parseInt(nuevoForm.paquete_id),dia_pago:parseInt(nuevoForm.dia_pago)})})
      const d = await r.json()
      if(!r.ok){ showToast(d.error||'Error',false); setSaving(false); return }
      showToast(`Contrato ${d.folio} creado`); setTab('dashboard'); fetchAll()
    } catch { showToast('Error',false) }
    setSaving(false)
  }

  if (!session) return <PassLogin onLogin={handleLogin}/>

  const TABS = [
    {k:'dashboard',l:'Dashboard',I:Ic.chart},
    {k:'contratos',l:'Contratos',I:Ic.doc},
    {k:'clientes',l:'Clientes',I:Ic.team},
    {k:'equipo',l:'Equipo',I:Ic.user},
    {k:'reportes',l:'Reportes',I:Ic.chart},
    {k:'nuevo',l:'+ Nuevo',I:Ic.plus},
    {k:'cancelar',l:'Cancelar',I:Ic.cancel},
    {k:'reestr',l:'Reestructurar',I:Ic.edit},
  ]

  return (
    <div className="min-h-screen pb-28" style={{background:'var(--bg)',color:'var(--text)'}}>
      <div className="app-banner" style={{backgroundImage:'var(--img-admin)'}}>
        <div className="app-banner-veil"/>
        <div className="relative z-10 px-5 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mark s={26}/>
            <div>
              <div className="kicker !mb-0.5" style={{color:'#fff',opacity:0.85}}>PANEL ADMINISTRATIVO</div>
              <h1 className="text-xl font-serif" style={{color:'#fff'}}>PREMMEX · Cancún</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={()=>setSession(false)} className="theme-btn"><Ic.x s={16} c="var(--text-soft)"/></button>
          </div>
        </div>
      </div>

      <div className="flex px-4 pt-5 gap-2 mb-4 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} className="tab whitespace-nowrap"
            style={tab===t.k?{background:'#7C3AED',color:'#fff'}:{background:'var(--surface-2)',color:'var(--text-soft)'}}>
            <t.I s={14} c={tab===t.k?'#fff':'var(--text-soft)'}/>{t.l}
          </button>
        ))}
      </div>

      {tab==='dashboard'&&(
        <div className="px-4">
          {loading?<div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i=><div key={i} className="card h-24 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div>:(
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {l:'Contratos activos',v:stats?.contratos||0,c:'var(--brand)',I:Ic.doc},
                  {l:'Cobrado este mes',v:`$${parseFloat(stats?.cobrado_mes||0).toLocaleString()}`,c:'#16A34A',I:Ic.money},
                  {l:'Por cobrar',v:`$${parseFloat(stats?.pendientes||0).toLocaleString()}`,c:'#EA580C',I:Ic.bell},
                  {l:'Cobrado hoy',v:`$${parseFloat(stats?.cobrado_hoy||0).toLocaleString()}`,c:'#7C3AED',I:Ic.chart},
                ].map((s,i)=>(
                  <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} className="card p-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{background:'var(--brand-soft)'}}><s.I s={18} c={s.c}/></div>
                    <div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>{s.l}</div>
                    <div className="text-xl font-serif" style={{color:s.c}}>{s.v}</div>
                  </motion.div>
                ))}
              </div>
              <div className="kicker">COBROS RECIENTES</div>
              <div className="space-y-2">
                {(stats?.pagos_recientes||[]).map((p:any,i:number)=>(
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

      {tab==='contratos'&&(
        <div className="px-4">
          <div className="kicker">CONTRATOS ACTIVOS</div>
          {loading?<div className="space-y-2">{[1,2,3].map(i=><div key={i} className="card h-16 animate-pulse" style={{background:'var(--surface-2)'}}/>)}</div>:(
            <div className="space-y-3">
              {(stats?.contratos_list||[]).map((c:any,i:number)=>{const b=estBadge(c.estado);return(
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} className="card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div><div className="font-medium text-sm">{c.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio} · {c.paquete}</div></div>
                    <div className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:b.bg,color:b.c}}>{c.estado}</div>
                  </div>
                  <div className="flex justify-between text-sm" style={{color:'var(--text-soft)'}}>
                    <span>Mensual: <span style={{color:'var(--brand)'}}>${parseFloat(c.monto_mensual).toLocaleString()}</span></span>
                    <span>Saldo: <span style={{color:'var(--text)'}}>${parseFloat(c.saldo_pendiente).toLocaleString()}</span></span>
                  </div>
                </motion.div>
              )})}
            </div>
          )}
        </div>
      )}

      {tab==='clientes'&&(
        <div className="px-4">
          <div className="kicker">CLIENTES ({clientes.length})</div>
          <div className="space-y-2">
            {clientes.map((c:any,i:number)=>(
              <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="card px-4 py-3 flex items-center justify-between">
                <div><div className="font-medium text-sm">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.cobrador_nombre||'Sin cobrador'} · Zona {c.zona||'-'}</div></div>
                <div className="text-right"><div className="text-sm" style={{color:'var(--brand)'}}>{c.num_contratos} contrato{c.num_contratos!==1?'s':''}</div><a href={`tel:${c.telefono}`} className="text-xs" style={{color:'var(--text-soft)'}}>{c.telefono}</a></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab==='equipo'&&(
        <div className="px-4">
          <div className="kicker">RENDIMIENTO</div>
          <div className="space-y-4">
            {(stats?.cobradores||[]).map((c:any,i:number)=>{const pct=Math.min(100,Math.round((parseFloat(c.cobrado_mes||0)/20000)*100));return(
              <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}} className="card p-4">
                <div className="flex justify-between mb-3">
                  <div><div className="font-medium">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>Zona {c.zona} · {c.contratos_asignados} contratos</div></div>
                  <div className="text-right"><div className="font-semibold" style={{color:'var(--brand)'}}>${parseFloat(c.cobrado_mes||0).toLocaleString()}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{pct}%</div></div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--surface-2)'}}>
                  <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.3+i*0.1,duration:0.8}} className="h-full rounded-full" style={{background:pct>=90?'#16A34A':pct>=70?'var(--brand)':'#EA580C'}}/>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      )}

      {tab==='reportes'&&(
        <div className="px-4">
          <div className="kicker">REPORTE DE COBRANZA</div>
          {reportes&&(
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="card p-4"><div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Mes actual</div><div className="text-xl font-serif" style={{color:'#16A34A'}}>${parseFloat(reportes.mes_actual||0).toLocaleString()}</div></div>
                <div className="card p-4"><div className="text-xs mb-1" style={{color:'var(--text-soft)'}}>Mes anterior</div><div className="text-xl font-serif" style={{color:'var(--text-soft)'}}>${parseFloat(reportes.mes_anterior||0).toLocaleString()}</div></div>
              </div>
              <div className="kicker">EFICIENCIA COBRADOR</div>
              <div className="space-y-3 mb-4">
                {(reportes.por_cobrador||[]).map((c:any,i:number)=>{const pct=Math.min(100,Math.round((parseFloat(c.cobrado_mes||0)/20000)*100));return(
                  <div key={i} className="card p-4">
                    <div className="flex justify-between mb-2">
                      <div><div className="font-medium text-sm">{c.nombre}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>Zona {c.zona}</div></div>
                      <div className="text-right"><div style={{color:'var(--brand)',fontWeight:600}}>${parseFloat(c.cobrado_mes||0).toLocaleString()}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{pct}%</div></div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{background:'var(--surface-2)'}}>
                      <div className="h-full rounded-full" style={{width:`${pct}%`,background:pct>=80?'#16A34A':'var(--brand)',transition:'width 1s'}}/>
                    </div>
                  </div>
                )})}
              </div>
              <div className="kicker">CARTERA</div>
              <div className="card p-4">
                {(reportes.cartera||[]).map((c:any,i:number)=>(
                  <div key={i} className="flex justify-between py-2" style={{borderBottom:'1px solid var(--border)'}}>
                    <span className="text-sm capitalize" style={{color:'var(--text-soft)'}}>{c.estado?.replace('_',' ')}</span>
                    <div><span className="text-sm font-medium">{c.total}</span><span className="text-xs ml-2" style={{color:'var(--text-soft)'}}>${parseFloat(c.saldo).toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab==='nuevo'&&(
        <div className="px-4">
          <div className="kicker">NUEVO CONTRATO</div>
          <form onSubmit={guardar} className="reg-card">
            {[{f:'nombre',l:'Nombre titular',p:'María González'},{f:'telefono',l:'Teléfono',p:'998 200 0000'},{f:'direccion',l:'Dirección',p:'Av. Tulum 123'},{f:'colonia',l:'Colonia',p:'Centro'},{f:'beneficiario',l:'Beneficiario',p:'Juan González'}].map(({f,l,p})=>(
              <label key={f} className="field"><span>{l}</span><input required value={(nuevoForm as any)[f]} onChange={e=>setNuevoForm({...nuevoForm,[f]:e.target.value})} placeholder={p}/></label>
            ))}
            <label className="field"><span>Paquete</span>
              <select value={nuevoForm.paquete_id} onChange={e=>setNuevoForm({...nuevoForm,paquete_id:e.target.value})}>
                {meta.paquetes.map(p=><option key={p.id} value={p.id}>{p.nombre} — ${parseFloat(p.precio).toLocaleString()}</option>)}
              </select></label>
            <label className="field"><span>Cobrador</span>
              <select value={nuevoForm.cobrador_id} onChange={e=>setNuevoForm({...nuevoForm,cobrador_id:e.target.value})}>
                {meta.cobradores.map(c=><option key={c.id} value={c.id}>{c.nombre} — Zona {c.zona}</option>)}
              </select></label>
            <label className="field"><span>Día de pago</span><input type="number" min="1" max="28" value={nuevoForm.dia_pago} onChange={e=>setNuevoForm({...nuevoForm,dia_pago:e.target.value})}/></label>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2" style={{background:'#7C3AED'}}>
              {saving?'Guardando...':'Crear contrato'} {!saving&&<Ic.arrow s={16} c="#fff"/>}
            </button>
          </form>
        </div>
      )}

      {tab==='cancelar'&&(
        <div className="px-4">
          <div className="kicker">CANCELACIÓN DE CONTRATOS</div>
          <p className="text-xs mb-4" style={{color:'var(--text-soft)'}}>Selecciona un contrato para cancelarlo. Esta acción es irreversible.</p>
          <div className="space-y-2">
            {(stats?.contratos_list||[]).filter((c:any)=>c.estado!=='cancelado'&&c.estado!=='liquidado').map((c:any,i:number)=>(
              <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}} className="card px-4 py-3 flex items-center justify-between">
                <div><div className="text-sm font-medium">{c.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{c.folio} · {c.paquete}</div></div>
                <button onClick={()=>setCancelModal(c)} className="qa" style={{background:'rgba(220,38,38,0.1)',color:'#dc2626',padding:'8px 14px'}}>
                  <Ic.cancel s={15} c="#dc2626"/>Cancelar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab==='reestr'&&(
        <div className="px-4">
          <div className="kicker">REESTRUCTURAR PLAN</div>
          <div className="reg-card">
            <p className="text-xs mb-4" style={{color:'var(--text-soft)'}}>Busca por folio y modifica el monto o día de pago.</p>
            <div className="flex gap-2 mb-4">
              <input value={folio} onChange={e=>setFolio(e.target.value.toUpperCase())} placeholder="PMX-2024-001"
                style={{flex:1,background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'12px',padding:'10px 14px',color:'var(--text)',fontSize:'14px'}}/>
              <button onClick={buscarContrato} className="btn-primary" style={{background:'#7C3AED',padding:'10px 18px'}}>Buscar</button>
            </div>
            {contrato&&(
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                <div className="card p-4 mb-4"><div className="font-medium">{contrato.cliente}</div><div className="text-xs" style={{color:'var(--text-soft)'}}>{contrato.folio} · Mensual actual: ${parseFloat(contrato.monto_mensual).toLocaleString()}</div></div>
                <label className="field"><span>Nuevo monto mensual</span><input type="number" value={nuevoMensual} onChange={e=>setNuevoMensual(e.target.value)} placeholder="2800"/></label>
                <label className="field"><span>Nuevo día de pago</span><input type="number" min="1" max="28" value={nuevoDia} onChange={e=>setNuevoDia(e.target.value)} placeholder="5"/></label>
                <button onClick={reestructurar} disabled={saving} className="btn-primary w-full justify-center mt-2" style={{background:'#7C3AED'}}>
                  {saving?'Guardando...':'Aplicar'} <Ic.check s={16} c="#fff"/>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {cancelModal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center px-5" style={{background:'rgba(0,0,0,0.6)'}}>
            <motion.div initial={{scale:0.85}} animate={{scale:1}} className="reg-card w-full max-w-xs">
              <h3 className="text-lg font-serif mb-1">Cancelar contrato</h3>
              <p className="text-sm mb-4" style={{color:'var(--text-soft)'}}>{cancelModal.cliente} · {cancelModal.folio}</p>
              <label className="field mb-4"><span>Motivo</span>
                <select value={cancelMotivo} onChange={e=>setCancelMotivo(e.target.value)}>
                  <option value="voluntario">Decisión voluntaria</option>
                  <option value="pago">Falta de pago</option>
                  <option value="fallecimiento">Fallecimiento</option>
                  <option value="otro">Otro</option>
                </select></label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>setCancelModal(null)} className="btn-outline">Cancelar</button>
                <button onClick={cancelar} disabled={saving} className="btn-primary justify-center" style={{background:'#dc2626'}}>{saving?'...':'Confirmar'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
