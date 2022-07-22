import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import ROUTE_URL from 'constants/routeUrl'
import { UserForSearching } from 'types/user'

const StyledUserSearchResultListItemWrapper = styled.li`
  margin-right: 30px;

  &:hover {
    background-color: #f1f1f1f5;
  }
`

const avatarStyle = css`
  width: 100px;
  height: 100px;
  margin-bottom: 6px;
`

const usernameAndGenderWrapperStyle = css`
  margin-bottom: 6px;
`

const usernameStyle = css`
  display: inline;
  margin-right: 10px;
`

const fashionStyleTagStyle = css`
  display: inline-block;
  padding: 6px;
  border-radius: 18px;
  font-size: 14px;
  background-color: #6feeff83;
`

type UserSearchResultListItemProps = {
  user: UserForSearching
}

const UserSearchResultListItem = ({ user }: UserSearchResultListItemProps) => (
  <StyledUserSearchResultListItemWrapper>
    <Link href={`${ROUTE_URL.SNS}/${user.id}`}>
      <Avatar src={user.avatarUrl} alt={user.username} css={avatarStyle} />
      <div css={usernameAndGenderWrapperStyle}>
        <h3 css={usernameStyle}>{user.username}</h3>
        <span>{user.gender}</span>
      </div>
      <ul>
        {user.fashionStyles
          ? user.fashionStyles.map(fashionStyle => (
              <li key={fashionStyle.id} css={fashionStyleTagStyle}>
                #{fashionStyle.name}
              </li>
            ))
          : null}
      </ul>
    </Link>
  </StyledUserSearchResultListItemWrapper>
)

export default UserSearchResultListItem
