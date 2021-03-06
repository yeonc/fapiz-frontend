import axios, { AxiosResponse } from 'axios'
import { BACKEND_URL } from 'constants/constants'
import { AccessToken } from 'types/auth'

const googleLogin = async (
  accessToken: AccessToken
): Promise<AxiosResponse> => {
  return axios({
    method: 'get',
    url: `${BACKEND_URL}/api/auth/google/callback`,
    params: { access_token: accessToken },
  })
}

export default googleLogin
