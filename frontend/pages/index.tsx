import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import { useMyAuth } from '@/context/MyAuthContext'
import * as authService from '@/lib/auth.service'
import { GetServerSidePropsContext } from 'next'

const Index = () => {
  const { user } = useMyAuth()
  return (
    <div className="flex flex-col h-full">
      <Header />
      {/* <Dashboard /> */}
      <p>{user ? user.email : 'nothing'}</p>
    </div>
  )
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const { accessToken } = await authService.getRefreshTokenSSR(context)

    return {
      props: {
        accessToken,
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
