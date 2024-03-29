import { FormEvent, useState } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import LoadingButton from '@mui/lab/LoadingButton'
import Typo from 'components/common/typo'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import InputAdornment from '@mui/material/InputAdornment'
import ImageUploadButton from 'components/common/buttons/imageUploadButton'
import editMyInfo from 'services/user/editMyInfo'
import uploadImage from 'services/upload/uploadImage'
import { changeImageFileToPreviewImage } from 'utils/previewImage'
import compareTwoArrays from 'utils/compareTwoArrays'
import {
  USER_BODY_SHAPES,
  USER_FASHION_STYLES,
  USER_GENDERS,
} from 'constants/user'
import { ImageFiles, Image, UploadedImageId } from 'types/image'
import { Nullable } from 'types/common'
import { DEFAULT_BLACK, DEFAULT_WHITE } from 'styles/constants/color'
import { mgBottom, mgRight } from 'styles/layout'
import { FashionStyle } from 'types/fashion'
import { UserForMyInfo } from 'pages/my-info'
import useError from 'hooks/useError'
import ErrorMessage, { ErrorType } from 'components/common/texts/ErrorMessage'
import { ERROR_MESSAGE_TIMEOUT_SEC } from 'constants/common'
import { BodyShape, Gender } from 'types/user'

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

const StyledErrorMessageWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

type FashionStyleId = FashionStyle['id']

type MyInfoEditFormProps = {
  myInfo: UserForMyInfo
  afterMyInfoEdited: () => void
}

