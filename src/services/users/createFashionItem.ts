import axios from 'axios'
import { BACKEND_URL } from 'constants/constants'

const createFashionItem = async ({
  season,
  category,
  color,
  imageId,
  ownerId,
}) => {
  return axios({
    method: 'post',
    url: `${BACKEND_URL}/api/fashion-items`,
    data: {
      data: {
        season,
        category,
        color,
        image: imageId,
        owner: ownerId,
      },
    },
  })
}

export default createFashionItem
