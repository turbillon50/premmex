'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Mark } from '@/components/shared'

const CobradorApp = dynamic(() => import('@/components/CobradorApp'), { ssr: false })
const AdminApp    = dynamic(() => import('@/components/AdminApp'),    { ssr: false })
const SocioApp    = dynamic(() => import('@/components/SocioApp'),    { ssr: false })

export default function AccesoPage() {
  const [splash, setSplash] = useState(true)
  const [rol, setRol] = useState<'cobrador'|'admin'|'socio'|null>(null)

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (rol === 'cobrador') return <CobradorApp onBack={() => setRol(null)} />
  if (rol === 'admin')    return <AdminApp    onBack={() => setRol(null)} />
  if (rol === 'socio')    return <SocioApp    onBack={() => setRol(null)} />

  const roles: { k:'socio'|'cobrador'|'admin'; l:string; d:string; primary?:boolean; color?:string }[] = [
    { k:'socio',    l:'Soy Socio',       d:'Consulta tu contrato y saldo', primary:true },
    { k:'cobrador', l:'Soy Cobrador',    d:'Ruta y cobranza de campo', color:'#0EA5E9' },
    { k:'admin',    l:'Administración',  d:'Panel de gestión', color:'#7C3AED' },
  ]

  return (
    <>
      <AnimatePresence>
        {splash && (
          <motion.div initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
            style={{ position:'fixed', inset:0, zIndex:50, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
            <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ delay:0.1, duration:0.55 }} style={{ textAlign:'center' }}>
              <div style={{ position:'relative', width:80, height:80, margin:'0 auto 20px' }}>
                <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
                  style={{ position:'absolute', inset:0, borderRadius:'50%',
                    border:'2px solid transparent', borderTopColor:'var(--brand)', borderRightColor:'var(--brand-2)' }}/>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Mark s={44} />
                </div>
              </div>
              <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:36, letterSpacing:'0.28em',
                color:'var(--text)', margin:'0 0 8px' }}>PREMMEX</h1>
              <p style={{ fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--brand)' }}>
                Sistema de Gestión
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!splash && (
        <div style={{ minHeight:'100svh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4 }}
            style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:14 }}>

            <div style={{ textAlign:'center', marginBottom:8 }}>
              <Mark s={52} />
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28,
                letterSpacing:'0.22em', color:'var(--text)', marginTop:12 }}>PREMMEX</div>
              <div style={{ fontSize:12, color:'var(--text-soft)', marginTop:4 }}>
                Previsión · Mutual · de · México
              </div>
            </div>

            {roles.map((r,i) => (
              <motion.button key={r.k} onClick={() => setRol(r.k)}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1+i*0.07 }}
                style={{ width:'100%', padding:'16px 18px', borderRadius:16, cursor:'pointer',
                  fontFamily:'inherit', textAlign:'left', display:'flex', flexDirection:'column', gap:2,
                  border: r.primary ? 'none' : '1.5px solid var(--border)',
                  background: r.primary
                    ? 'linear-gradient(135deg, var(--brand), var(--brand-2))'
                    : 'var(--surface)',
                  color: r.primary ? '#fff' : 'var(--text)',
                  boxShadow: r.primary ? '0 8px 24px rgba(15,118,110,0.25)' : 'none' }}>
                <span style={{ fontSize:15, fontWeight:700 }}>{r.l}</span>
                <span style={{ fontSize:12, opacity: r.primary ? 0.85 : 0.6,
                  color: r.primary ? '#fff' : (r.color || 'var(--text-soft)') }}>{r.d}</span>
              </motion.button>
            ))}

            <a href="/" style={{ textAlign:'center', fontSize:12, color:'var(--text-soft)',
              marginTop:8, textDecoration:'none' }}>
              ← Volver al inicio
            </a>
          </motion.div>
        </div>
      )}
    </>
  )
}
