import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import useUser from 'hooks/useUser'

const modalBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const FollowerList = ({ followers }) => {
  const router = useRouter()
  const { userId } = router.query

  const { user, isLoading, error } = useUser(userId)

  const follower = user.follower

  if (isLoading) {
    return <p>로딩중...</p>
  }

  if (error) {
    return <p>에러가 발생했습니다. 홈으로 돌아가세요</p>
  }

  return followers.length === 0 ? (
    <p>팔로워가 존재하지 않습니다.</p>
  ) : (
    <List>
      {followers.map(person => (
        <ListItem
          key={person.id}
          secondaryAction={<Button variant="outlined">button</Button>}
        >
          <ListItemAvatar>
            <Avatar
              alt={person.username}
              src=""
              component="a"
              href={`/sns/${person.id}`}
            />
          </ListItemAvatar>
          <ListItemText secondary={`${person.height}cm ${person.weight}kg`}>
            <Link href={`/sns/${person.id}`} underline="hover">
              {person.username}
            </Link>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

const FollowerListModal = ({ onClose, open, followers }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalBoxStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Follower
        </Typography>
        <FollowerList followers={followers} />
      </Box>
    </Modal>
  )
}

export default FollowerListModal
