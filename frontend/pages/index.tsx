import Dashboard from '@/components/Dashboard'
import Header from '@/components/Header'
import { useMyAuth } from '@/context/MyAuthContext'
import { withAuthServerSideProps } from '@/lib/withAuthServerSideProps'

const Index = () => {
  const { user } = useMyAuth()
  return (
    <div className="flex flex-col h-full">
      {/* <Header />
    <Dashboard /> */}
      <p>{user ? user.email : 'nothing'}</p>
    </div>
  )
}

export const getServerSideProps = withAuthServerSideProps()

export default Index
