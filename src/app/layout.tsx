import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PREMMEX — Previsión Mutual de México',
  description: 'Plataforma de gestión de contratos funerarios y cobranza en campo',
  manifest: '/manifest.json',
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#0A0A0A" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
