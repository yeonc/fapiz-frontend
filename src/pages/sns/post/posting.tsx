import { useRouter } from 'next/router'
import withHeader from 'hocs/withHeader'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import ImageUploadButton from 'components/common/buttons/imageUploadButton'
import PostWritingHeadingTypo from 'components/sns/post/postWritingHeadingTypo'
import PostWritingSubheadingTypo from 'components/sns/post/postWritingSubheadingTypo'
import FashionItemInfos from 'components/sns/post/fashionItemInfos'
import PostCreate from 'components/sns/post/postCreate'
import ImageUploadCaptionTypo from 'components/common/typo/imageUploadCaptionTypo'
import MaxWidthContainer from 'components/layouts/containers/maxWidthContainer'
import { useAuth } from 'context/AuthContext'
import Head from 'next/head'
import { Id } from 'types/common'

const StyledSnsPostCreatePageWrapper = styled.div`
  padding: 20px 0;
`

const StyledPostImageWrapper = styled.section`
  margin-bottom: 22px;
`

const StyledPostFashionItemInfoWrapper = styled.section`
  margin-bottom: 22px;
`

const StyledPostDescriptionWrapper = styled.section`
  margin-bottom: 22px;
`

const StyledFashionItemInfos = styled(FashionItemInfos)`
  margin-bottom: 10px;
`

const previewImageSize = css`
  width: 33.33%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  object-fit: cover;
`

const postSubmitButtonStyle = css`
  display: block;
  margin: 0 auto;
`

const SnsPostCreatePage = () => {
  const { me } = useAuth()

  const router = useRouter()

  const goToSnsPost = (postId: Id) => {
    router.push(`/sns/post/${postId}`)
  }

  const afterPostCreated = (createdPostId: Id) => {
    goToSnsPost(createdPostId)
  }

  return (
    <>
      <Head>
        <title>SNS 게시물 등록 | Fapiz</title>
        <meta
          name="description"
          content="SNS 게시물을 등록하고 나의 패션을 마음껏 뽐내보세요"
        />
      </Head>
      <MaxWidthContainer>
        <StyledSnsPostCreatePageWrapper>
          {me && (
            <PostCreate authorId={me.id} afterPostCreated={afterPostCreated}>
              {({
                previewImages,
                fashionItemInfos,
                postText,
                handleImageFilesChange,
                handleFashionItemInfosChange,
                handleFashionItemInfoAddMoreButtonClick,
                handleFashionItemInfoDeleteButtonClick,
                handlePostTextChange,
                handleSubmit,
              }) => (
                <>
                  <PostWritingHeadingTypo>게시물 등록</PostWritingHeadingTypo>
                  <form onSubmit={handleSubmit}>
                    <StyledPostImageWrapper>
                      <PostWritingSubheadingTypo>
                        게시물 이미지
                      </PostWritingSubheadingTypo>
                      {previewImages &&
                        previewImages.map(previewImage => (
                          <img
                            key={previewImage.url}
                            src={previewImage.url}
                            alt={previewImage.altText}
                            css={previewImageSize}
                          />
                        ))}
                      <div>
                        <ImageUploadButton
                          onImageFilesChange={handleImageFilesChange}
                          buttonAriaLabel="SNS 게시물 이미지 업로드"
                          isImageRequired={true}
                        />
                        <ImageUploadCaptionTypo>
                          아이콘을 클릭해 이미지를 업로드 해 보세요! (세
                          장까지만 가능)
                        </ImageUploadCaptionTypo>
                      </div>
                    </StyledPostImageWrapper>
                    <StyledPostFashionItemInfoWrapper>
                      <PostWritingSubheadingTypo>
                        착용한 패션 아이템 정보
                      </PostWritingSubheadingTypo>
                      <StyledFashionItemInfos
                        fashionItemInfos={fashionItemInfos}
                        onFashionItemInfosChange={handleFashionItemInfosChange}
                        onFashionItemInfoDeleteButtonClick={
                          handleFashionItemInfoDeleteButtonClick
                        }
                      />
                      <Button
                        variant="outlined"
                        onClick={handleFashionItemInfoAddMoreButtonClick}
                        size="small"
                        startIcon={<AddIcon />}
                      >
                        아이템 정보 더 추가
                      </Button>
                    </StyledPostFashionItemInfoWrapper>
                    <StyledPostDescriptionWrapper>
                      <PostWritingSubheadingTypo>
                        게시물 내용
                      </PostWritingSubheadingTypo>
                      <TextField
                        multiline
                        value={postText}
                        onChange={e => handlePostTextChange(e.target.value)}
                        fullWidth={true}
                        minRows={3}
                      />
                    </StyledPostDescriptionWrapper>
                    <Button
                      variant="contained"
                      type="submit"
                      css={postSubmitButtonStyle}
                    >
                      등록
                    </Button>
                  </form>
                </>
              )}
            </PostCreate>
          )}
        </StyledSnsPostCreatePageWrapper>
      </MaxWidthContainer>
    </>
  )
}

export default withHeader(SnsPostCreatePage)
