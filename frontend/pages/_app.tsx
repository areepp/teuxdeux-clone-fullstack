import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Analytics />
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </>
)

export default App
