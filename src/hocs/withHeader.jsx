import { useEffect, useState } from 'react'
import Header from 'components/layouts/header'

const withHeader = Page => {
  return () => {
    // 임시 코드 (상태 관리 라이브러리 도입 후 지울 것)
    const [isLoggedIn, setIsLoggedIn] = useState()

    useEffect(() => {
      const loginState = !!localStorage.getItem('jwt')
      setIsLoggedIn(loginState)
    }, [])

    const handleLogout = () => setIsLoggedIn(false)

    return (
      <>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Page isLoggedIn={isLoggedIn} />
      </>
    )
  }
}

export default withHeader
