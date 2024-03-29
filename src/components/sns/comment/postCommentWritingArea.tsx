import { FormEvent, useState } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import Avatar from '@mui/material/Avatar'
import createComment from 'services/snsComment/createComment'
import { useAuth } from 'context/AuthContext'
import useUser from 'hooks/useUser'
import createUrlQuery from 'utils/createUrlQuery'
import { UserResponseWithProfileImage } from 'types/user'
import { Id } from 'types/common'

const StyledPostCommentWritingAreaWrapper = styled.div`
  display: flex;
`

const avatarStyle = css`
  display: inline-flex;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  transform: translateY(18px);
`

const StyledPostCommentForm = styled.form`
  display: inline-flex;
  align-items: flex-end;
  width: 100%;
`

const StyledTextField = styled(TextField)`
  flex-grow: 1;
  margin-right: 6px;
`

type PostCommentWritingAreaProps = {
  snsPostId: Id
  afterPostCommentSubmit: () => void
  className?: string
}

const query = createUrlQuery({
  'populate[0]': 'profileImage',
})

const PostCommentWritingArea = ({
  snsPostId,
  afterPostCommentSubmit,
  className,
}: PostCommentWritingAreaProps) => {
  const { me } = useAuth()
  const { user } = useUser<UserResponseWithProfileImage>(me?.id, query)
  const [comment, setComment] = useState('')
  const [isCommentCreateLoading, setIsCommentCreateLoading] = useState(false)

  if (!user) {
    return null
  }

  const handleCommentChange = (comment: string) => setComment(comment)
  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCommentCreateLoading(true)
    try {
      await createComment({ comment, postId: snsPostId, authorId: user.id })
      setComment('')
      afterPostCommentSubmit()
    } catch (error) {
      console.error(error)
    } finally {
      setIsCommentCreateLoading(false)
    }
  }

  return (
    <StyledPostCommentWritingAreaWrapper className={className}>
      <Avatar
        alt={user.username}
        src={user.profileImage?.url}
        css={avatarStyle}
      />
      <StyledPostCommentForm onSubmit={handleCommentSubmit}>
        <StyledTextField
          label="댓글을 입력하세요"
          variant="standard"
          value={comment}
          onChange={e => handleCommentChange(e.target.value)}
          required
          multiline
        />
        <LoadingButton
          variant="contained"
          size="small"
          type="submit"
          loading={isCommentCreateLoading}
          loadingPosition="center"
        >
          등록
        </LoadingButton>
      </StyledPostCommentForm>
    </StyledPostCommentWritingAreaWrapper>
  )
}

export default PostCommentWritingArea
