import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import * as authService from '@/lib/auth.service'
import useUserStore, { User } from '@/stores/user'
import { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'

const Index = ({ accessToken }: { accessToken: string }) => {
  const { user, setUser } = useUserStore()
  useEffect(() => {
    setUser(accessToken)
  }, [])
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
    const accessToken = await authService.getRefreshTokenSSR(context)

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
