import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate, useSWRConfig } from 'swr'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import Input from '@mui/material/Input'
import UserAvatar from '@mui/material/Avatar'
import { horizontal } from 'styles/layout'
import useMe from 'hooks/useMe'
import useSnsPost from 'hooks/useSnsPost'
import createComment from 'services/users/createComment'
import createUrlQuery from 'utils/createUrlQuery'
import deleteComment from 'services/users/deleteComment'
import editComment from 'services/users/editComment'
import { BACKEND_URL } from 'constants/constants'

const CommentInputFormWrapper = styled.form`
  display: flex;
  align-items: center;
`

const query = createUrlQuery({
  'populate[0]': 'comments.author',
  'populate[1]': 'comments.author.profileImage',
})

const PostCommentInputForm = ({ snsPostId }) => {
  const [comment, setComment] = useState('')
  const { me, error } = useMe()

  const { mutate } = useSWRConfig()

  const loading = !me && !error

  if (loading) {
    return <p>로딩중...</p>
  }

  if (error) {
    return <p>에러가 발생했습니다. 홈으로 돌아가세요</p>
  }

  const handleChange = e => {
    setComment(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await createComment({ comment, postId: snsPostId, authorId: me.id })
      mutate({ url: `api/sns-posts/${snsPostId}?${query}` })
    } catch (error) {
      console.error(error)
    } finally {
      setComment('')
    }
  }

  return (
    <CommentInputFormWrapper onSubmit={handleSubmit}>
      <UserAvatar
        alt={me.username}
        src={BACKEND_URL + me.profileImage.url}
        sx={{ width: 30, height: 30, marginRight: 1 }}
      />
      <TextField
        label="댓글을 입력하세요"
        variant="standard"
        value={comment}
        onChange={handleChange}
        required
      />
      <Button variant="contained" size="small" type="submit">
        등록
      </Button>
    </CommentInputFormWrapper>
  )
}

const PostCommentList = ({ comments, snsPostId }) => {
  const [isCommentEditMode, setIsCommentEditMode] = useState(false)
  const [editedComment, setEditedComment] = useState('')

  const handleCommentEditButtonClick = () => {
    setIsCommentEditMode(true)
  }

  const handleCommentEditInputChange = e => {
    setEditedComment(e.target.value)
  }

  console.log(isCommentEditMode)
  return (
    <>
      <ul>
        {comments &&
          comments.map(comment => (
            <li key={comment.id} css={horizontal}>
              <UserAvatar
                alt={comment.author}
                src={BACKEND_URL + comment.profileImageUrl}
                sx={{ width: 30, height: 30, marginRight: 1 }}
              />
              <span>{comment.author}</span>
              {isCommentEditMode ? (
                <>
                  <Input
                    defaultValue={comment.content}
                    placeholder="수정할 댓글 내용을 입력하세요"
                    value={editedComment}
                    onChange={handleCommentEditInputChange}
                  />
                  <IconButton
                    aria-label="수정한 댓글 전송"
                    onClick={() => {
                      editComment({
                        commentId: comment.id,
                        comment: editedComment,
                      })
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <p>{comment.content}</p>
                  <IconButton
                    aria-label="댓글 수정"
                    onClick={handleCommentEditButtonClick}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
              <IconButton
                aria-label="댓글 삭제"
                onClick={async () => {
                  await deleteComment(comment.id).catch(console.error)
                  mutate({ url: `api/sns-posts/${snsPostId}?${query}` })
                }}
              >
                <DeleteIcon />
              </IconButton>
            </li>
          ))}
      </ul>
    </>
  )
}

const PostCommentContents = () => {
  const router = useRouter()
  const { snsPostId } = router.query

  const { snsPost } = useSnsPost(snsPostId, query)

  const commentsFromStrapiDB = snsPost && snsPost.data.attributes.comments.data

  const comments =
    commentsFromStrapiDB &&
    commentsFromStrapiDB.map(comment => ({
      id: comment.id,
      author: comment.attributes.author.data.attributes.username,
      content: comment.attributes.content,
      profileImageUrl:
        comment.attributes.author.data.attributes.profileImage.data.attributes
          .url,
    }))

  return (
    <>
      <PostCommentInputForm snsPostId={snsPostId} />
      <PostCommentList comments={comments} snsPostId={snsPostId} />
    </>
  )
}

export default PostCommentContents
