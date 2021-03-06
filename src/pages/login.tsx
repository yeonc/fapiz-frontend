import Link from '@mui/material/Link'
import withHeader from 'hocs/withHeader'
import { BACKEND_URL } from 'constants/constants'

const LoginPage = () => (
  <Link href={`${BACKEND_URL}/api/connect/google`}>구글 아이디로 로그인</Link>
)

export default withHeader(LoginPage)
