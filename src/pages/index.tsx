import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import withHeader from 'hocs/withHeader'
import withLogin from 'hocs/withLogin'
import { css } from '@emotion/react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import LikeButton from 'components/common/buttons/likeButton'
import useSnsPosts from 'hooks/useSnsPosts'
import useMe from 'hooks/useMe'
import createUrlQuery from 'utils/createUrlQuery'
import getDaysBetweenTwoDate from 'utils/getDaysBetweenTwoDate'
import addBackendUrlToImageUrl from 'utils/addBackendUrlToImageUrl'

const queryForFetchingSnsPosts = createUrlQuery({
  'populate[0]': 'postImages',
  'populate[1]': 'likeUsers',
  'populate[2]': 'author',
  'pagination[limit]': 200,
})
const mutateKeyForFetchingSnsPosts = {
  url: `/api/sns-posts?${queryForFetchingSnsPosts}`,
}

const cursorPointer = css`
  cursor: pointer;
`

const TWO_DAYS = 2

const ADD_ADDITIONAL_INFO_MESSAGE =
  '추가 정보 세 개 중 하나밖에 작성되지 않았네요! 두 가지 이상을 작성하시면 맞춤형 게시물을 보실 수 있습니다! 지금 정보를 수정하러 가 볼까요?'

const SnsPostLikeButtonWithLogin = withLogin(LikeButton)

const ImageCardItem = ({ cardItemData, rightActionButton }) => {
  const router = useRouter()

  const goToSnsPost = (snsPostId: any) => router.push(`/sns/post/${snsPostId}`)

  const handleImageListItemClick = (e: any) => {
    const isLikeButtonClicked = e.target.id === LikeButton.id
    if (isLikeButtonClicked) {
      return
    }

    goToSnsPost(cardItemData.id)
  }

  return (
    <ImageListItem onClick={handleImageListItemClick} css={cursorPointer}>
      <img src={cardItemData.imageUrl} alt={cardItemData.imageAltText} />
      <ImageListItemBar
        title={cardItemData.author}
        position="top"
        actionIcon={rightActionButton}
        actionPosition="right"
      />
    </ImageListItem>
  )
}

