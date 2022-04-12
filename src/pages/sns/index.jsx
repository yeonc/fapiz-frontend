import withHeader from 'hocs/withHeader'
import UserInfo from 'components/sns/userInfo'
import SnsPosts from 'components/sns/snsPosts'
import useFetchUser from 'hooks/useFetchUser'

const SnsPageForLoggedInUser = () => {
  const { user, error, loading } = useFetchUser()

  if (loading) {
    return <p>로딩중...</p>
  }

  if (error) {
    return <p>에러가 발생했습니다. 홈으로 돌아가세요</p>
  }

  return (
    <>
      <UserInfo user={user} />
      <SnsPosts userId={user?.id} />
    </>
  )
}

export default withHeader(SnsPageForLoggedInUser)
