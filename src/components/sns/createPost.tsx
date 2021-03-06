import { FormEvent, useState } from 'react'
import createPost from 'services/users/createPost'
import uploadImage from 'services/users/uploadImage'
import { changeImageFilesToPreviewImages } from 'utils/previewImage'
import generateIdIntoObject from 'utils/generateIdIntoObject'
import { FashionItemInfo, ImageFiles, Obj, WithId, PreviewImage } from 'types'

const EMPTY_FASHION_ITEM_INFO = { category: '', price: '', buyingPlace: '' }

const createNewEmptyFashionItemInfo = (): WithId<Obj> => {
  return generateIdIntoObject(EMPTY_FASHION_ITEM_INFO)
}
const emptyFashionItemInfo = createNewEmptyFashionItemInfo() as FashionItemInfo

type CreatedPostId = number

const CreatePost = ({ authorId, afterCreatePost, children }) => {
  const [imageFiles, setImageFiles] = useState<ImageFiles>(null)
  const [previewImages, setPreviewImages] = useState<PreviewImage[] | null>(
    null
  )
  const [fashionItemsInfo, setFashionItemsInfo] = useState<FashionItemInfo[]>([
    emptyFashionItemInfo,
  ])
  const [postText, setPostText] = useState<string>('')

  const handleImageFilesChange = (imageFiles: File[]) => {
    setImageFiles(imageFiles)
    const previewImages = changeImageFilesToPreviewImages(imageFiles)
    setPreviewImages(previewImages)
  }

  const handleFashionItemsInfoChange = (
    fashionItemsInfo: FashionItemInfo[]
  ) => {
    setFashionItemsInfo(fashionItemsInfo)
  }

  const handleFashionItemInfoAddMoreButtonClick = () => {
    setFashionItemsInfo(prev => {
      const emptyFashionItemInfo =
        createNewEmptyFashionItemInfo() as FashionItemInfo
      return prev.concat(emptyFashionItemInfo)
    })
  }

  const handleFashionItemInfoDeleteButtonClick = (
    fashionItemInfoIdToDelete: number
  ) => {
    setFashionItemsInfo(prev => {
      return prev.filter(prev => prev.id !== fashionItemInfoIdToDelete)
    })
  }

  const handlePostTextChange = (postText: string) => {
    setPostText(postText)
  }

  const createSnsPost = async (
    uploadedImageIds: number[]
  ): Promise<CreatedPostId> => {
    const res = await createPost({
      postText,
      fashionItemsInfo,
      authorId,
      postImageIds: uploadedImageIds,
    })

    const createdPostId: number = res.data.data.id
    return createdPostId
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFiles) return

    // TODO: map ?????? image ?????? ?????? ??????
    // TODO: uploadedImageIds ???????????? ?????? ????????? ??????
    try {
      const res = await uploadImage(imageFiles)
      const uploadedImageIds: number[] = res.data.map((image: any) => image.id)
      const createdPostId = await createSnsPost(uploadedImageIds)
      afterCreatePost(createdPostId)
    } catch (error) {
      console.error(error)
    }
  }

  return children({
    previewImages,
    fashionItemsInfo,
    postText,
    handleImageFilesChange,
    handleFashionItemsInfoChange,
    handleFashionItemInfoAddMoreButtonClick,
    handleFashionItemInfoDeleteButtonClick,
    handlePostTextChange,
    handleSubmit,
  })
}

export default CreatePost
