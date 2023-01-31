import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import { useMyAuth } from '@/context/MyAuthContext'
import { withAuthServerSideProps } from '@/lib/withAuthServerSideProps'
import axios from '@/lib/axios'

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

export const getServerSideProps = async (context: any) => {
  try {
    const { data } = await axios.get('/auth/refresh', {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    })
  } catch (err: any) {}

  return {
    props: {},
  }
}

export default Index
