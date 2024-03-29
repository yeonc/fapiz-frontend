import { useState } from 'react'
import { useSWRConfig } from 'swr'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CommentEditInput from 'components/sns/comment/commentEditInput'
import Comment from 'components/common/texts/comment'
import deleteComment from 'services/snsComment/deleteComment'
import createUrlQuery from 'utils/createUrlQuery'
import { Id, Nullable } from 'types/common'
import { useAuth } from 'context/AuthContext'

type CommentByModeProps = {
  commentId: Id
  commentText: string
  snsPostId: Id
  commentAuthorId: Nullable<Id>
}

const CommentByMode = ({
  commentId,
  commentText,
  snsPostId,
  commentAuthorId,
}: CommentByModeProps) => {
  const { mutate } = useSWRConfig()

  const query = createUrlQuery({
    'populate[0]': 'author',
    'populate[1]': 'author.profileImage',
    'filters[post][id][$eq]': `${snsPostId}`,
    sort: 'createdAt:desc',
  })

  const refetch = () => {
    mutate({ url: `/api/sns-comments?${query}` })
  }

  const { me } = useAuth()
  const [isCommentEditMode, setIsCommentEditMode] = useState(false)

  const isShowCommentEditButtonGroup = me?.id === commentAuthorId ? true : false

  const handleCommentEditButtonClick = () => {
    setIsCommentEditMode(true)
  }

  const handleCommentEditCancelButtonClick = () => {
    setIsCommentEditMode(false)
  }

  const handleCommentDeleteButtonClick = async () => {
    const isCommentDelete = window.confirm('댓글을 삭제하시겠습니까?')
    if (!isCommentDelete) return

    try {
      await deleteComment(commentId)
      afterPostCommentDeleted()
    } catch (error) {
      console.error(error)
    }
  }

  const afterPostCommentEdited = () => {
    setIsCommentEditMode(false)
    refetch()
  }

  const afterPostCommentDeleted = () => {
    refetch()
  }

  const commentEditButtons = (
    <>
      <IconButton
        aria-label="댓글 수정"
        onClick={handleCommentEditButtonClick}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="댓글 삭제"
        onClick={handleCommentDeleteButtonClick}
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  )

  return (
    <>
      {isCommentEditMode ? (
        <CommentEditInput
          commentId={commentId}
          initialCommentText={commentText}
          onCommentEditCancelButtonClick={handleCommentEditCancelButtonClick}
          afterPostCommentEdited={afterPostCommentEdited}
        />
      ) : (
        <Comment
          text={commentText}
          buttons={isShowCommentEditButtonGroup ? commentEditButtons : null}
        />
      )}
    </>
  )
}

export default CommentByMode
