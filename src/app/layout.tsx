import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ShellWrapper } from '@/components/shell/ShellWrapper'
import { getTodayCost } from '@/lib/cron/aggregator'
import { themeScript } from '@/lib/theme-script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ClawBoard',
  description: 'Couche de contrôle visuelle pour OpenClaw',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const costToday = await getTodayCost()

  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ShellWrapper costToday={costToday}>{children}</ShellWrapper>
      </body>
    </html>
  )
}
