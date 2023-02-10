import { Fragment, ReactNode, useEffect, useState } from 'react'

const ClientOnly = ({ children, ...delegated }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment {...delegated}>{children}</Fragment>
}

export default ClientOnly
