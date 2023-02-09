import { Fragment, useEffect, useState } from 'react'

const ClientOnly = ({
  children,
  ...delegated
}: {
  children: React.ReactNode
}) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return <Fragment {...delegated}>{children}</Fragment>
}

export default ClientOnly