const MyInfoEditForm = ({ myInfo, afterMyInfoEdited }: MyInfoEditFormProps) => {
  const [avatarImageFiles, setAvatarImageFiles] = useState<ImageFiles>(null)
  const [previewAvatar, setPreviewAvatar] = useState<Nullable<Image>>(null)
  const [username, setUsername] = useState(myInfo.username)
  const [gender, setGender] = useState(myInfo.gender)
  const [height, setHeight] = useState(myInfo.height)
  const [weight, setWeight] = useState(myInfo.weight)
  const [bodyShape, setBodyShape] = useState(myInfo.bodyShape)
  const [fashionStyles, setFashionStyles] = useState(myInfo.fashionStyles)
  const [isMyInfoEditLoading, setIsMyInfoEditLoading] = useState(false)
  const [isEditButtonActivated, setIsEditButtonActivated] = useState(false)
  const { error, handleError } = useError<ErrorType>()

  const avatarImageSrc = previewAvatar ? previewAvatar.url : myInfo.imageUrl
  const avatarImageAlt = previewAvatar ? previewAvatar.altText : myInfo.username

  const changeEditButtonActivateMode = (activateMode: boolean) => {
    setIsEditButtonActivated(activateMode)
  }

  const handleAvatarImageFilesChange = (imageFiles: FileList) => {
    setEditButtonStateByAvatarImageFilesChange({
      avatarImageFiles,
      changeEditButtonActivateMode,
    })
    setAvatarImageFiles(imageFiles)
    const previewAvatarImage = changeImageFileToPreviewImage(imageFiles[0])
    setPreviewAvatar(previewAvatarImage)
  }

  const handleUsernameChange = (username: string) => {
    setEditButtonStateByPrimitiveValueChange({
      initialValue: myInfo.username,
      inputValue: username,
      changeEditButtonActivateMode,
    })
    setUsername(username)
  }

  const handleGenderChange = (gender: Gender) => {
    setEditButtonStateByPrimitiveValueChange({
      initialValue: myInfo.gender,
      inputValue: gender,
      changeEditButtonActivateMode,
    })
    setGender(gender)
  }

  const handleHeightChange = (height: number) => {
    const heightValue = !Number.isNaN(height) ? height : null
    setEditButtonStateByPrimitiveValueChange({
      initialValue: myInfo.height,
      inputValue: heightValue,
      changeEditButtonActivateMode,
    })
    setHeight(heightValue)
  }

  const handleWeightChange = (weight: number) => {
    const weightValue = !Number.isNaN(weight) ? weight : null
    setEditButtonStateByPrimitiveValueChange({
      initialValue: myInfo.weight,
      inputValue: weightValue,
      changeEditButtonActivateMode,
    })
    setWeight(weightValue)
  }

  const handleBodyShapeChange = (bodyShape: BodyShape) => {
    setEditButtonStateByPrimitiveValueChange({
      initialValue: myInfo.bodyShape,
      inputValue: bodyShape,
      changeEditButtonActivateMode,
    })
    setBodyShape(bodyShape)
  }

  const handleFashionStylesChange = (fashionStyles: FashionStyle[]) => {
    setEditButtonStateByFashionStylesChange({
      initialFashionStyles: myInfo.fashionStyles,
      fashionStylesOfInput: fashionStyles,
      changeEditButtonActivateMode,
    })
    setFashionStyles(fashionStyles)
  }

  const handleMyInfoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsMyInfoEditLoading(true)
    try {
      await editInfo()
      changeEditButtonActivateMode(false)
      afterMyInfoEdited()
    } catch (error) {
      handleError('myInfoEditError', ERROR_MESSAGE_TIMEOUT_SEC)
    } finally {
      setIsMyInfoEditLoading(false)
    }
  }

  const editInfo = async () => {
    const imageId = await uploadUserAvatarImage()
    await editMyInfo({
      myId: myInfo.id,
      profileImageId: imageId,
      username,
      gender,
      height,
      weight,
      bodyShape,
      fashionStyles,
    })
  }

  const uploadUserAvatarImage = async (): Promise<
    UploadedImageId | undefined
  > => {
    if (!avatarImageFiles) return
    const res = await uploadImage(avatarImageFiles)
    const uploadedImageId = res.data[0].id
    return uploadedImageId
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
          <Avatar src={avatarImageSrc} alt={avatarImageAlt} css={avatarStyle} />
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
          required
          css={[inputWidth, mgRight(20)]}
        />
        <FormControl css={inputWidth}>
          <InputLabel>성별</InputLabel>
          <Select
            label="성별"
            value={gender}
            onChange={e => handleGenderChange(e.target.value as Gender)}
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
          value={height ?? ''}
          onChange={e =>
            handleHeightChange((e.target as HTMLInputElement).valueAsNumber)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>,
          }}
          css={[inputWidth, mgRight(20)]}
        />
        <TextField
          label="몸무게"
          type="number"
          value={weight ?? ''}
          onChange={e =>
            handleWeightChange((e.target as HTMLInputElement).valueAsNumber)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          css={inputWidth}
        />
      </StyledHeightAndWeightInputWrapper>
      <StyledBodyShapeAndFashionStyleInputWrapper>
        <FormControl css={[inputWidth, mgRight(20)]}>
          <InputLabel>체형</InputLabel>
          <Select
            label="체형"
            value={bodyShape}
            onChange={e => handleBodyShapeChange(e.target.value as BodyShape)}
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
            value={convertFashionStyleObjectsToFashionStyleIds(fashionStyles)}
            onChange={e =>
              handleFashionStylesChange(
                convertFashionStyleIdsToFashionStyleObjects(
                  e.target.value as FashionStyleId[]
                )
              )
            }
            renderValue={selectedFashionStyleIds => {
              const fashionStyles = convertFashionStyleIdsToFashionStyleObjects(
                selectedFashionStyleIds
              )

              return (
                <div>
                  {fashionStyles.map(fashionStyle => (
                    <Chip
                      key={fashionStyle.id}
                      label={fashionStyle.name}
                      size="small"
                    />
                  ))}
                </div>
              )
            }}
          >
            {USER_FASHION_STYLES.map(fashionStyle => (
              <MenuItem key={fashionStyle.id} value={fashionStyle.id}>
                {fashionStyle.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledBodyShapeAndFashionStyleInputWrapper>
      {error && (
        <StyledErrorMessageWrapper>
          <ErrorMessage type={error} />
        </StyledErrorMessageWrapper>
      )}
      <StyledUserInfoEditAndCancelButtonWrapper>
        <LoadingButton
          variant="contained"
          type="submit"
          css={mgRight(10)}
          disabled={!isEditButtonActivated}
          loading={isMyInfoEditLoading}
          loadingPosition="center"
        >
          수정
        </LoadingButton>
      </StyledUserInfoEditAndCancelButtonWrapper>
    </form>
  )
}

export default MyInfoEditForm

type SetEditButtonStateByAvatarImageFilesChangeArgs = {
  avatarImageFiles: ImageFiles
  changeEditButtonActivateMode: (activateMode: boolean) => void
}

const setEditButtonStateByAvatarImageFilesChange = ({
  avatarImageFiles,
  changeEditButtonActivateMode,
}: SetEditButtonStateByAvatarImageFilesChangeArgs) => {
  if (avatarImageFiles === null) {
    changeEditButtonActivateMode(false)
  }

  changeEditButtonActivateMode(true)
}

type SetEditButtonStateByPrimitiveValueChangeArgs = {
  initialValue: Nullable<string | number>
  inputValue: string | Nullable<number>
  changeEditButtonActivateMode: (activateMode: boolean) => void
}

const setEditButtonStateByPrimitiveValueChange = ({
  initialValue,
  inputValue,
  changeEditButtonActivateMode,
}: SetEditButtonStateByPrimitiveValueChangeArgs) => {
  if (initialValue === inputValue) {
    changeEditButtonActivateMode(false)
  }

  if (initialValue !== inputValue) {
    changeEditButtonActivateMode(true)
  }
}

type SetEditButtonStateByFashionStylesChangeArgs = {
  initialFashionStyles: FashionStyle[]
  fashionStylesOfInput: FashionStyle[]
  changeEditButtonActivateMode: (activateMode: boolean) => void
}

const setEditButtonStateByFashionStylesChange = ({
  initialFashionStyles,
  fashionStylesOfInput,
  changeEditButtonActivateMode,
}: SetEditButtonStateByFashionStylesChangeArgs) => {
  const areTwoFashionStylesEqual = compareTwoArrays({
    firstArray: initialFashionStyles,
    secondArray: fashionStylesOfInput,
  })

  if (!areTwoFashionStylesEqual) {
    changeEditButtonActivateMode(true)
  }

  if (areTwoFashionStylesEqual) {
    changeEditButtonActivateMode(false)
  }
}

const convertFashionStyleIdsToFashionStyleObjects = (
  fashionStyleIds: FashionStyleId[]
): FashionStyle[] => {
  return fashionStyleIds.map(fashionStyleId => {
    const foundedFashionStyleObject = USER_FASHION_STYLES.filter(
      fashionStyle => fashionStyle.id === fashionStyleId
    )
    return foundedFashionStyleObject[0]
  })
}

const convertFashionStyleObjectsToFashionStyleIds = (
  fashionStyles: FashionStyle[]
): FashionStyleId[] => {
  return fashionStyles.map(fashionStyle => fashionStyle.id)
}
