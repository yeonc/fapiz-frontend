import styled from '@emotion/styled'
import SnsPostSearchResultListItem from 'components/search/snsPostSearchResultListItem'
import NoSearchResult from 'components/search/noSearchResult'
import Typo from 'components/common/typo'
import useSnsPosts from 'hooks/useSnsPosts'
import addBackendUrlToImageUrl from 'utils/addBackendUrlToImageUrl'
import createUrlQuery from 'utils/createUrlQuery'
import getFormattedDate from 'utils/getFormattedDate'
import { SnsPostForSearching } from 'types/snsPost'
import { GRAY_HOVER_BACKGROUND } from 'styles/constants/color'
import searchResultHeadingTypoProps from 'styles/props/searchResultHeadingTypoProps'

type SnsPostSearchResultListItemComponentProps = {
  className?: string
  snsPost: SnsPostForSearching
}

const SnsPostSearchResultListItemComponent = ({
  className,
  snsPost,
}: SnsPostSearchResultListItemComponentProps) => (
  <SnsPostSearchResultListItem className={className} snsPost={snsPost} />
)

const StyledSnsPostSearchResultListItem = styled(
  SnsPostSearchResultListItemComponent
)`
  padding: 10px 14px;
  margin-bottom: 20px;

  &:hover {
    background-color: ${GRAY_HOVER_BACKGROUND};
  }
`

type SnsPostSearchResultProps = {
  className?: string
  searchKeyword: string
}

const SnsPostSearchResult = ({
  className,
  searchKeyword,
}: SnsPostSearchResultProps) => {
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
    useSnsPosts(query)

  if (isSnsPostsLoading) {
    return <p>로딩중...</p>
  }

  const searchedSnsPosts = sanitizeSnsPosts(searchedSnsPostsFromStrapi)

  return (
    <section className={className}>
      <Typo {...searchResultHeadingTypoProps}>SNS 게시물 검색 결과</Typo>
      <ul>
        {searchedSnsPosts.length === 0 ? (
          <NoSearchResult />
        ) : (
          searchedSnsPosts.map(snsPost => (
            <StyledSnsPostSearchResultListItem
              key={snsPost.id}
              snsPost={snsPost}
            />
          ))
        )}
      </ul>
    </section>
  )
}

export default SnsPostSearchResult

const sanitizeSnsPosts = (searchedSnsPostsFromStrapi): SnsPostForSearching[] =>
  searchedSnsPostsFromStrapi.map(searchedSnsPostFromStrapi => {
    const author = searchedSnsPostFromStrapi.attributes.author.data.attributes
    const createdDate = new Date(searchedSnsPostFromStrapi.attributes.createdAt)

    return {
      id: searchedSnsPostFromStrapi.id,
      createdAt: getFormattedDate(createdDate),
      firstImage: {
        url: addBackendUrlToImageUrl(
          searchedSnsPostFromStrapi.attributes.postImages.data[0].attributes.url
        ),
        altText:
          searchedSnsPostFromStrapi.attributes.postImages.data[0].attributes
            .alternativeText,
      },
      content: searchedSnsPostFromStrapi.attributes.content,
      likeNumbers: searchedSnsPostFromStrapi.attributes.likeUsers.data.length,
      author: {
        username: author.username,
        avatarUrl: addBackendUrlToImageUrl(
          author.profileImage.data?.attributes.url
        ),
      },
      commentCount: searchedSnsPostFromStrapi.attributes.comments.data.length,
    }
  })
