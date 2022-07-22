import Image from 'next/image'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Avatar from '@mui/material/Avatar'
import Link from '@mui/material/Link'
import { mgRight } from 'styles/layout'
import { SnsPostForSearching } from 'types/snsPost'
import ROUTE_URL from 'constants/routeUrl'

const StyledSnsPostSearchResultListItemWrapper = styled.li`
  margin-bottom: 20px;

  &:hover {
    background-color: #f1f1f1f5;
  }
`

const StyledSnsPostSearchResultWrapper = styled.div`
  display: flex;
`

const avatarStyle = css`
  display: inline-flex;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`

type SnsPostSearchResultListItemProps = {
  snsPost: SnsPostForSearching
}

const SnsPostSearchResultListItem = ({
  snsPost,
}: SnsPostSearchResultListItemProps) => (
  <StyledSnsPostSearchResultListItemWrapper>
    <Link href={`${ROUTE_URL.SNS}/post/${snsPost.id}`}>
      <StyledSnsPostSearchResultWrapper>
        <Image
          src={snsPost.firstImage.url}
          alt={snsPost.firstImage.altText}
          width={150}
          height={150}
        />
        <div>
          <p>{snsPost.content}</p>
          <Avatar
            src={snsPost.author.avatarUrl}
            alt={snsPost.author.username}
            css={avatarStyle}
          />
          <span css={mgRight(8)}>{snsPost.author.username}</span>
          <span css={mgRight(8)}>{snsPost.createdAt}</span>
          <span>좋아요 {snsPost.likeNumbers}</span>
        </div>
      </StyledSnsPostSearchResultWrapper>
    </Link>
  </StyledSnsPostSearchResultListItemWrapper>
)

export default SnsPostSearchResultListItem
