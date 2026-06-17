'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn } from './shared'

/* ─── LOGIN ─── */
function PassLogin({ onLogin, onBack }: { onLogin:(p:string)=>Promise<void>; onBack?:()=>void }) {
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const attempt = async () => {
    setLoading(true); setErr('')
    try { await onLogin(pass) }
    catch(e:any) { setErr(e.message||'Contraseña incorrecta') }
    setLoading(false)
  }
  return (
    <div style={{minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center',
                 padding:'24px',background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} style={{width:'100%',maxWidth:320}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:20,background:'rgba(124,58,237,0.12)',
                       display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
            <Ic.lock s={32} c="#7C3AED"/>
          </div>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,color:'var(--text)'}}>Panel Admin</div>
          <div style={{fontSize:13,color:'#7C3AED',fontWeight:600,marginTop:4}}>PREMMEX · Acceso restringido</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Contraseña</div>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="••••••••"
              style={{width:'100%',padding:'14px 16px',borderRadius:14,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:15,outline:'none',boxSizing:'border-box'}}/>
          </div>
          {err && <div style={{padding:'11px 14px',borderRadius:12,background:'#fee2e2',color:'#dc2626',fontSize:13,fontWeight:600}}>{err}</div>}
          <button onClick={attempt} disabled={loading||!pass}
            style={{padding:'15px',borderRadius:14,border:'none',cursor:'pointer',
                    background:'#7C3AED',color:'#fff',fontSize:15,fontWeight:700,
                    opacity:(loading||!pass)?.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {loading?'Verificando...':<>Entrar <Ic.arrow s={17} c="#fff"/></>}
          </button>
          <p style={{textAlign:'center',fontSize:12,color:'var(--text-soft)'}}>Demo: premmex2025</p>
          {onBack && (
            <button onClick={onBack} style={{display:'flex',alignItems:'center',justifyContent:'center',
              gap:6,padding:'10px',background:'none',border:'none',cursor:'pointer',
              color:'var(--text-soft)',fontSize:13}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>Volver al inicio
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── NUEVO CONTRATO MODAL ─── */
function NuevoContratoModal({ meta, onSave, onClose, showT }:
  { meta:any; onSave:(f:any)=>Promise<void>; onClose:()=>void; showT:(m:string,ok?:boolean)=>void }) {
  const [form, setForm] = useState({nombre:'',telefono:'',direccion:'',colonia:'',
                                     cobrador_id:'1',paquete_id:'1',beneficiario:'',dia_pago:'5'})
  const [saving, setSaving] = useState(false)
  const F = ({f,l,p,t='text'}:{f:string;l:string;p:string;t?:string}) => (
    <div>
      <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:5}}>{l}</div>
      <input required type={t} value={(form as any)[f]}
        onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={p}
        style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
    </div>
  )
  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { await onSave({...form,cobrador_id:parseInt(form.cobrador_id),paquete_id:parseInt(form.paquete_id),dia_pago:parseInt(form.dia_pago)}) }
    catch(err:any) { showT(err.message||'Error',false) }
    setSaving(false)
  }
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:90,display:'flex',alignItems:'flex-end',
              background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)'}}>
      <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:26,stiffness:300}}
        style={{width:'100%',background:'var(--surface)',borderRadius:'22px 22px 0 0',
                padding:'6px 20px 36px',maxHeight:'92svh',overflowY:'auto'}}>
        <div style={{width:36,height:4,borderRadius:2,background:'var(--border)',margin:'12px auto 20px'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,color:'var(--text)'}}>Nuevo contrato</div>
          <button onClick={onClose} style={{background:'var(--surface-2)',border:'none',borderRadius:999,
            width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <Ic.x s={16} c="var(--text-soft)"/>
          </button>
        </div>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <F f="nombre" l="Nombre del titular" p="María González Pérez"/>
          <F f="telefono" l="Teléfono / WhatsApp" p="998 200 0000" t="tel"/>
          <F f="direccion" l="Dirección" p="Av. Tulum 123"/>
          <F f="colonia" l="Colonia" p="Centro"/>
          <F f="beneficiario" l="Beneficiario" p="Juan González"/>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:5}}>Paquete</div>
            <select value={form.paquete_id} onChange={e=>setForm({...form,paquete_id:e.target.value})}
              style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none'}}>
              {meta.paquetes?.map((p:any)=><option key={p.id} value={p.id}>{p.nombre} — ${parseFloat(p.precio).toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:5}}>Cobrador asignado</div>
            <select value={form.cobrador_id} onChange={e=>setForm({...form,cobrador_id:e.target.value})}
              style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none'}}>
              {meta.cobradores?.map((c:any)=><option key={c.id} value={c.id}>{c.nombre} · Zona {c.zona}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:5}}>Día de cobro</div>
            <input type="number" min="1" max="28" value={form.dia_pago}
              onChange={e=>setForm({...form,dia_pago:e.target.value})}
              style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <button type="submit" disabled={saving}
            style={{padding:'15px',borderRadius:14,border:'none',cursor:'pointer',marginTop:4,
                    background:'linear-gradient(135deg,#7C3AED,#6D28D9)',color:'#fff',
                    fontSize:15,fontWeight:700,opacity:saving?.5:1,
                    display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {saving?'Guardando...':<><Ic.check s={16} c="#fff"/>Crear contrato</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─── DETALLE CONTRATO ─── */
function ContratoDetalle({ contrato, onClose, onCancelar, onReestructurar, showT }:
  { contrato:any; onClose:()=>void; onCancelar:(id:number,motivo:string)=>Promise<void>;
    onReestructurar:(id:number,monto:number,dia:number)=>Promise<void>; showT:(m:string,ok?:boolean)=>void }) {
  const [tab, setTab] = useState<'info'|'cancelar'|'reestr'>('info')
  const [motivo, setMotivo] = useState('voluntario')
  const [monto, setMonto] = useState(String(contrato.monto_mensual||''))
  const [dia, setDia] = useState('5')
  const [saving, setSaving] = useState(false)
  const ec = (e:string) => e==='liquidado'?'#16A34A':e==='atrasado'||e==='cancelado'?'#EA580C':'var(--brand)'

  const doCancelar = async () => {
    setSaving(true)
    try { await onCancelar(contrato.id, motivo); onClose() }
    catch(e:any) { showT(e.message||'Error',false) }
    setSaving(false)
  }
  const doReestr = async () => {
    setSaving(true)
    try { await onReestructurar(contrato.id, parseFloat(monto), parseInt(dia)); onClose() }
    catch(e:any) { showT(e.message||'Error',false) }
    setSaving(false)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:90,display:'flex',alignItems:'flex-end',
              background:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)'}}>
      <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:26,stiffness:300}}
        style={{width:'100%',background:'var(--surface)',borderRadius:'22px 22px 0 0',
                padding:'6px 20px 36px',maxHeight:'88svh',overflowY:'auto'}}>
        <div style={{width:36,height:4,borderRadius:2,background:'var(--border)',margin:'12px auto 16px'}}/>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--text)'}}>{contrato.cliente}</div>
            <div style={{fontSize:12,color:'var(--text-soft)',marginTop:2}}>{contrato.folio} · {contrato.paquete}</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div style={{padding:'5px 12px',borderRadius:999,fontSize:11,fontWeight:700,
                          background:`${ec(contrato.estado)}18`,color:ec(contrato.estado)}}>
              {contrato.estado}
            </div>
            <button onClick={onClose} style={{background:'var(--surface-2)',border:'none',borderRadius:999,
              width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
              <Ic.x s={15} c="var(--text-soft)"/>
            </button>
          </div>
        </div>
        {/* Monto cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
          {[{l:'Mensualidad',v:`$${parseFloat(contrato.monto_mensual||0).toLocaleString()}`},
            {l:'Saldo pendiente',v:`$${parseFloat(contrato.saldo_pendiente||0).toLocaleString()}`}].map(({l,v},i)=>(
            <div key={i} style={{background:'var(--surface-2)',borderRadius:14,padding:'12px 14px'}}>
              <div style={{fontSize:11,color:'var(--text-soft)',fontWeight:600,marginBottom:4}}>{l}</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--brand)',fontWeight:500}}>{v}</div>
            </div>
          ))}
        </div>
        {/* Tabs de acción */}
        <div style={{display:'flex',gap:6,marginBottom:16}}>
          {[{k:'info',l:'Información'},{k:'cancelar',l:'Cancelar'},{k:'reestr',l:'Reestructurar'}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k as any)}
              style={{flex:1,padding:'9px 4px',borderRadius:10,border:'1px solid var(--border)',
                      fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .2s',
                      background:tab===t.k?'#7C3AED':'var(--surface-2)',
                      color:tab===t.k?'#fff':'var(--text-soft)'}}>
              {t.l}
            </button>
          ))}
        </div>
        {/* Info */}
        {tab==='info' && (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              {l:'Cobrador',v:contrato.cobrador||'—'},
              {l:'Zona',v:contrato.zona||'—'},
              {l:'Dirección',v:contrato.direccion||'—'},
              {l:'Teléfono',v:contrato.telefono||'—'},
              {l:'Beneficiario',v:contrato.beneficiario||'—'},
              {l:'Día de cobro',v:`Día ${contrato.dia_pago||'—'}`},
              {l:'Total del plan',v:`$${parseFloat(contrato.monto_total||0).toLocaleString()}`},
            ].map(({l,v},i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',
                                    borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:13,color:'var(--text-soft)'}}>{l}</span>
                <span style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{v}</span>
              </div>
            ))}
          </div>
        )}
        {/* Cancelar */}
        {tab==='cancelar' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{padding:'14px',borderRadius:14,background:'rgba(220,38,38,0.06)',
                          border:'1px solid rgba(220,38,38,0.2)'}}>
              <div style={{fontSize:13,color:'#dc2626',fontWeight:600,marginBottom:4}}>⚠️ Esta acción es irreversible</div>
              <div style={{fontSize:12,color:'var(--text-soft)'}}>El contrato quedará cancelado y no podrá reactivarse.</div>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Motivo</div>
              <select value={motivo} onChange={e=>setMotivo(e.target.value)}
                style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                        background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none'}}>
                <option value="voluntario">Decisión voluntaria</option>
                <option value="pago">Falta de pago</option>
                <option value="fallecimiento">Fallecimiento del titular</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>
            <button onClick={doCancelar} disabled={saving}
              style={{padding:'14px',borderRadius:14,border:'none',cursor:'pointer',
                      background:'#dc2626',color:'#fff',fontSize:14,fontWeight:700,
                      opacity:saving?.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {saving?'Cancelando...':<><Ic.cancel s={16} c="#fff"/>Confirmar cancelación</>}
            </button>
          </div>
        )}
        {/* Reestructurar */}
        {tab==='reestr' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Nuevo monto mensual</div>
              <input type="number" value={monto} onChange={e=>setMonto(e.target.value)}
                style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                        background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Nuevo día de pago</div>
              <input type="number" min="1" max="28" value={dia} onChange={e=>setDia(e.target.value)}
                style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                        background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button onClick={doReestr} disabled={saving}
              style={{padding:'14px',borderRadius:14,border:'none',cursor:'pointer',
                      background:'#7C3AED',color:'#fff',fontSize:14,fontWeight:700,
                      opacity:saving?.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {saving?'Guardando...':<><Ic.check s={16} c="#fff"/>Aplicar cambios</>}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── ADMIN APP ─── */
export default function AdminApp({ onBack }: { onBack?: ()=>void }) {
  const [session, setSession] = useState(false)
  const { theme, toggle } = useTheme()
  const [tab, setTab] = useState<'inicio'|'contratos'|'cobradores'|'reportes'>('inicio')
  const [stats, setStats] = useState<any>(null)
  const [contratos, setContratos] = useState<any[]>([])
  const [cobradores, setCobradores] = useState<any[]>([])
  const [reportes, setReportes] = useState<any>(null)
  const [meta, setMeta] = useState<any>({paquetes:[],cobradores:[]})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null)
  const [nuevoModal, setNuevoModal] = useState(false)
  const [selectedContrato, setSelectedContrato] = useState<any>(null)
  const [filtro, setFiltro] = useState('')

  const showT = (msg:string,ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000) }

  const handleLogin = async (pass:string) => {
    const r = await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminPass:pass})})
    const d = await r.json()
    if(!r.ok) throw new Error(d.error||'Contraseña incorrecta')
    setSession(true)
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s,ct,rp,m] = await Promise.all([
        fetch('/api/stats').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
        fetch('/api/admin/reportes').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
      ])
      setStats(s)
      setContratos(ct.contratos_list||ct.contratos||s.contratos_list||[])
      setReportes(rp)
      setCobradores(s.cobradores||[])
      setMeta({paquetes:m.paquetes||[],cobradores:m.cobradores||s.cobradores||[]})
    } catch(e) { console.error(e) }
    setLoading(false)
  },[])

  useEffect(()=>{ if(session) fetchAll() },[session,fetchAll])

  const crearContrato = async (form:any) => {
    const r = await fetch('/api/contratos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const d = await r.json()
    if(!r.ok) throw new Error(d.error||'Error al crear')
    showT(`Contrato ${d.folio} creado ✓`)
    setNuevoModal(false)
    fetchAll()
  }

  const cancelarContrato = async (id:number, motivo:string) => {
    const r = await fetch('/api/admin/cancelar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:id,motivo})})
    if(!r.ok) throw new Error('Error al cancelar')
    showT('Contrato cancelado')
    fetchAll()
  }

  const reestructurar = async (id:number, monto:number, dia:number) => {
    const r = await fetch('/api/admin/reestructurar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:id,nuevo_mensual:monto,dia_pago:dia})})
    if(!r.ok) throw new Error('Error')
    showT('Reestructuración aplicada')
    fetchAll()
  }

  if(!session) return <PassLogin onLogin={handleLogin} onBack={onBack}/>

  const estColor = (e:string) => e==='liquidado'?'#16A34A':e==='atrasado'||e==='cancelado'?'#EA580C':'var(--brand)'
  const contratosFiltrados = contratos.filter(c =>
    !filtro || c.cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.folio?.toLowerCase().includes(filtro.toLowerCase())
  )

  const TABS = [
    {k:'inicio',    l:'Inicio',     I:Ic.chart},
    {k:'contratos', l:'Contratos',  I:Ic.doc},
    {k:'cobradores',l:'Equipo',     I:Ic.team},
    {k:'reportes',  l:'Reportes',   I:Ic.bell},
  ] as const

  return (
    <div style={{minHeight:'100svh',background:'var(--bg)',paddingBottom:88}}>
      {/* BANNER */}
      <div style={{position:'relative',backgroundImage:'var(--img-admin)',backgroundSize:'cover',backgroundPosition:'center'}}>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.75) 100%)'}}/>
        <div style={{position:'relative',zIndex:1,padding:'52px 20px 20px',
                     display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <Mark s={36}/>
            <div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.65)',letterSpacing:'.15em',fontWeight:600}}>ADMINISTRACIÓN</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,color:'#fff',fontWeight:500}}>Panel PREMMEX</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <ThemeBtn theme={theme} toggle={toggle}/>
            <button onClick={()=>setSession(false)}
              style={{background:'rgba(255,255,255,.15)',backdropFilter:'blur(8px)',
                      border:'1px solid rgba(255,255,255,.25)',borderRadius:999,
                      padding:'8px 14px',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{display:'flex',background:'var(--surface)',borderBottom:'1px solid var(--border)',
                   position:'sticky',top:0,zIndex:30}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,
                    padding:'11px 4px',border:'none',cursor:'pointer',transition:'all .2s',
                    background:'transparent',
                    color:tab===t.k?'#7C3AED':'var(--text-soft)',
                    borderBottom:tab===t.k?'2px solid #7C3AED':'2px solid transparent'}}>
            <t.I s={20} c={tab===t.k?'#7C3AED':'var(--text-soft)'}/>
            <span style={{fontSize:10,fontWeight:tab===t.k?700:500}}>{t.l}</span>
          </button>
        ))}
      </div>

      {/* ── INICIO ── */}
      {tab==='inicio' && (
        <div style={{padding:'16px 20px'}}>
          {/* KPIs del día */}
          {loading ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[1,2,3,4].map(i=><div key={i} style={{height:80,borderRadius:16,background:'var(--surface-2)',animation:'pulse 1.5s infinite'}}/>)}
            </div>
          ) : (
            <>
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>
                HOY · {new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
                {[
                  {l:'Contratos activos',v:stats?.contratos||0,c:'var(--brand)',I:Ic.doc},
                  {l:'Cobrado hoy',v:`$${parseFloat(stats?.cobrado_hoy||0).toLocaleString()}`,c:'#16A34A',I:Ic.money},
                  {l:'Cobrado este mes',v:`$${parseFloat(stats?.cobrado_mes||0).toLocaleString()}`,c:'#7C3AED',I:Ic.chart},
                  {l:'Por cobrar',v:`$${parseFloat(stats?.pendientes||0).toLocaleString()}`,c:'#EA580C',I:Ic.bell},
                ].map(({l,v,c,I:Icon},i)=>(
                  <motion.div key={i} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} transition={{delay:i*.06}}
                    style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:'14px',
                            boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                      <div style={{width:32,height:32,borderRadius:10,background:`${c}15`,
                                   display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon s={16} c={c}/>
                      </div>
                    </div>
                    <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:c,fontWeight:500}}>{v}</div>
                    <div style={{fontSize:11,color:'var(--text-soft)',marginTop:3,fontWeight:600}}>{l}</div>
                  </motion.div>
                ))}
              </div>

              {/* Cobros recientes */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>COBROS RECIENTES</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {(stats?.pagos_recientes||[]).slice(0,5).map((p:any,i:number)=>(
                  <motion.div key={i} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.1+i*.05}}
                    style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'12px 14px',background:'var(--surface)',borderRadius:13,
                            border:'1px solid var(--border)'}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{p.cliente}</div>
                      <div style={{fontSize:11,color:'var(--text-soft)',marginTop:1}}>{p.cobrador} · {p.metodo}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'#16A34A'}}>+${parseFloat(p.monto).toLocaleString()}</div>
                      <div style={{fontSize:10,color:'var(--text-soft)'}}>{p.recibo_num}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CONTRATOS ── */}
      {tab==='contratos' && (
        <div style={{padding:'16px 20px'}}>
          {/* Buscador */}
          <div style={{position:'relative',marginBottom:14}}>
            <input value={filtro} onChange={e=>setFiltro(e.target.value)}
              placeholder="Buscar cliente o folio..."
              style={{width:'100%',padding:'11px 14px 11px 38px',borderRadius:12,
                      border:'1.5px solid var(--border)',background:'var(--surface-2)',
                      color:'var(--text)',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            <div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}>
              <Ic.search s={16} c="var(--text-soft)"/>
            </div>
          </div>
          <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>
            {contratosFiltrados.length} CONTRATOS
          </div>
          {loading ? (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[1,2,3,4,5].map(i=><div key={i} style={{height:72,borderRadius:14,background:'var(--surface-2)',animation:'pulse 1.5s infinite'}}/>)}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {contratosFiltrados.map((c:any,i:number)=>(
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.03}}
                  onClick={()=>setSelectedContrato(c)}
                  style={{padding:'13px 15px',background:'var(--surface)',border:'1px solid var(--border)',
                          borderLeft:`3px solid ${estColor(c.estado)}`,
                          borderRadius:14,cursor:'pointer'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>{c.cliente}</div>
                      <div style={{fontSize:11,color:'var(--text-soft)',marginTop:2}}>{c.folio} · {c.paquete}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--brand)'}}>
                        ${parseFloat(c.monto_mensual||0).toLocaleString()}/mes
                      </div>
                      <div style={{fontSize:11,padding:'2px 8px',borderRadius:999,marginTop:4,display:'inline-block',
                                    background:`${estColor(c.estado)}15`,color:estColor(c.estado),fontWeight:600}}>
                        {c.estado}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── COBRADORES ── */}
      {tab==='cobradores' && (
        <div style={{padding:'16px 20px'}}>
          <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:14}}>
            RENDIMIENTO HOY
          </div>
          {loading ? (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[1,2,3,4].map(i=><div key={i} style={{height:90,borderRadius:16,background:'var(--surface-2)',animation:'pulse 1.5s infinite'}}/>)}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {(stats?.cobradores||[]).map((c:any,i:number)=>{
                const pct = Math.min(100, Math.round((parseFloat(c.cobrado_mes||0)/20000)*100))
                return (
                  <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*.08}}
                    style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:16,padding:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:'var(--text)'}}>{c.nombre}</div>
                        <div style={{fontSize:12,color:'var(--text-soft)',marginTop:2}}>Zona {c.zona} · {c.contratos_asignados} contratos</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'var(--brand)',fontWeight:500}}>
                          ${parseFloat(c.cobrado_mes||0).toLocaleString()}
                        </div>
                        <div style={{fontSize:11,color:'var(--text-soft)'}}>{pct}% del mes</div>
                      </div>
                    </div>
                    <div style={{height:6,borderRadius:999,background:'var(--surface-2)',overflow:'hidden'}}>
                      <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                        transition={{delay:.3+i*.1,duration:.9}}
                        style={{height:'100%',borderRadius:999,
                                background:pct>=80?'#16A34A':pct>=50?'var(--brand)':'#EA580C'}}/>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:12}}>
                      <a href={`tel:${c.telefono}`}
                        style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',
                                borderRadius:10,background:'rgba(14,165,233,0.1)',color:'#0EA5E9',
                                textDecoration:'none',fontSize:12,fontWeight:700}}>
                        <Ic.phone s={14} c="#0EA5E9"/>Llamar
                      </a>
                      <a href={`https://wa.me/52${c.telefono?.replace(/\D/g,'')}`}
                        target="_blank" rel="noreferrer"
                        style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',
                                borderRadius:10,background:'rgba(22,163,74,0.1)',color:'#16A34A',
                                textDecoration:'none',fontSize:12,fontWeight:700}}>
                        <Ic.chat s={14} c="#16A34A"/>WhatsApp
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── REPORTES ── */}
      {tab==='reportes' && (
        <div style={{padding:'16px 20px'}}>
          {reportes && (
            <>
              {/* Comparativo meses */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
                <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'14px'}}>
                  <div style={{fontSize:11,color:'var(--text-soft)',fontWeight:600,marginBottom:6}}>MES ACTUAL</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,color:'#16A34A',fontWeight:500}}>
                    ${parseFloat(reportes.mes_actual||0).toLocaleString()}
                  </div>
                </div>
                <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'14px'}}>
                  <div style={{fontSize:11,color:'var(--text-soft)',fontWeight:600,marginBottom:6}}>MES ANTERIOR</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:26,color:'var(--text-soft)',fontWeight:500}}>
                    ${parseFloat(reportes.mes_anterior||0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Eficiencia cobradores */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>EFICIENCIA POR COBRADOR</div>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
                {(reportes.por_cobrador||[]).map((c:any,i:number)=>{
                  const pct = Math.min(100, Math.round((parseFloat(c.cobrado_mes||0)/20000)*100))
                  return (
                    <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:13,padding:'13px 14px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{c.nombre}</div>
                          <div style={{fontSize:11,color:'var(--text-soft)'}}>Zona {c.zona}</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontWeight:700,color:'var(--brand)'}}>${parseFloat(c.cobrado_mes||0).toLocaleString()}</div>
                          <div style={{fontSize:11,color:'var(--text-soft)'}}>{pct}%</div>
                        </div>
                      </div>
                      <div style={{height:5,borderRadius:999,background:'var(--surface-2)',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${pct}%`,borderRadius:999,transition:'width 1s',
                                      background:pct>=80?'#16A34A':'var(--brand)'}}/>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Estado de cartera */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>ESTADO DE CARTERA</div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
                {(reportes.cartera||[]).map((c:any,i:number,arr:any[])=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                        padding:'13px 16px',
                                        borderBottom:i<arr.length-1?'1px solid var(--border)':undefined}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:8,height:8,borderRadius:'50%',
                                    background:c.estado==='al_corriente'?'#16A34A':c.estado==='atrasado'?'#EA580C':'var(--text-soft)'}}/>
                      <span style={{fontSize:13,color:'var(--text)',textTransform:'capitalize',fontWeight:500}}>
                        {c.estado?.replace('_',' ')}
                      </span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{c.total} contratos</span>
                      <span style={{fontSize:11,color:'var(--text-soft)',marginLeft:8}}>
                        ${parseFloat(c.saldo||0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contratos en riesgo */}
              {(reportes.riesgo||[]).length>0 && (
                <>
                  <div style={{fontSize:11,letterSpacing:'.18em',color:'#EA580C',fontWeight:600,margin:'20px 0 10px'}}>
                    ⚠️ CONTRATOS EN RIESGO
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {(reportes.riesgo||[]).map((c:any,i:number)=>(
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                            padding:'11px 14px',background:'rgba(234,88,12,0.05)',
                                            border:'1px solid rgba(234,88,12,0.2)',borderRadius:12}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{c.nombre}</div>
                          <div style={{fontSize:11,color:'var(--text-soft)'}}>{c.cobrador} · {c.folio}</div>
                        </div>
                        <div style={{fontSize:13,fontWeight:700,color:'#EA580C'}}>
                          ${parseFloat(c.monto_mensual||0).toLocaleString()}/mes
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* FAB — Nuevo contrato */}
      <motion.button
        initial={{scale:0}} animate={{scale:1}} transition={{delay:.5,type:'spring'}}
        onClick={()=>setNuevoModal(true)}
        style={{position:'fixed',bottom:96,right:20,width:56,height:56,borderRadius:'50%',
                background:'linear-gradient(135deg,#7C3AED,#6D28D9)',color:'#fff',
                border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 8px 24px rgba(124,58,237,0.45)',zIndex:40}}>
        <Ic.plus s={26} c="#fff"/>
      </motion.button>

      {/* MODALES */}
      <AnimatePresence>
        {nuevoModal && (
          <NuevoContratoModal meta={meta} onSave={crearContrato}
            onClose={()=>setNuevoModal(false)} showT={showT}/>
        )}
        {selectedContrato && (
          <ContratoDetalle contrato={selectedContrato}
            onClose={()=>setSelectedContrato(null)}
            onCancelar={cancelarContrato} onReestructurar={reestructurar} showT={showT}/>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} ok={toast.ok}/>}</AnimatePresence>
    </div>
  )
}
