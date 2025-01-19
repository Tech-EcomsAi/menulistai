import { AntdRegistry } from '@ant-design/nextjs-registry'
import AntdLayoutWrapper from '@antdComponent/layoutWrapper'
import { authOptions } from '@lib/auth'
import LocalisationProvider from '@providers/localisationProvider'
import NoSSRProvider from '@providers/noSSRProvider'
import { ReduxStoreProvider } from '@providers/reduxProvider'
import SessionProvider from '@providers/sessionProvider'
import "@styles/app.scss"
import type { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { getLocale } from 'next-intl/server'
import { Suspense } from 'react'
import { interFont } from 'src/fonts/inter'
import ServerSidePageLoader from './loading'

export const metadata: Metadata = {
  title: 'Ecoms Ai',
  description: 'The everything app',
  generator: `
  
  ᴾʳᵉˢᵉⁿᵗⁱⁿᵍ ʸᵒᵘ...
        ▀▄▀▄▀▄🄴🄲🄾🄼🅂🄰🄸▀▄▀▄▀▄
    ✳  🎀  𝒯𝒽𝑒 𝑒𝓋𝑒𝓇𝓎𝓉𝒽𝒾𝓃𝑔 𝒶𝓅𝓅  🎀  ✳
    
  `,
  manifest: "/manifest.json",
  keywords: ["Ecommerce", "Artificial Intelligence"],
  // themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#5271FF" }],
  authors: [
    { name: "Dnyaneshwar Garudkar" },
    { name: "Dnyaneshwar Garudkar", url: "https://garudkar.in" },
  ],
  // viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
};

//https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${interFont.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
      </head>
      <body>
        <AntdRegistry>
          {/* <div id="fb-root"></div> */}
          <LocalisationProvider>
            <ReduxStoreProvider>
              <SessionProvider session={session}>
                <NoSSRProvider>
                  <AntdLayoutWrapper>
                    <Suspense fallback={<ServerSidePageLoader page="Main Layout" />}>
                      {children}
                    </Suspense>
                  </AntdLayoutWrapper>
                </NoSSRProvider>
              </SessionProvider>
            </ReduxStoreProvider>
          </LocalisationProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
