import styled from '@emotion/styled'
import Typography from '@mui/material/Typography'
import UserSearchResultListItem from 'components/search/userSearchResultListItem'
import NoSearchResult from 'components/search/noSearchResult'
import useUsers from 'hooks/useUsers'
import addBackendUrlToImageUrl from 'utils/addBackendUrlToImageUrl'
import createSearchKeywordsArray from 'utils/createSearchKeywordsArray'
import { FashionStyle } from 'types'
import { UserForSearching } from 'types/user'

const StyledUserSearchResultList = styled.ul`
  display: flex;
`

type FilterUserArgs = {
  initialUsers: UserForSearching[]
  searchKeywordRegex: RegExp
}

type FilterUser = (args: FilterUserArgs) => UserForSearching[]

const filterUser: FilterUser = ({ initialUsers, searchKeywordRegex }) => {
  const filteredUsers = initialUsers.filter(user => {
    const username = user.username.toLowerCase().trim()
    const matchedUsername = username.match(searchKeywordRegex)

    const fashionStylesArray = user.fashionStyles
      ? user.fashionStyles.map(
          (fashionStyle: FashionStyle) => fashionStyle.name
        )
      : []
    const fashionStyleString = fashionStylesArray.join(' ')
    const matchedFashionItems = fashionStyleString.match(searchKeywordRegex)

    return matchedUsername || matchedFashionItems
  })

  return filteredUsers
}

type SearchUserArgs = {
  searchKeyword: string
  initialUsers: UserForSearching[]
}

type SearchUser = (args: SearchUserArgs) => UserForSearching[]

const searchUser: SearchUser = ({ searchKeyword, initialUsers }) => {
  const searchKeywords = createSearchKeywordsArray(searchKeyword)
  const searchKeywordRegex = new RegExp(searchKeywords.join('|'), 'gi')
  const filteredUsers = filterUser({ initialUsers, searchKeywordRegex })
  return filteredUsers
}

const UserSearchResult = ({ searchKeyword }) => {
  const { users: usersFromStrapi, isLoading: isUsersLoading } = useUsers()

  if (isUsersLoading) {
    return <p>로딩중...</p>
  }

  const users: UserForSearching[] = usersFromStrapi.map(userFromStrapi => ({
    id: userFromStrapi.id,
    username: userFromStrapi.username,
    gender: userFromStrapi.gender,
    fashionStyles: userFromStrapi.fashionStyles ?? [],
    avatarUrl: addBackendUrlToImageUrl(userFromStrapi.profileImage?.url),
  }))

  const searchedUsers = searchUser({ searchKeyword, initialUsers: users })

  return (
    <section>
      <Typography variant="h4" component="h2">
        유저 검색 결과
      </Typography>
      <StyledUserSearchResultList>
        {searchedUsers.length === 0 ? (
          <NoSearchResult />
        ) : (
          searchedUsers.map(user => (
            <UserSearchResultListItem key={user.id} user={user} />
          ))
        )}
      </StyledUserSearchResultList>
    </section>
  )
}

export default UserSearchResult
