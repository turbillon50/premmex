'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Mark, useTheme } from '@/components/shared'

const CobradorApp = dynamic(() => import('@/components/CobradorApp'), { ssr: false })
const AdminApp    = dynamic(() => import('@/components/AdminApp'),    { ssr: false })

export default function PremmexERP() {
  const [splash, setSplash] = useState(true)
  const [rol, setRol] = useState<'cobrador'|'admin'|null>(null)

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1800)
    return () => clearTimeout(t)
  }, [])

  if (rol === 'cobrador') return <CobradorApp onBack={() => setRol(null)} />
  if (rol === 'admin')    return <AdminApp    onBack={() => setRol(null)} />

  return (
    <>
      {/* SPLASH */}
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

      {/* LOGIN — directo, sin landing */}
      {!splash && (
        <div style={{ minHeight:'100svh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px' }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4 }}
            style={{ width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:16 }}>

            {/* Logo */}
            <div style={{ textAlign:'center', marginBottom:8 }}>
              <Mark s={52} />
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28,
                letterSpacing:'0.22em', color:'var(--text)', marginTop:12 }}>PREMMEX</div>
              <div style={{ fontSize:12, color:'var(--text-soft)', marginTop:4 }}>
                Previsión · Mutual · de · México
              </div>
            </div>

            {/* Botones de acceso */}
            <button onClick={() => setRol('cobrador')}
              style={{ width:'100%', padding:'18px', borderRadius:16, border:'none',
                cursor:'pointer', fontFamily:'inherit', fontSize:15, fontWeight:700,
                background:'linear-gradient(135deg, var(--brand), var(--brand-2))',
                color:'#fff', boxShadow:'0 8px 24px rgba(15,118,110,0.25)' }}>
              Soy Cobrador
            </button>

            <button onClick={() => setRol('admin')}
              style={{ width:'100%', padding:'18px', borderRadius:16,
                border:'1.5px solid var(--border)', cursor:'pointer', fontFamily:'inherit',
                fontSize:15, fontWeight:700, background:'var(--surface)', color:'var(--text)' }}>
              Administración
            </button>

            <div style={{ textAlign:'center', fontSize:11, color:'var(--text-soft)', marginTop:8 }}>
              Acceso restringido · Solo personal autorizado
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
