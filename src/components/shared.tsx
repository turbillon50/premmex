'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type IP = { s?: number; c?: string }
export const Ic = {
  user:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  gear:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 0 0-1.7-1l-.3-2.6H10.9l-.3 2.6a7.5 7.5 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 0 0 1.7 1l.3 2.6h3.2l.3-2.6a7.5 7.5 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5Z"/></svg>,
  shield: ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z"/><path d="M8.5 12l2.5 2.5L16 9"/></svg>,
  phone:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h3.5l1.5 5-2 1.5a13 13 0 0 0 5.5 5.5l1.5-2 5 1.5V21a1 1 0 0 1-1.1 1A18 18 0 0 1 4 5.1 1 1 0 0 1 5 3Z"/></svg>,
  chat:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H9l-4 4V5Z"/></svg>,
  money:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v6M18 9v6"/></svg>,
  check:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>,
  sun:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  moon:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"/></svg>,
  doc:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v4h4M9 13h6M9 17h6"/></svg>,
  chart:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7"/></svg>,
  team:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c0-3 2.7-5 6-5s6 2 6 5M15 20c0-2 1-3.5 3-3.5s4 1.5 4 3.5"/></svg>,
  bell:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  undo:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10"/></svg>,
  arrow:  ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  lock:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  plus:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  map:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>,
  x:      ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  pin:    ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  cancel: ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
  edit:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>,
  home:   ({ s=18,c='currentColor' }: IP) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/></svg>,
}

export function Mark({ s=28 }: { s?: number }) {
  return <img src="/images/logo.png" alt="PREMMEX" width={s} height={s}
    style={{ width:s,height:s,borderRadius:'50%',objectFit:'cover',boxShadow:'0 0 0 1px var(--border)',background:'#fff' }} />
}

export function Toast({ msg, ok=true }: { msg: string; ok?: boolean }) {
  return (
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} className="toast"
      style={{ background: ok?'linear-gradient(135deg,var(--brand),var(--brand-2))':'#dc2626' }}>
      {ok ? <Ic.check s={16} c="#fff"/> : <Ic.x s={16} c="#fff"/>} {msg}
    </motion.div>
  )
}

export function useTheme() {
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  useEffect(() => {
    const t = (localStorage.getItem('pmx_theme') as 'light'|'dark') || 'light'
    setTheme(t); document.documentElement.setAttribute('data-theme', t)
  }, [])
  const toggle = () => setTheme(p => {
    const n = p==='light'?'dark':'light'
    document.documentElement.setAttribute('data-theme', n)
    try { localStorage.setItem('pmx_theme', n) } catch {}
    return n
  })
  return { theme, toggle }
}

export function ThemeBtn({ theme, toggle }: { theme: string; toggle: ()=>void }) {
  return (
    <button onClick={toggle} aria-label="Tema" className="theme-btn">
      {theme==='light' ? <Ic.moon s={17}/> : <Ic.sun s={17}/>}
    </button>
  )
}

// PIN Login screen genérico
export function PinLogin({ title, subtitle, onLogin, color='var(--brand)', extra }: {
  title: string; subtitle: string; color?: string;
  onLogin: (pin: string, extra?: string) => Promise<void>; extra?: React.ReactNode
}) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const attempt = async () => {
    setLoading(true); setErr('')
    try { await onLogin(pin) }
    catch(e: any) { setErr(e.message||'Error'); setLoading(false); return }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{background:'var(--bg)'}}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mark s={52}/>
          <h1 className="text-2xl font-serif mt-4 tracking-widest" style={{color:'var(--text)'}}>{title}</h1>
          <p className="text-xs mt-1" style={{color}}>{subtitle}</p>
        </div>
        <div className="reg-card">
          <div className="flex gap-2 justify-center mb-5">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-serif"
                style={{background:'var(--surface-2)',border:`1.5px solid ${pin[i]?color:'var(--border)'}`,color:'var(--text)'}}>
                {pin[i]?'●':''}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1','2','3','4','5','6','7','8','9','','0','←'].map((k,i) => (
              <button key={i} onClick={()=>{
                if(k==='←') setPin(p=>p.slice(0,-1))
                else if(k&&pin.length<4) setPin(p=>p+k)
              }} className="h-12 rounded-xl text-lg font-medium active:scale-95 transition-transform"
                style={{background:k?'var(--surface-2)':'transparent',color:'var(--text)',
                        border:k?'1px solid var(--border)':'none',opacity:k?1:0}}>
                {k}
              </button>
            ))}
          </div>
          {extra}
          {err && <p className="text-xs text-center mb-3" style={{color:'#dc2626'}}>{err}</p>}
          <button onClick={attempt} disabled={loading||pin.length<4}
            className="btn-primary w-full justify-center"
            style={{opacity:(loading||pin.length<4)?0.5:1,background:color}}>
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
