import { FormEvent, useState } from 'react'
import editPost from 'services/users/editPost'
import uploadImage from 'services/users/uploadImage'
import generateIdIntoObject from 'utils/generateIdIntoObject'
import { changeImageFilesToPreviewImages } from 'utils/previewImage'
import addBackendUrlToImageUrl from 'utils/addBackendUrlToImageUrl'
import { FashionItemInfo, PreviewImage, ImageFiles, Obj, WithId } from 'types'

const EMPTY_FASHION_ITEM_INFO = { category: '', price: '', buyingPlace: '' }

const createNewEmptyFashionItemInfo = (): WithId<Obj> => {
  return generateIdIntoObject(EMPTY_FASHION_ITEM_INFO)
}
const emptyFashionItemInfo = createNewEmptyFashionItemInfo() as FashionItemInfo

type UploadedImageIds = number[]

const PostEdit = ({ snsPost, afterEditPost, children }) => {
  // TODO: map 함수 image 인자 타입 정의
  const initialPreviewImages: PreviewImage[] =
    snsPost.attributes.postImages.data.map((image: any) => ({
      url: addBackendUrlToImageUrl(image.attributes.url),
      altText: image.attributes.alternativeText,
    }))
  const initialFashionItemsInfo: FashionItemInfo[] = snsPost.attributes
    .fashionItemsInfo ?? [emptyFashionItemInfo]
  const initialPostText: string = snsPost.attributes.content

  const [imageFiles, setImageFiles] = useState<ImageFiles>(null)
  const [previewImages, setPreviewImages] =
    useState<PreviewImage[]>(initialPreviewImages)
  const [fashionItemsInfo, setFashionItemsInfo] = useState<FashionItemInfo[]>(
    initialFashionItemsInfo
  )
  const [postText, setPostText] = useState(initialPostText)

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

  const getUploadedImageIds = async (): Promise<
    UploadedImageIds | undefined
  > => {
    if (!imageFiles) {
      return
    }

    const res = await uploadImage(imageFiles)
    const uploadedImageIds: UploadedImageIds = res.data.map(
      (image: any) => image.id
    )

    return uploadedImageIds
  }

  const editSnsPost = async () => {
    const imageIds = await getUploadedImageIds()

    await editPost({
      postId: snsPost.id,
      content: postText,
      imageIds,
      fashionItemsInfo,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: map 함수 image 인자 타입 정의
    try {
      await editSnsPost()
      afterEditPost()
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

export default PostEdit
