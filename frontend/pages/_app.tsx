import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '@/components/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <Analytics />
    </QueryClientProvider>
  </>
)

export default App
