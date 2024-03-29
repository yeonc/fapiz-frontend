import styled from '@emotion/styled'
import SnsPostSearchResultListItem from 'components/search/snsPostSearchResultListItem'
import SnsPostSearchResultListItemSkeleton from 'components/search/snsPostSearchResultListItemSkeleton'
import NoSearchResult from 'components/search/noSearchResult'
import SearchResultHeadingTypo from 'components/search/searchResultHeadingTypo'
import useSnsPosts from 'hooks/useSnsPosts'
import createUrlQuery from 'utils/createUrlQuery'
import { SnsPostResponseAboutSearchResult } from 'types/snsPost'
import { HOVER_BACKGROUND_GRAY } from 'styles/constants/color'
import { Image } from 'types/image'
import { Id, Nullable } from 'types/common'
import { sanitizeSnsPostsForSearching } from 'sanitizer/snsPosts'

export type SnsPostForSearching = {
  id: Id
  createdAt: string
  firstImage: Image
  content: Nullable<string>
  likeNumbers: number
  author: {
    username: string
    avatarUrl?: string
  }
  commentCount: number
}

const SNS_POST_SEARCH_RESULT_START_INDEX = 0
const SNS_POST_SEARCH_RESULT_COUNT_TO_BE_SHOWED = 5

const StyledSnsPostSearchResultListItem = styled(SnsPostSearchResultListItem)`
  padding: 10px 14px;
  margin-bottom: 20px;

  &:hover {
    background-color: ${HOVER_BACKGROUND_GRAY};
  }
`

const StyledSnsPostSearchResultListItemSkeleton = styled(
  SnsPostSearchResultListItemSkeleton
)`
  padding: 10px 14px;
  margin-bottom: 20px;
`

const SnsPostSearchResult = ({ searchKeyword }: { searchKeyword: string }) => {
  const query = createUrlQuery({
    'populate[0]': 'postImages',
    'populate[1]': 'author',
    'populate[2]': 'author.profileImage',
    'populate[3]': 'likeUsers',
    'populate[4]': 'comments',
    'filters[content][$containsi]': searchKeyword,
    sort: 'createdAt:desc',
  })

  const { snsPosts: searchedSnsPostsFromStrapi, isLoading: isSnsPostsLoading } =
    useSnsPosts<SnsPostResponseAboutSearchResult[]>(query)

  const searchedSnsPosts = isSnsPostsLoading
    ? null
    : sanitizeSnsPostsForSearching(searchedSnsPostsFromStrapi || [])

  const searchedSnsPostsToBeShowed = searchedSnsPosts?.slice(
    SNS_POST_SEARCH_RESULT_START_INDEX,
    SNS_POST_SEARCH_RESULT_COUNT_TO_BE_SHOWED
  )

  return (
    <section>
      <SearchResultHeadingTypo>SNS 게시물 검색 결과</SearchResultHeadingTypo>
      {searchedSnsPostsToBeShowed ? (
        <>
          {searchedSnsPostsToBeShowed.length === 0 && <NoSearchResult />}
          <ul>
            {searchedSnsPostsToBeShowed.map(snsPost => (
              <StyledSnsPostSearchResultListItem
                key={snsPost.id}
                snsPost={snsPost}
              />
            ))}
          </ul>
        </>
      ) : (
        <ul>
          <StyledSnsPostSearchResultListItemSkeleton />
          <StyledSnsPostSearchResultListItemSkeleton />
        </ul>
      )}
    </section>
  )
}

export default SnsPostSearchResult
