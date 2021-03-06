import axios from 'axios'
import { BACKEND_URL } from 'constants/constants'

const editComment = async ({ commentId, commentText }) => {
  return axios({
    method: 'put',
    url: `${BACKEND_URL}/api/sns-comments/${commentId}`,
    data: {
      data: {
        content: commentText,
      },
    },
  })
}

export default editComment
