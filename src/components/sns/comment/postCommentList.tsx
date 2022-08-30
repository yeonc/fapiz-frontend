import styled from '@emotion/styled'
import CommentIcon from '@mui/icons-material/Comment'
import PostCommentItem from 'components/sns/comment/postCommentItem'
import useSnsComments from 'hooks/useSnsComments'
import createUrlQuery from 'utils/createUrlQuery'
import { PostCommentForSnsPostPage } from 'types/postComment'
import { mgBottom } from 'styles/layout'

const StyledNotExistComment = styled.div`
  padding: 30px;
  text-align: center;
`

const StyledPostCommentItem = styled(PostCommentItem)`
  margin-bottom: 4px;
`

type PostCommentListProps = {
  snsPostId: number
}

const PostCommentList = ({ snsPostId }: PostCommentListProps) => {
  const query = createUrlQuery({
    'populate[0]': 'author',
    'populate[1]': 'author.profileImage',
    'filters[post][id][$eq]': `${snsPostId}`,
    sort: 'createdAt:asc',
  })

  const { snsComments: snsCommentsFromStrapi } = useSnsComments(query)

  const comments: PostCommentForSnsPostPage[] = snsCommentsFromStrapi.map(
    (snsComment: any) => {
      const author = snsComment.attributes.author.data

      return {
        id: snsComment.id,
        content: snsComment.attributes.content,
        authorId: author.id,
        authorName: author.attributes.username,
        authorProfileImageUrl:
          author.attributes.profileImage.data?.attributes.url,
      }
    }
  )

  if (comments.length === 0) {
    return (
      <StyledNotExistComment>
        <CommentIcon fontSize="large" css={mgBottom(4)} />
        <p>댓글이 없습니다. 첫 댓글을 입력해 보세요!</p>
      </StyledNotExistComment>
    )
  }

  return (
    <ul>
      {comments.map(comment => (
        <StyledPostCommentItem
          key={comment.id}
          comment={comment}
          postId={snsPostId}
        />
      ))}
    </ul>
  )
}

export default PostCommentList
