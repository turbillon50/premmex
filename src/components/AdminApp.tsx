'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ic, Mark, Toast, useTheme, ThemeBtn } from './shared'

/* ── Exportar a CSV ── */
function downloadCSV(filename: string, headers: string[], rows: (string|number)[][]) {
  const esc = (v: any) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
const money = (v: any) => `$${parseFloat(v||0).toLocaleString('es-MX')}`

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

  // Calcular siguiente ncontrato sugerido a partir del último
  const suggestNext = (last: string | null): string => {
    if (!last) return 'PMX-' + new Date().getFullYear() + '-001'
    const m = last.match(/(\d+)$/)
    if (!m) return 'PMX-' + new Date().getFullYear() + '-001'
    const next = parseInt(m[1]) + 1
    return 'PMX-' + new Date().getFullYear() + '-' + String(next).padStart(3, '0')
  }
  const suggestNextNum = (last: string | null): string => {
    if (!last) return ''
    const n = parseInt(last)
    return isNaN(n) ? '' : String(n + 1)
  }

  const [form, setForm] = useState({
    nombre: '', telefono: '', domicilio: '', colonia: '',
    municipio: 'Capilla de Guadalupe', estado_civil: '', ocupacion: '',
    cobrador_id: meta.cobradores?.[0]?.id || '',
    plan_id: meta.planes?.[0]?.id || '',
    beneficiario: '', dia_pago: '5',
    ncontrato: suggestNext(meta.lastContrato),
    solicitud: suggestNextNum(meta.lastSolicitud),
    inversion_total: '',
    inversion_inicial: '0',
    bonificacion: '0',
    num_cuotas: '10',
    tipo_aportacion: 'mensual',
    lat: '', lng: '',
  })
  const [geoLoading, setGeoLoading] = useState(false)

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) { showT('Geolocalización no disponible', false); return }
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }))
        setGeoLoading(false)
        showT('Ubicación capturada ✓')
      },
      () => { setGeoLoading(false); showT('No se pudo obtener la ubicación', false) },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Matematica financiera en vivo (regla 18-jun): saldo = total - (inicial + bonificacion)
  const total  = parseFloat(form.inversion_total)   || 0
  const inv    = parseFloat(form.inversion_inicial) || 0
  const boni   = parseFloat(form.bonificacion)      || 0
  const cuotas = parseInt(form.num_cuotas)          || 0
  const saldo  = Math.max(0, total - inv - boni)
  const cuota  = cuotas > 0 ? saldo / cuotas : 0

  // Validacion de duplicado en tiempo real contra las numeraciones existentes
  const dupNContrato  = !!form.ncontrato && (meta.existentes?.ncontratos || []).some((n: string) => String(n) === String(form.ncontrato).trim())
  const dupSolicitud  = !!form.solicitud && (meta.existentes?.solicitudes || []).some((s: string) => String(s) === String(form.solicitud).trim())

  const upd = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const inp = (styles?: React.CSSProperties) => ({
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid var(--border)', background: 'var(--surface-2)',
    color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const,
    ...styles
  })
  const errInp = { border: '1.5px solid #dc2626' }
  const label = (txt: string) => (
    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-soft)', marginBottom: 5 }}>{txt}</div>
  )
  const errMsg = (k: string) => errors[k]
    ? <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
        {errors[k]}
      </div>
    : null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.nombre.trim()) errs.nombre = 'Requerido'
    if (!form.ncontrato.trim()) errs.ncontrato = 'Requerido'
    if (dupNContrato) errs.ncontrato = 'Ese n° de contrato ya existe'
    if (dupSolicitud) errs.solicitud = 'Esa solicitud ya existe'
    if (!form.inversion_total || parseFloat(form.inversion_total) <= 0) errs.inversion_total = 'Ingresa la inversión total'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try { await onSave({ ...form, plan_id: parseInt(form.plan_id), dia_pago: parseInt(form.dia_pago) }) }
    catch(err: any) {
      const msg = err.message || 'Error'
      if (msg.includes('ncontrato') || msg.includes('contrato')) setErrors(e => ({ ...e, ncontrato: msg }))
      else if (msg.includes('solicitud')) setErrors(e => ({ ...e, solicitud: msg }))
      else showT(msg, false)
    }
    setSaving(false)
  }

  // Secciones del formulario
  const Section = ({ title }: { title: string }) => (
    <div style={{ fontSize: 10, letterSpacing: '.18em', fontWeight: 700,
                  color: 'var(--text-soft)', paddingTop: 8, paddingBottom: 2,
                  borderTop: '1px solid var(--border)', marginTop: 4 }}>{title}</div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'flex-end',
               background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        style={{ width: '100%', background: 'var(--surface)', borderRadius: '22px 22px 0 0',
                 padding: '6px 20px 40px', maxHeight: '94svh', overflowY: 'auto' }}>

        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '12px auto 20px' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 24, color: 'var(--text)' }}>Nuevo contrato</div>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: 'none', borderRadius: 999,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Ic.x s={16} c="var(--text-soft)"/>
          </button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── NÚMEROS DE CONTRATO ── */}
          <Section title="NUMERACIÓN"/>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label(`N° CONTRATO * (último: ${meta.lastContrato || '—'})`)}
              <input value={form.ncontrato} onChange={e => upd('ncontrato', e.target.value)}
                placeholder="PMX-2026-009"
                style={{ ...inp(), ...((errors.ncontrato || dupNContrato) ? errInp : {}) }}/>
              {dupNContrato
                ? <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Ese n° ya existe</div>
                : errMsg('ncontrato')}
            </div>
            <div>
              {label(`SOLICITUD * (último: ${meta.lastSolicitud || '—'})`)}
              <input value={form.solicitud} onChange={e => upd('solicitud', e.target.value)}
                placeholder="930"
                style={{ ...inp(), ...((errors.solicitud || dupSolicitud) ? errInp : {}) }}/>
              {dupSolicitud
                ? <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Esa solicitud ya existe</div>
                : errMsg('solicitud')}
            </div>
          </div>

          {/* ── DATOS DEL TITULAR ── */}
          <Section title="DATOS DEL TITULAR"/>

          <div>
            {label('Nombre completo *')}
            <input value={form.nombre} onChange={e => upd('nombre', e.target.value)}
              placeholder="María González Pérez"
              style={{ ...inp(), ...(errors.nombre ? errInp : {}) }}/>
            {errMsg('nombre')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label('Teléfono / WhatsApp')}
              <input type="tel" value={form.telefono} onChange={e => upd('telefono', e.target.value)}
                placeholder="33 1116 7741" style={inp()}/>
            </div>
            <div>
              {label('Estado civil')}
              <select value={form.estado_civil} onChange={e => upd('estado_civil', e.target.value)} style={inp()}>
                <option value="">— Seleccionar —</option>
                <option>Soltero/a</option><option>Casado/a</option>
                <option>Divorciado/a</option><option>Viudo/a</option><option>Unión libre</option>
              </select>
            </div>
          </div>
          <div>
            {label('Domicilio')}
            <input value={form.domicilio} onChange={e => upd('domicilio', e.target.value)}
              placeholder="Av. Hidalgo 123" style={inp()}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label('Colonia')}
              <input value={form.colonia} onChange={e => upd('colonia', e.target.value)}
                placeholder="Centro" style={inp()}/>
            </div>
            <div>
              {label('Municipio')}
              <input value={form.municipio} onChange={e => upd('municipio', e.target.value)}
                placeholder="Capilla de Guadalupe" style={inp()}/>
            </div>
          </div>
          {/* Ubicación para el mapa */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              {label('Ubicación (mapa)')}
              <button type="button" onClick={usarMiUbicacion} disabled={geoLoading}
                style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:9,cursor:'pointer',
                        border:'1px solid var(--border)',background:'var(--brand-soft)',color:'var(--brand)',
                        fontSize:11,fontWeight:700,opacity:geoLoading?.5:1}}>
                <Ic.pin s={13} c="var(--brand)"/>{geoLoading?'Ubicando...':'Usar mi ubicación'}
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <input value={form.lat} onChange={e => upd('lat', e.target.value)} placeholder="Lat (20.958)" style={inp()}/>
              <input value={form.lng} onChange={e => upd('lng', e.target.value)} placeholder="Lng (-102.472)" style={inp()}/>
            </div>
          </div>
          <div>
            {label('Beneficiario')}
            <input value={form.beneficiario} onChange={e => upd('beneficiario', e.target.value)}
              placeholder="Juan González" style={inp()}/>
          </div>

          {/* ── PLAN Y COBRADOR ── */}
          <Section title="PLAN Y ASIGNACIÓN"/>

          <div>
            {label('Plan')}
            <select value={form.plan_id} onChange={e => upd('plan_id', e.target.value)} style={inp()}>
              {meta.planes?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label('Cobrador asignado')}
              <select value={form.cobrador_id} onChange={e => upd('cobrador_id', e.target.value)} style={inp()}>
                {meta.cobradores?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nombre} · Zona {c.zona}</option>
                ))}
              </select>
            </div>
            <div>
              {label('Día de cobro')}
              <input type="number" min="1" max="28" value={form.dia_pago}
                onChange={e => upd('dia_pago', e.target.value)} style={inp()}/>
            </div>
          </div>

          {/* ── FINANCIERO ── */}
          <Section title="FINANCIERO"/>

          <div>
            {label('Inversión total del plan ($) *')}
            <input type="number" min="0" step="0.01" value={form.inversion_total}
              onChange={e => upd('inversion_total', e.target.value)}
              placeholder="18,000.00"
              style={{ ...inp(), ...(errors.inversion_total ? errInp : {}) }}/>
            {errMsg('inversion_total')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label('Inversión inicial ($)')}
              <input type="number" min="0" step="0.01" value={form.inversion_inicial}
                onChange={e => upd('inversion_inicial', e.target.value)}
                placeholder="0" style={inp()}/>
              <div style={{ fontSize: 10, color: 'var(--text-soft)', marginTop: 3 }}>Puede ser $0</div>
            </div>
            <div>
              {label('Bonificación empresa ($)')}
              <input type="number" min="0" step="0.01" value={form.bonificacion}
                onChange={e => upd('bonificacion', e.target.value)}
                placeholder="0" style={inp()}/>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              {label('Número de aportaciones')}
              <input type="number" min="1" max="120" value={form.num_cuotas}
                onChange={e => upd('num_cuotas', e.target.value)} style={inp()}/>
            </div>
            <div>
              {label('Tipo de aportación')}
              <select value={form.tipo_aportacion} onChange={e => upd('tipo_aportacion', e.target.value)} style={inp()}>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
          </div>

          {/* Resumen calculado en vivo */}
          {total > 0 && (
            <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)',
                          borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', marginBottom: 10, letterSpacing: '.12em' }}>
                RESUMEN FINANCIERO
              </div>
              {[
                { l: 'Inversión total', v: `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` },
                { l: 'Inversión inicial', v: `− $${inv.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` },
                { l: 'Bonificación', v: `− $${boni.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` },
                { l: 'Saldo a cubrir', v: `$${saldo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, bold: true },
                { l: `${cuotas} aportaciones de`, v: `$${cuota.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, bold: true },
              ].map(({ l, v, bold }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                      padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(124,58,237,0.1)' : undefined }}>
                  <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: bold ? 700 : 500, color: bold ? '#7C3AED' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={saving}
            style={{ padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer', marginTop: 6,
                     background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: '#fff',
                     fontSize: 15, fontWeight: 700, opacity: saving ? .5 : 1,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {saving ? 'Guardando...' : <><Ic.check s={16} c="#fff"/>Crear contrato</>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ContratoDetalle({ contrato, onClose, onCancelar, onReestructurar, showT }:
  { contrato:any; onClose:()=>void; onCancelar:(id:string,motivo:string,accion:string)=>Promise<void>;
    onReestructurar:(id:string,monto:number,dia:number)=>Promise<void>; showT:(m:string,ok?:boolean)=>void }) {
  const [tab, setTab] = useState<'info'|'cancelar'|'reestr'>('info')
  const [motivo, setMotivo] = useState('voluntario')
  const [accion, setAccion] = useState<'suspender'|'cancelar'>('cancelar')
  const [monto, setMonto] = useState(String(contrato.monto_mensual||''))
  const [dia, setDia] = useState(String(contrato.dia_pago||'5'))
  const [saving, setSaving] = useState(false)
  const ec = (e:string) => e==='liquidado'?'#16A34A':e==='atrasado'||e==='cancelado'?'#EA580C':e==='suspendido'?'#d97706':'var(--brand)'

  // Preview de deposito a favor (clausula tercera): inicial + aportaciones pagadas
  const tot = parseFloat(contrato.monto_total)||0
  const ini = parseFloat(contrato.inversion_inicial)||0
  const bon = parseFloat(contrato.bonificacion)||0
  const sal = parseFloat(contrato.saldo_pendiente)||0
  const depositoPreview = ini + Math.max(0, (tot - ini - bon) - sal)
  const cancelado = contrato.estado==='cancelado'
  const suspendido = contrato.estado==='suspendido'

  const doCancelar = async () => {
    setSaving(true)
    try { await onCancelar(contrato.id, motivo, accion); onClose() }
    catch(e:any) { showT(e.message||'Error',false) }
    setSaving(false)
  }
  const doReactivar = async () => {
    setSaving(true)
    try { await onCancelar(contrato.id, '', 'reactivar'); onClose() }
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
            <a href={`/api/contratos/${contrato.id}/pdf`} target="_blank" rel="noreferrer"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px',borderRadius:14,
                      textDecoration:'none',background:'linear-gradient(135deg,#7C3AED,#6D28D9)',color:'#fff',
                      fontSize:14,fontWeight:700,marginBottom:4}}>
              <Ic.doc s={16} c="#fff"/>Contrato PDF
            </a>
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
        {/* Cancelar / Suspender / Reactivar */}
        {tab==='cancelar' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {(cancelado||suspendido) ? (
              <>
                <div style={{padding:'14px',borderRadius:14,background:`${ec(contrato.estado)}10`,
                              border:`1px solid ${ec(contrato.estado)}33`}}>
                  <div style={{fontSize:13,color:ec(contrato.estado),fontWeight:700,marginBottom:4,textTransform:'capitalize'}}>
                    Contrato {contrato.estado}
                  </div>
                  {contrato.motivo_cancelacion && <div style={{fontSize:12,color:'var(--text-soft)'}}>Motivo: {contrato.motivo_cancelacion}</div>}
                  {cancelado && parseFloat(contrato.deposito_favor||0)>0 && (
                    <div style={{fontSize:13,color:'var(--text)',marginTop:8,fontWeight:600}}>
                      Depósito a favor del titular: <span style={{color:'#16A34A'}}>${parseFloat(contrato.deposito_favor).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <button onClick={doReactivar} disabled={saving}
                  style={{padding:'14px',borderRadius:14,border:'none',cursor:'pointer',
                          background:'var(--brand)',color:'#fff',fontSize:14,fontWeight:700,
                          opacity:saving?.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  {saving?'Reactivando...':<><Ic.undo s={16} c="#fff"/>Reactivar contrato</>}
                </button>
              </>
            ) : (
              <>
                <div style={{display:'flex',gap:6}}>
                  {[{k:'suspender',l:'Suspender'},{k:'cancelar',l:'Cancelar'}].map(a=>(
                    <button key={a.k} onClick={()=>setAccion(a.k as any)}
                      style={{flex:1,padding:'10px',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,
                              border:`1px solid ${accion===a.k?(a.k==='cancelar'?'#dc2626':'#d97706'):'var(--border)'}`,
                              background:accion===a.k?(a.k==='cancelar'?'rgba(220,38,38,0.08)':'rgba(217,119,6,0.08)'):'var(--surface-2)',
                              color:accion===a.k?(a.k==='cancelar'?'#dc2626':'#d97706'):'var(--text-soft)'}}>
                      {a.l}
                    </button>
                  ))}
                </div>
                {accion==='suspender' ? (
                  <div style={{padding:'14px',borderRadius:14,background:'rgba(217,119,6,0.06)',border:'1px solid rgba(217,119,6,0.2)'}}>
                    <div style={{fontSize:13,color:'#d97706',fontWeight:600,marginBottom:4}}>Suspensión temporal</div>
                    <div style={{fontSize:12,color:'var(--text-soft)'}}>Hasta 3 meses consecutivos o 6 acumulados (cláusula tercera). Se puede reactivar.</div>
                  </div>
                ) : (
                  <div style={{padding:'14px',borderRadius:14,background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)'}}>
                    <div style={{fontSize:13,color:'#dc2626',fontWeight:600,marginBottom:4}}>Cancelación de contrato</div>
                    <div style={{fontSize:12,color:'var(--text-soft)',marginBottom:8}}>Lo invertido queda como depósito a favor del titular (cláusula tercera).</div>
                    <div style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>
                      Depósito a favor estimado: <span style={{color:'#16A34A'}}>${depositoPreview.toLocaleString('es-MX',{minimumFractionDigits:2})}</span>
                    </div>
                  </div>
                )}
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text-soft)',marginBottom:6}}>Motivo</div>
                  <select value={motivo} onChange={e=>setMotivo(e.target.value)}
                    style={{width:'100%',padding:'12px 14px',borderRadius:12,border:'1.5px solid var(--border)',
                            background:'var(--surface-2)',color:'var(--text)',fontSize:14,outline:'none'}}>
                    <option value="voluntario">Decisión voluntaria</option>
                    <option value="pago">Falta de pago</option>
                    <option value="causa mayor">Causa mayor</option>
                    <option value="fallecimiento">Fallecimiento del titular</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </div>
                <button onClick={doCancelar} disabled={saving}
                  style={{padding:'14px',borderRadius:14,border:'none',cursor:'pointer',
                          background:accion==='cancelar'?'#dc2626':'#d97706',color:'#fff',fontSize:14,fontWeight:700,
                          opacity:saving?.5:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  {saving?'Guardando...':<><Ic.cancel s={16} c="#fff"/>{accion==='cancelar'?'Confirmar cancelación':'Suspender contrato'}</>}
                </button>
              </>
            )}
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
  const [tab, setTab] = useState<'inicio'|'contratos'|'cobradores'|'reportes'|'leads'|'mapa'>('inicio')
  const [mapaClientes, setMapaClientes] = useState<any[]>([])
  const [mapFiltroCobrador, setMapFiltroCobrador] = useState('')
  const [mapFiltroEstado, setMapFiltroEstado] = useState<'todos'|'al_corriente'|'atrasado'>('todos')
  const mapInstance = useRef<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [contratos, setContratos] = useState<any[]>([])
  const [cobradores, setCobradores] = useState<any[]>([])
  const [reportes, setReportes] = useState<any>(null)
  const [leads, setLeads] = useState<any[]>([])
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
      const [s,ct,rp,m,ld,mp] = await Promise.all([
        fetch('/api/stats').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
        fetch('/api/admin/reportes').then(x=>x.json()),
        fetch('/api/contratos').then(x=>x.json()),
        fetch('/api/leads').then(x=>x.json()).catch(()=>({leads:[]})),
        fetch('/api/admin/mapa').then(x=>x.json()).catch(()=>({clientes:[]})),
      ])
      setStats(s)
      setContratos(ct.contratos_list||ct.contratos||s.contratos_list||[])
      setReportes(rp)
      setCobradores(s.cobradores||[])
      setLeads(ld.leads||[])
      setMapaClientes(mp.clientes||[])
      setMeta({planes:m.planes||[],paquetes:m.planes||[],cobradores:m.cobradores||s.cobradores||[],lastContrato:m.lastContrato||null,lastSolicitud:m.lastSolicitud||null})
    } catch(e) { console.error(e) }
    setLoading(false)
  },[])

  useEffect(()=>{ if(session) fetchAll() },[session,fetchAll])

  // ── Mapa general (Leaflet + OSM) ──
  useEffect(() => {
    if (tab!=='mapa' || typeof window==='undefined') return
    let cancelled = false
    const t = setTimeout(() => {
      const el = document.getElementById('admin-map')
      if (!el) return
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id='leaflet-css'; link.rel='stylesheet'
        link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      import('leaflet').then((L) => {
        if (cancelled) return
        const leaflet:any = L.default || L
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })
        if (mapInstance.current) { try { mapInstance.current.remove() } catch{} mapInstance.current=null }
        const filtered = mapaClientes.filter((c:any)=>{
          if (mapFiltroCobrador && String(c.cobrador_id)!==String(mapFiltroCobrador)) return false
          if (mapFiltroEstado==='atrasado' && !c.atrasado) return false
          if (mapFiltroEstado==='al_corriente' && c.atrasado) return false
          return c.lat && c.lng
        })
        const center = filtered.length ? [parseFloat(filtered[0].lat), parseFloat(filtered[0].lng)] : [20.9585,-102.4720]
        const map = leaflet.map('admin-map').setView(center,13)
        mapInstance.current = map
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OSM',maxZoom:19}).addTo(map)
        const bounds:any[] = []
        filtered.forEach((c:any)=>{
          const color = c.atrasado ? '#EA580C' : '#16A34A'
          const icon = leaflet.divIcon({
            html:`<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid #fff"></div>`,
            iconSize:[30,30],iconAnchor:[15,28],className:''
          })
          leaflet.marker([parseFloat(c.lat),parseFloat(c.lng)],{icon}).addTo(map)
            .bindPopup(`<div style="min-width:150px"><b style="font-size:14px">${c.nombre}</b><br><span style="color:#666;font-size:12px">${c.direccion||''}, ${c.colonia||''}</span><div style="margin-top:5px;font-size:12px">Cobrador: <b>${c.cobrador_nombre||'—'}</b></div><div style="font-size:12px">Saldo: <b>$${parseFloat(c.saldo||0).toLocaleString()}</b></div><div style="font-size:12px;color:${color};font-weight:700">${c.atrasado?'Atrasado':'Al corriente'}</div></div>`)
          bounds.push([parseFloat(c.lat),parseFloat(c.lng)])
        })
        if (bounds.length>1) { try { map.fitBounds(bounds,{padding:[40,40]}) } catch{} }
      }).catch(()=>{})
    },300)
    return () => { cancelled=true; clearTimeout(t); if(mapInstance.current){ try{mapInstance.current.remove()}catch{}; mapInstance.current=null } }
  }, [tab, mapaClientes, mapFiltroCobrador, mapFiltroEstado])

  const crearContrato = async (form:any) => {
    const r = await fetch('/api/contratos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const d = await r.json()
    if(!r.ok) throw new Error(d.error||'Error al crear')
    showT(`Contrato ${d.ncontrato || d.folio} creado ✓`)
    setNuevoModal(false)
    fetchAll()
  }

  const cancelarContrato = async (id:string, motivo:string, accion:string='cancelar') => {
    const r = await fetch('/api/admin/cancelar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:id,motivo,accion})})
    const d = await r.json().catch(()=>({}))
    if(!r.ok) throw new Error(d.error||'Error al procesar')
    if(accion==='cancelar') showT(`Contrato cancelado · depósito a favor $${parseFloat(d.deposito_favor||0).toLocaleString()}`)
    else if(accion==='suspender') showT('Contrato suspendido')
    else showT('Contrato reactivado')
    fetchAll()
  }

  const reestructurar = async (id:string, monto:number, dia:number) => {
    const r = await fetch('/api/admin/reestructurar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contrato_id:id,nuevo_mensual:monto,dia_pago:dia})})
    if(!r.ok) throw new Error('Error')
    showT('Reestructuración aplicada')
    fetchAll()
  }

  const cambiarEstadoLead = async (id:string, estado:string) => {
    setLeads(ls => ls.map(l => l.id===id ? {...l, estado} : l))
    try {
      await fetch('/api/leads',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,estado})})
    } catch { showT('Error al actualizar',false) }
  }

  if(!session) return <PassLogin onLogin={handleLogin} onBack={onBack}/>

  const estColor = (e:string) => e==='liquidado'?'#16A34A':e==='atrasado'||e==='cancelado'?'#EA580C':e==='suspendido'?'#d97706':'var(--brand)'
  const contratosFiltrados = contratos.filter(c =>
    !filtro || c.cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.folio?.toLowerCase().includes(filtro.toLowerCase())
  )

  const nuevosLeads = leads.filter(l=>l.estado==='nuevo').length
  const TABS = [
    {k:'inicio',    l:'Inicio',     I:Ic.chart},
    {k:'contratos', l:'Contratos',  I:Ic.doc},
    {k:'leads',     l:'Leads',      I:Ic.chat},
    {k:'mapa',      l:'Mapa',       I:Ic.map},
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
            style={{flex:1,position:'relative',display:'flex',flexDirection:'column',alignItems:'center',gap:3,
                    padding:'11px 4px',border:'none',cursor:'pointer',transition:'all .2s',
                    background:'transparent',
                    color:tab===t.k?'#7C3AED':'var(--text-soft)',
                    borderBottom:tab===t.k?'2px solid #7C3AED':'2px solid transparent'}}>
            <div style={{position:'relative'}}>
              <t.I s={20} c={tab===t.k?'#7C3AED':'var(--text-soft)'}/>
              {t.k==='leads' && nuevosLeads>0 && (
                <span style={{position:'absolute',top:-6,right:-10,minWidth:16,height:16,padding:'0 4px',
                  borderRadius:999,background:'#EA580C',color:'#fff',fontSize:9,fontWeight:700,
                  display:'flex',alignItems:'center',justifyContent:'center'}}>{nuevosLeads}</span>
              )}
            </div>
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

      {/* ── MAPA GENERAL ── */}
      {tab==='mapa' && (
        <div style={{padding:'16px 20px'}}>
          <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
            <select value={mapFiltroCobrador} onChange={e=>setMapFiltroCobrador(e.target.value)}
              style={{flex:1,minWidth:140,padding:'10px 12px',borderRadius:10,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:13,outline:'none'}}>
              <option value="">Todos los cobradores</option>
              {(meta.cobradores||[]).map((c:any)=>(<option key={c.id} value={c.id}>{c.nombre}</option>))}
            </select>
            <select value={mapFiltroEstado} onChange={e=>setMapFiltroEstado(e.target.value as any)}
              style={{flex:1,minWidth:120,padding:'10px 12px',borderRadius:10,border:'1.5px solid var(--border)',
                      background:'var(--surface-2)',color:'var(--text)',fontSize:13,outline:'none'}}>
              <option value="todos">Todos</option>
              <option value="al_corriente">Al corriente</option>
              <option value="atrasado">Atrasados</option>
            </select>
          </div>
          <div style={{display:'flex',gap:14,marginBottom:12,fontSize:11,color:'var(--text-soft)'}}>
            <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:10,height:10,borderRadius:'50%',background:'#16A34A'}}/>Al corriente</span>
            <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:10,height:10,borderRadius:'50%',background:'#EA580C'}}/>Atrasado</span>
            <span style={{marginLeft:'auto'}}>{mapaClientes.length} clientes geolocalizados</span>
          </div>
          <div id="admin-map" style={{height:'calc(100vh - 280px)',minHeight:340,width:'100%',borderRadius:16,
            overflow:'hidden',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:13,color:'var(--text-soft)'}}>Cargando mapa OSM...</p>
          </div>
        </div>
      )}

      {/* ── LEADS ── */}
      {tab==='leads' && (
        <div style={{padding:'16px 20px'}}>
          <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:12}}>
            SOLICITUDES DE INFORMES · {leads.length}
          </div>
          {leads.length===0 ? (
            <div style={{padding:'32px',textAlign:'center',color:'var(--text-soft)',background:'var(--surface)',
                         borderRadius:16,border:'1px solid var(--border)',fontSize:14}}>
              Aún no hay solicitudes. Los leads de la landing aparecerán aquí.
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {leads.map((l:any,i:number)=>{
                const estColores:Record<string,string> = {nuevo:'#EA580C',contactado:'#0EA5E9',convertido:'#16A34A',descartado:'var(--text-soft)'}
                const ec = estColores[l.estado]||'var(--text-soft)'
                const tel = (l.telefono||'').replace(/\D/g,'')
                return (
                  <motion.div key={l.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*.03}}
                    style={{padding:'14px 15px',background:'var(--surface)',border:'1px solid var(--border)',
                            borderLeft:`3px solid ${ec}`,borderRadius:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:'var(--text)'}}>{l.nombre}</div>
                        <div style={{fontSize:11,color:'var(--text-soft)',marginTop:2}}>
                          {l.domicilio||'—'} · {new Date(l.created_at).toLocaleDateString('es-MX',{day:'numeric',month:'short'})}
                        </div>
                      </div>
                      <div style={{fontSize:10,padding:'3px 9px',borderRadius:999,fontWeight:700,
                                    background:`${ec}18`,color:ec,textTransform:'capitalize'}}>{l.estado}</div>
                    </div>
                    {l.mensaje && <div style={{fontSize:12,color:'var(--text-soft)',marginBottom:10,fontStyle:'italic'}}>“{l.mensaje}”</div>}
                    {tel && (
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
                        <a href={`tel:${tel}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                          padding:'8px',borderRadius:10,background:'rgba(14,165,233,0.1)',color:'#0EA5E9',
                          textDecoration:'none',fontSize:12,fontWeight:700}}>
                          <Ic.phone s={14} c="#0EA5E9"/>{l.telefono}
                        </a>
                        <a href={`https://wa.me/52${tel}`} target="_blank" rel="noreferrer"
                          style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,
                          padding:'8px',borderRadius:10,background:'rgba(22,163,74,0.1)',color:'#16A34A',
                          textDecoration:'none',fontSize:12,fontWeight:700}}>
                          <Ic.chat s={14} c="#16A34A"/>WhatsApp
                        </a>
                      </div>
                    )}
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {['nuevo','contactado','convertido','descartado'].map(es=>(
                        <button key={es} onClick={()=>cambiarEstadoLead(l.id,es)}
                          style={{flex:1,minWidth:64,padding:'7px 4px',borderRadius:9,cursor:'pointer',
                            fontSize:11,fontWeight:600,textTransform:'capitalize',transition:'all .2s',
                            border:`1px solid ${l.estado===es?(estColores[es]):'var(--border)'}`,
                            background:l.estado===es?`${estColores[es]}18`:'var(--surface-2)',
                            color:l.estado===es?estColores[es]:'var(--text-soft)'}}>
                          {es}
                        </button>
                      ))}
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
              {/* Resumen de cobranza */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>COBRANZA</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:20}}>
                {[
                  {l:'Hoy',v:reportes.resumen?.cobrado_hoy,c:'#16A34A'},
                  {l:'Semana',v:reportes.resumen?.cobrado_semana,c:'#0EA5E9'},
                  {l:'Mes',v:reportes.resumen?.cobrado_mes,c:'#7C3AED'},
                ].map(({l,v,c},i)=>(
                  <div key={i} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'12px'}}>
                    <div style={{fontSize:10,color:'var(--text-soft)',fontWeight:600,marginBottom:5}}>{l.toUpperCase()}</div>
                    <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,color:c,fontWeight:500}}>{money(v)}</div>
                  </div>
                ))}
              </div>

              {/* Cobranza por cobrador */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600}}>COBRANZA POR COBRADOR</div>
                <button onClick={()=>downloadCSV('cobranza_por_cobrador.csv',
                  ['Cobrador','Zona','Hoy','Semana','Mes','Contratos activos'],
                  (reportes.cobranza_cobrador||[]).map((c:any)=>[c.nombre,c.zona||'',c.hoy,c.semana,c.mes,c.contratos_activos]))}
                  style={{display:'flex',alignItems:'center',gap:5,padding:'6px 11px',borderRadius:9,cursor:'pointer',
                    border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--brand)',fontSize:11,fontWeight:700}}>
                  <Ic.doc s={13} c="var(--brand)"/>CSV
                </button>
              </div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden',marginBottom:20}}>
                <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr',padding:'10px 14px',
                              background:'var(--surface-2)',fontSize:10,fontWeight:700,color:'var(--text-soft)',letterSpacing:'.06em'}}>
                  <span>COBRADOR</span><span style={{textAlign:'right'}}>HOY</span><span style={{textAlign:'right'}}>SEMANA</span><span style={{textAlign:'right'}}>MES</span>
                </div>
                {(reportes.cobranza_cobrador||[]).map((c:any,i:number)=>(
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr',padding:'12px 14px',
                                        borderTop:'1px solid var(--border)',fontSize:12,alignItems:'center'}}>
                    <div><div style={{fontWeight:600,color:'var(--text)'}}>{c.nombre}</div>
                      <div style={{fontSize:10,color:'var(--text-soft)'}}>Zona {c.zona||'—'}</div></div>
                    <span style={{textAlign:'right',color:'var(--text-soft)'}}>{money(c.hoy)}</span>
                    <span style={{textAlign:'right',color:'var(--text-soft)'}}>{money(c.semana)}</span>
                    <span style={{textAlign:'right',fontWeight:700,color:'var(--brand)'}}>{money(c.mes)}</span>
                  </div>
                ))}
              </div>

              {/* Proyeccion de ingresos */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>PROYECCIÓN POR APORTACIONES PACTADAS</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:20}}>
                <div style={{background:'rgba(124,58,237,0.06)',border:'1px solid rgba(124,58,237,0.2)',borderRadius:14,padding:'14px'}}>
                  <div style={{fontSize:10,color:'var(--text-soft)',fontWeight:600,marginBottom:5}}>INGRESO MENSUAL ESPERADO</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,color:'#7C3AED',fontWeight:500}}>{money(reportes.proyeccion?.proyeccion_mensual)}</div>
                </div>
                <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'14px'}}>
                  <div style={{fontSize:10,color:'var(--text-soft)',fontWeight:600,marginBottom:5}}>TOTAL POR COBRAR</div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:24,color:'var(--text)',fontWeight:500}}>{money(reportes.proyeccion?.total_por_cobrar)}</div>
                  <div style={{fontSize:10,color:'var(--text-soft)',marginTop:2}}>{reportes.proyeccion?.contratos_por_cobrar||0} contratos activos</div>
                </div>
              </div>

              {/* Contratos atrasados */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{fontSize:11,letterSpacing:'.18em',color:'#EA580C',fontWeight:600}}>CONTRATOS ATRASADOS</div>
                {(reportes.atrasados||[]).length>0 && (
                  <button onClick={()=>downloadCSV('contratos_atrasados.csv',
                    ['Contrato','Cliente','Cobrador','Dias atraso','Monto vencido','Saldo'],
                    (reportes.atrasados||[]).map((c:any)=>[c.folio,c.cliente,c.cobrador||'',c.dias_atraso,c.monto_vencido,c.saldo_pendiente]))}
                    style={{display:'flex',alignItems:'center',gap:5,padding:'6px 11px',borderRadius:9,cursor:'pointer',
                      border:'1px solid var(--border)',background:'var(--surface-2)',color:'#EA580C',fontSize:11,fontWeight:700}}>
                    <Ic.doc s={13} c="#EA580C"/>CSV
                  </button>
                )}
              </div>
              {(reportes.atrasados||[]).length===0 ? (
                <div style={{padding:'20px',textAlign:'center',color:'var(--text-soft)',fontSize:13,
                              background:'var(--surface)',borderRadius:14,border:'1px solid var(--border)',marginBottom:20}}>
                  Sin contratos atrasados 🎉
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
                  {(reportes.atrasados||[]).map((c:any,i:number)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                          padding:'12px 14px',background:'rgba(234,88,12,0.05)',
                                          border:'1px solid rgba(234,88,12,0.2)',borderRadius:12}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{c.cliente}</div>
                        <div style={{fontSize:11,color:'var(--text-soft)'}}>{c.folio} · {c.cobrador||'—'}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:13,fontWeight:700,color:'#EA580C'}}>{c.dias_atraso} días</div>
                        <div style={{fontSize:11,color:'var(--text-soft)'}}>vencido {money(c.monto_vencido)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Estado de cartera */}
              <div style={{fontSize:11,letterSpacing:'.18em',color:'var(--text-soft)',fontWeight:600,marginBottom:10}}>ESTADO DE CARTERA</div>
              <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden'}}>
                {(reportes.cartera||[]).map((c:any,i:number,arr:any[])=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                        padding:'13px 16px',
                                        borderBottom:i<arr.length-1?'1px solid var(--border)':undefined}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:8,height:8,borderRadius:'50%',
                                    background:c.estado==='al_corriente'||c.estado==='liquidado'?'#16A34A':c.estado==='atrasado'?'#EA580C':'var(--text-soft)'}}/>
                      <span style={{fontSize:13,color:'var(--text)',textTransform:'capitalize',fontWeight:500}}>
                        {c.estado?.replace('_',' ')}
                      </span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>{c.total} contratos</span>
                      <span style={{fontSize:11,color:'var(--text-soft)',marginLeft:8}}>{money(c.saldo)}</span>
                    </div>
                  </div>
                ))}
              </div>
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
