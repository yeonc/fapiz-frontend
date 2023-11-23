import Button from '@mui/material/Button'
import follow from 'services/user/follow'
import unfollow from 'services/user/unfollow'
import { UserAdditional } from 'types/user'

type FollowToggleButtonProps = {
  myId: number
  myFollowings: UserAdditional['followings']
  targetUserId: number
  afterFollow: () => void
}
const FollowToggleButton = ({
  myId,
  myFollowings,
  targetUserId,
  afterFollow,
}: FollowToggleButtonProps) => {
  const myFollowingUserIds = myFollowings.map(user => user.id)
  const followUser = async () => {
    try {
      await follow({ myId, targetUserId, myFollowingUserIds })
    } catch (error) {
      console.error(error)
    }
  }
  const unfollowUser = async () => {
    try {
      await unfollow({
        myId,
        targetUserId,
        myFollowingUserIds,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const isFollowing = myFollowings.some(
    following => following.id === targetUserId
  )
  const buttonVariant = isFollowing ? 'outlined' : 'contained'
  const buttonText = isFollowing ? '팔로우 취소하기' : '팔로우하기'
  const handleFollow = isFollowing ? unfollowUser : followUser

  const handleClick = async () => {
    await handleFollow()
    afterFollow()
  }

  return (
    <Button size="small" variant={buttonVariant} onClick={handleClick}>
      {buttonText}
    </Button>
  )
}

export default FollowToggleButton
