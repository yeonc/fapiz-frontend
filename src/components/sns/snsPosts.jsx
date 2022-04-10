import qs from 'qs'
import SnsPostList from '@mui/material/ImageList'
import SnsPostItem from '@mui/material/ImageListItem'
import useGetRequest from 'hooks/useGetRequest'
import { BACKEND_URL } from 'constants/constants'

const SnsPosts = ({ userId }) => {
  const query = qs.stringify(
    {
      populate: '*',
      filters: {
        author: {
          id: {
            $eq: userId,
          },
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const URL_FOR_FETCHING_SNS_POSTS = `/api/sns-posts?${query}`
  const { response, error, loading } = useGetRequest(
    BACKEND_URL,
    URL_FOR_FETCHING_SNS_POSTS
  )

  if (loading) {
    return <p>로딩중...</p>
  }

  if (error) {
    return <p>에러가 발생했습니다. 홈으로 돌아가세요</p>
  }

  const snsPosts = response.data

  const sanitizedSnsPosts = snsPosts.data.map(post => {
    const postId = post.id
    const postImageArray = post.attributes.postImage.data
    const postImages = postImageArray.map(postImage => postImage.attributes)

    return {
      postId,
      postImages,
    }
  })

  return sanitizedSnsPosts.length === 0 ? (
    <p>작성된 포스트가 없습니다.</p>
  ) : (
    <SnsPostList sx={{ width: 650 }} cols={3}>
      {sanitizedSnsPosts.map(post => {
        const firstImage = post.postImages[0]
        const firstImageUrl = BACKEND_URL + firstImage.url

        return (
          <SnsPostItem key={firstImageUrl}>
            <img
              src={`${firstImageUrl}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${firstImageUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={firstImage.alternativeText}
              loading="lazy"
            />
          </SnsPostItem>
        )
      })}
    </SnsPostList>
  )
}

export default SnsPosts