// TODO: MainPage 컴포넌트 섹션별로 분리, filterSnsPostsByMyInfo 함수 쪼개기
// TODO: 페이지 렌더링 될 때마다 SNS 포스트 순서 랜덤하게 섞이는 것에 대한 처리 어떻게 해야 할지 결정하고 반영하기
const MainPage = () => {
  const { mutate } = useSWRConfig()

  const afterLike = () => {
    mutate(mutateKeyForFetchingSnsPosts)
  }

  const { me } = useMe()

  const { snsPosts: snsPostsFromStrapi, isLoading: isSnsPostsLoading } =
    useSnsPosts(queryForFetchingSnsPosts)

  if (isSnsPostsLoading) {
    return <p>포스트를 받아오는 중입니다.</p>
  }

  const snsPosts = snsPostsFromStrapi.map(snsPost => ({
    id: snsPost.id,
    createdAt: snsPost.attributes.createdAt,
    author: snsPost.attributes.author.data.attributes.username,
    authorGender: snsPost.attributes.author.data.attributes.gender,
    authorBodyShape: snsPost.attributes.author.data.attributes.bodyShape,
    authorFashionStyles:
      snsPost.attributes.author.data.attributes.fashionStyles,
    imageUrl: addBackendUrlToImageUrl(
      snsPost.attributes.postImages.data[0].attributes.url
    ),
    imageAltText:
      snsPost.attributes.postImages.data[0].attributes.alternativeText,
    likeUsers: snsPost.attributes.likeUsers.data,
  }))

  const filterRecentlyCreatedSnsPosts = (snsPosts: any) => {
    return snsPosts.filter((snsPost: any) => {
      const today = new Date()
      const snsPostCreatedAt = new Date(snsPost.createdAt)
      const isCreatedInLast2Days =
        getDaysBetweenTwoDate(snsPostCreatedAt, today) < TWO_DAYS
      return isCreatedInLast2Days
    })
  }

  const randomizeSnsPosts = (snsPosts: any) => {
    return snsPosts.sort(() => Math.random() - 0.5)
  }

  const filterSnsPostsByMyInfo = (snsPosts: any) => {
    const isMyGenderInfoNotExist = me.gender === null || me.gender === ''
    const isMyBodyShapeInfoNotExist =
      me.bodyShape === null || me.bodyShape === ''
    const isMyFashionStylesInfoNotExist =
      me.fashionStyles === null || me.fashionStyles === []

    const isAllOfMyAdditionalInfoNotExist =
      isMyGenderInfoNotExist &&
      isMyBodyShapeInfoNotExist &&
      isMyFashionStylesInfoNotExist
    const isOnlyGenderInfoExist =
      me.gender && isMyBodyShapeInfoNotExist && isMyFashionStylesInfoNotExist
    const isOnlyBodyShapeInfoExist =
      me.bodyShape && isMyGenderInfoNotExist && isMyFashionStylesInfoNotExist
    const isOnlyFashionStylesInfoExist =
      me.fashionStyles && isMyGenderInfoNotExist && isMyBodyShapeInfoNotExist

    const isSnsPostAuthorFashionStylesMatchWithMyFashionStyles = (
      myFashionStyles: any,
      snsPostAuthorFashionStyles: any
    ) =>
      snsPostAuthorFashionStyles !== null && snsPostAuthorFashionStyles !== []
        ? snsPostAuthorFashionStyles.some((authorFashionStyle: any) =>
            myFashionStyles.some(
              (myFashionStyle: any) =>
                authorFashionStyle.id === myFashionStyle.id
            )
          )
        : false

    if (!me || isAllOfMyAdditionalInfoNotExist) {
      return snsPosts
    }

    if (isOnlyGenderInfoExist) {
      alert(ADD_ADDITIONAL_INFO_MESSAGE)
      return snsPosts
    }

    if (isOnlyBodyShapeInfoExist) {
      alert(ADD_ADDITIONAL_INFO_MESSAGE)
      return snsPosts
    }

    if (isOnlyFashionStylesInfoExist) {
      alert(ADD_ADDITIONAL_INFO_MESSAGE)
      return snsPosts
    }

    if (me.gender && me.bodyShape && me.fashionStyles) {
      return snsPosts.filter(
        (snsPost: any) =>
          snsPost.authorGender === me.gender &&
          snsPost.authorBodyShape === me.bodyShape &&
          isSnsPostAuthorFashionStylesMatchWithMyFashionStyles(
            me.fashionStyles,
            snsPost.authorFashionStyles
          )
      )
    }

    if (me.gender && me.bodyShape) {
      return snsPosts.filter(
        (snsPost: any) =>
          snsPost.authorGender === me.gender &&
          snsPost.authorBodyShape === me.bodyShape
      )
    }

    if (me.gender && me.fashionStyles) {
      return snsPosts.filter(
        (snsPost: any) =>
          snsPost.authorGender === me.gender &&
          isSnsPostAuthorFashionStylesMatchWithMyFashionStyles(
            me.fashionStyles,
            snsPost.authorFashionStyles
          )
      )
    }

    if (me.bodyShape && me.fashionStyles) {
      return snsPosts.filter(
        (snsPost: any) =>
          snsPost.authorBodyShape === me.bodyShape &&
          isSnsPostAuthorFashionStylesMatchWithMyFashionStyles(
            me.fashionStyles,
            snsPost.authorFashionStyles
          )
      )
    }
  }

  const filteredSnsPostsByMyInfo = me
    ? filterSnsPostsByMyInfo(snsPosts)
    : snsPosts
  const recentlyCreatedSnsPosts = filterRecentlyCreatedSnsPosts(
    filteredSnsPostsByMyInfo
  )
  const snsPostsToShow = randomizeSnsPosts(recentlyCreatedSnsPosts)

  return (
    <>
      <ImageList variant="masonry" cols={3}>
        {snsPostsToShow.map((snsPost: any) => (
          <ImageCardItem
            key={snsPost.id}
            cardItemData={snsPost}
            rightActionButton={
              <SnsPostLikeButtonWithLogin
                myId={me?.id}
                targetId={snsPost.id}
                likeUsers={snsPost.likeUsers}
                afterLike={afterLike}
                isShowLikeUsersNumber={false}
              />
            }
          />
        ))}
      </ImageList>
    </>
  )
}

export default withHeader(MainPage)
