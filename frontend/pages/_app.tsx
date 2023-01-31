import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '@/components/AuthContext'
import { MyAuthProvider } from '@/context/MyAuthContext'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Analytics />
    </QueryClientProvider>
  </>
)

export default App
