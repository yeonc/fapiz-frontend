import UserAvatar from '@mui/material/Avatar'
import styled from '@emotion/styled'
import UserProfileText from 'components/sns/userProfileText'
import { BACKEND_URL } from 'constants/constants'

const PostAuthorHeaderWrapper = styled.header`
  display: flex;
`
const PostAuthorHeader = ({ author, popoverMenu }) => (
  <PostAuthorHeaderWrapper>
    <UserAvatar
      alt={author.username}
      src={BACKEND_URL + author.avatarUrl}
      sx={{ width: 50, height: 50, marginRight: 2 }}
    />
    <UserProfileText
      username={author.username}
      height={author.height}
      weight={author.weight}
      usernameTypoVarient="h6"
    />
    {popoverMenu}
  </PostAuthorHeaderWrapper>
)

export default PostAuthorHeader
