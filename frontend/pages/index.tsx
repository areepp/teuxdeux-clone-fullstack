import { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'
import { resetServerContext } from 'react-beautiful-dnd'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ErrorBoundary } from 'react-error-boundary'
import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import * as authService from '@/lib/auth.service'
import useUserStore from '@/stores/user'

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: any
  resetErrorBoundary: any
}) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>
      Try again
    </button>
  </div>
)

const Index = ({ accessToken }: { accessToken: string }) => {
  const { setUser } = useUserStore()
  useEffect(() => {
    setUser(accessToken)
  }, [setUser, accessToken])
  return (
    <div className="flex flex-col h-full">
      <Header />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setUser(accessToken)}
      >
        <Dashboard />
      </ErrorBoundary>
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const response = await authService.getRefreshTokenSSR(context)
    resetServerContext()

    return {
      props: {
        accessToken: response.data.accessToken,
      },
    }
  } catch (err: any) {
    context.res.writeHead(302, {
      Location: '/login',
    })
    context.res.end()
    return { props: {} as never }
  }
}

export default Index
