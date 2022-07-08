import { FormEvent, useState } from 'react'
import createPost from 'services/users/createPost'
import uploadImage from 'services/users/uploadImage'
import { changeImageFilesToPreviewImages } from 'utils/previewImage'
import generateIdIntoObject from 'utils/generateIdIntoObject'
import { FashionItemInfo, PreviewImage } from 'types'

const EMPTY_FASHION_ITEM_INFO = { category: '', price: '', buyingPlace: '' }
const newEmptyFashionItemInfo = generateIdIntoObject(
  EMPTY_FASHION_ITEM_INFO
) as FashionItemInfo

type ImageFiles = File[] | null
type PreviewImages = PreviewImage[] | null
type CreatedPostId = number

const CreatePost = ({ authorId, afterCreatePost, children }) => {
  const [imageFiles, setImageFiles] = useState<ImageFiles>(null)
  const [previewImages, setPreviewImages] = useState<PreviewImages>(null)
  const [fashionItemsInfo, setFashionItemsInfo] = useState<FashionItemInfo[]>([
    newEmptyFashionItemInfo,
  ])
  const [postText, setPostText] = useState<string>('')

  const handleImageFilesChange = (imageFiles: File[]) => {
    setImageFiles(imageFiles)
    const previewImagesFromImageFiles =
      changeImageFilesToPreviewImages(imageFiles)
    setPreviewImages(previewImagesFromImageFiles)
  }

  const handleFashionItemsInfoChange = (
    fashionItemsInfo: FashionItemInfo[]
  ) => {
    setFashionItemsInfo(fashionItemsInfo)
  }

  const handleFashionItemInfoAddMoreButtonClick = () => {
    setFashionItemsInfo(prev => {
      const newEmptyFashionItemInfo = generateIdIntoObject(
        EMPTY_FASHION_ITEM_INFO
      ) as FashionItemInfo
      return prev.concat(newEmptyFashionItemInfo)
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFiles) return

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

    // TODO: map 함수 image 인자 타입 정의
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
