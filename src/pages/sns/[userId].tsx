import { useRouter } from 'next/router'
import withHeader from 'hocs/withHeader'
import { css } from '@emotion/react'
import Fab from '@mui/material/Fab'
import CreateIcon from '@mui/icons-material/Create'
import UserInfo from 'components/sns/userInfo'
import SnsPosts from 'components/sns/snsPosts'
import useUser from 'hooks/useUser'
import useMe from 'hooks/useMe'
import addBackendUrlToImageUrl from 'utils/addBackendUrlToImageUrl'

const positionOfSnsPostCreateButton = css`
  position: fixed;
  bottom: 30px;
  right: 30px;
`

const SnsPage = () => {
  const router = useRouter()
  const { userId } = router.query

  const { user: userFromStrapi } = useUser(userId)
  const { me } = useMe()

  if (!userFromStrapi) {
    return null
  }

  const user = {
    id: userFromStrapi.id,
    username: userFromStrapi.username,
    height: userFromStrapi.height,
    weight: userFromStrapi.weight,
    profileImageUrl: addBackendUrlToImageUrl(userFromStrapi.profileImage?.url),
    followers: userFromStrapi.followers,
    followings: userFromStrapi.followings,
  }

  const handleSnsPostCreateButtonClick = () => {
    router.push(`/sns/post/posting`)
  }

  const isMySnsPage = me?.id === user.id

  return (
    <>
      <UserInfo user={user} />
      <SnsPosts userId={user.id} />
      {isMySnsPage && (
        <Fab
          color="primary"
          aria-label="SNS 게시물 등록"
          css={positionOfSnsPostCreateButton}
          onClick={handleSnsPostCreateButtonClick}
        >
          <CreateIcon />
        </Fab>
      )}
    </>
  )
}

export default withHeader(SnsPage)
