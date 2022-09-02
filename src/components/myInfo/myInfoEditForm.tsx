import { FormEvent, useState } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Typo from 'components/common/typo'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import ImageUploadButton from 'components/common/buttons/imageUploadButton'
import editMyInfo from 'services/user/editMyInfo'
import uploadImage from 'services/upload/uploadImage'
import { changeImageFileToPreviewImage } from 'utils/previewImage'
import {
  USER_BODY_SHAPES,
  USER_FASHION_STYLES,
  USER_GENDERS,
} from 'constants/user'
import { UserForMyInfoPage } from 'types/user'
import { ImageFiles, PreviewImage } from 'types/image'
import { Nullable } from 'types/common'
import { DEFAULT_BLACK, DEFAULT_WHITE } from 'styles/constants/color'
import { mgBottom, mgRight } from 'styles/layout'

const StyledAvatarAndUsernameWrapper = styled.div`
  text-align: center;
  margin-bottom: 50px;
`

const StyledUsernameAndGenderInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`

const StyledHeightAndWeightInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`

const StyledBodyShapeAndFashionStyleInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
`

const StyledUserInfoEditAndCancelButtonWrapper = styled.div`
  text-align: center;
`

const StyledImageUploadButton = styled(ImageUploadButton)`
  background-color: ${DEFAULT_BLACK};
  color: ${DEFAULT_WHITE};
`

const avatarStyle = css`
  width: 200px;
  height: 200px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 18px 50px -10px;
`

const inputWidth = css`
  width: 35%;
`

type MyInfoEditFormProps = {
  myInfo: UserForMyInfoPage
  afterMyInfoEdited: () => void
  afterMyInfoEditCanceled: () => void
}

const MyInfoEditForm = ({
  myInfo,
  afterMyInfoEdited,
  afterMyInfoEditCanceled,
}: MyInfoEditFormProps) => {
  const [avatarImageFiles, setAvatarImageFiles] = useState<ImageFiles>(null)
  const [previewAvatar, setPreviewAvatar] =
    useState<Nullable<PreviewImage>>(null)
  const [username, setUsername] = useState(myInfo.username)
  const [gender, setGender] = useState(myInfo.gender)
  const [height, setHeight] = useState(myInfo.height)
  const [weight, setWeight] = useState(myInfo.weight)
  const [bodyShape, setBodyShape] = useState(myInfo.bodyShape)
  const [fashionStyles, setFashionStyles] = useState(myInfo.fashionStyles)

  const handleAvatarImageFilesChange = (imageFiles: FileList) => {
    setAvatarImageFiles(imageFiles)
    const previewAvatarImage = changeImageFileToPreviewImage(imageFiles[0])
    setPreviewAvatar(previewAvatarImage)
  }

  const handleUsernameChange = (username: string) => {
    setUsername(username)
  }

  const handleGenderChange = (gender: string) => {
    setGender(gender)
  }

  const handleHeightChange = (height: number) => {
    setHeight(height)
  }

  const handleWeightChange = (weight: number) => {
    setWeight(weight)
  }

  const handleBodyShapeChange = (bodyShape: string) => {
    setBodyShape(bodyShape)
  }

  const handleFashionStylesChange = (fashionStyles: any) => {
    setFashionStyles(fashionStyles)
  }

  const editInfo = async () => {
    let uploadedImageId: number | undefined

    if (avatarImageFiles) {
      const res = await uploadImage(avatarImageFiles)
      uploadedImageId = res.data[0].id
    }

    await editMyInfo({
      myId: myInfo.id,
      profileImageId: uploadedImageId,
      username,
      gender,
      height,
      weight,
      bodyShape,
      fashionStyles,
    })
  }

  const handleMyInfoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await editInfo()
      afterMyInfoEdited()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleMyInfoSubmit}>
      <StyledAvatarAndUsernameWrapper>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <StyledImageUploadButton
              onImageFilesChange={handleAvatarImageFilesChange}
              buttonAriaLabel="유저 아바타 변경"
              isImageRequired={false}
            />
          }
          css={mgBottom(10)}
        >
          <Avatar
            src={previewAvatar ? previewAvatar.url : myInfo.imageUrl}
            alt={previewAvatar ? previewAvatar.altText : myInfo.username}
            css={avatarStyle}
          />
        </Badge>
        <Typo variant="h4" component="h1">
          {myInfo.username}
        </Typo>
      </StyledAvatarAndUsernameWrapper>
      <StyledUsernameAndGenderInputWrapper>
        <TextField
          label="유저 이름"
          value={username}
          onChange={e => handleUsernameChange(e.target.value)}
          css={[inputWidth, mgRight(20)]}
        />
        <FormControl css={inputWidth}>
          <InputLabel>성별</InputLabel>
          <Select
            label="성별"
            value={gender}
            onChange={e => handleGenderChange(e.target.value)}
          >
            {USER_GENDERS.map(gender => (
              <MenuItem key={gender.id} value={gender.name}>
                {gender.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledUsernameAndGenderInputWrapper>
      <StyledHeightAndWeightInputWrapper>
        <TextField
          label="키"
          type="number"
          value={height}
          onChange={e => handleHeightChange(Number(e.target.value))}
          css={[inputWidth, mgRight(20)]}
        />
        <TextField
          label="몸무게"
          type="number"
          value={weight}
          onChange={e => handleWeightChange(Number(e.target.value))}
          css={inputWidth}
        />
      </StyledHeightAndWeightInputWrapper>
      <StyledBodyShapeAndFashionStyleInputWrapper>
        <FormControl css={[inputWidth, mgRight(20)]}>
          <InputLabel>체형</InputLabel>
          <Select
            label="체형"
            value={bodyShape}
            onChange={e => handleBodyShapeChange(e.target.value)}
          >
            {USER_BODY_SHAPES.map(bodyShape => (
              <MenuItem key={bodyShape.id} value={bodyShape.name}>
                {bodyShape.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl css={inputWidth}>
          <InputLabel>패션 스타일</InputLabel>
          <Select
            label="패션 스타일"
            multiple
            value={fashionStyles}
            onChange={e => handleFashionStylesChange(e.target.value)}
            renderValue={selectedFashionStyles => (
              <div>
                {selectedFashionStyles.map(fashionStyle => (
                  <Chip key={fashionStyle.id} label={fashionStyle.name} />
                ))}
              </div>
            )}
          >
            {USER_FASHION_STYLES.map(fashionStyle => (
              <MenuItem key={fashionStyle.id} value={fashionStyle.name}>
                {fashionStyle.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledBodyShapeAndFashionStyleInputWrapper>
      <StyledUserInfoEditAndCancelButtonWrapper>
        <Button variant="contained" type="submit" css={mgRight(10)}>
          수정
        </Button>
        <Button variant="outlined" onClick={afterMyInfoEditCanceled}>
          취소
        </Button>
      </StyledUserInfoEditAndCancelButtonWrapper>
    </form>
  )
}

export default MyInfoEditForm