import { useState } from 'react'
import withHeader from 'hocs/withHeader'
import withLoginPageRedirect from 'hocs/withLoginPageRedirect'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Fab from '@mui/material/Fab'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import FashionItemList from 'components/closet/fashionItemList'
import SelectsForFilteringFashionItems from 'components/closet/selectsForFilteringFashionItems'
import IntroducingBanner from 'components/closet/introducingBanner'
import MaxWidthContainer from 'components/layouts/containers/maxWidthContainer'
import FashionItemCreatingModal from 'components/closet/fashionItemCreatingModal'
import useModalState from 'hooks/useModalState'
import useFashionItems from 'hooks/useFashionItems'
import createUrlQuery from 'utils/createUrlQuery'
import removeDuplicatedValueFromArray from 'utils/removeDuplicatedValueFromArray'
import { Image } from 'types/image'
import { useAuth } from 'context/AuthContext'
import { sanitizeFashionItemsForCloset } from 'sanitizer/fahsionItems'
import Head from 'next/head'
import { ALL_TEXT } from 'constants/common'
import { Id } from 'types/common'

export type FashionItemForCloset = {
  id: Id
  category: string
  color: string
  image: Image
}

const StyledClosetContentsWrapper = styled.div`
  padding: 30px 0;
`

const StyledSelectsForFilteringFashionItems = styled(
  SelectsForFilteringFashionItems
)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`

const fabPositionFixed = css`
  position: fixed;
  right: 20px;
  bottom: 20px;
`

const ClosetPage = () => {
  const [category, setCategory] = useState(ALL_TEXT)
  const [color, setColor] = useState(ALL_TEXT)

  const handleCategoryChange = (category: string) => {
    setCategory(category)
  }

  const handleColorChange = (color: string) => {
    setColor(color)
  }

  const { me } = useAuth()

  const query = me
    ? createUrlQuery({
        'populate[0]': 'image',
        'populate[1]': 'owner',
        'filters[owner][id][$eq]': me.id,
        sort: 'createdAt:desc',
      })
    : ''

  const { fashionItems: fashionItemsFromStrapi } = useFashionItems(query)

  const fashionItems = fashionItemsFromStrapi
    ? sanitizeFashionItemsForCloset(fashionItemsFromStrapi)
    : []

  const {
    isOpen: isFashionItemCreateModalOpen,
    handleOpen: handleFashionItemCreateModalOpen,
    handleClose: handleFashionItemCreateModalClose,
  } = useModalState()

  const categories = getCategoriesFromFashionItems(fashionItems)
  const colors = getColorsFromFashionItems(fashionItems)

  const filteredFashionItems = filterFashionItems({
    category,
    color,
    fashionItems,
  })

  return (
    <>
      <Head>
        <title>온라인 옷장 | Fapiz</title>
        <meta
          name="description"
          content="온라인 옷장에서 내가 소장하고 있는 패션 아이템들을 관리해 보세요"
        />
      </Head>
      <IntroducingBanner />
      <MaxWidthContainer>
        <StyledClosetContentsWrapper>
          <StyledSelectsForFilteringFashionItems
            category={category}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            color={color}
            colors={colors}
            handleColorChange={handleColorChange}
          />
          <FashionItemList fashionItems={filteredFashionItems} />
          <Fab
            color="primary"
            aria-label="옷장에 패션 아이템 등록"
            css={fabPositionFixed}
            onClick={handleFashionItemCreateModalOpen}
          >
            <CheckroomIcon />
          </Fab>
          <FashionItemCreatingModal
            isFashionItemCreateModalOpen={isFashionItemCreateModalOpen}
            onFashionItemCreateModalClose={handleFashionItemCreateModalClose}
          />
        </StyledClosetContentsWrapper>
      </MaxWidthContainer>
    </>
  )
}

export default withHeader(withLoginPageRedirect(ClosetPage))

type Category = string
type Color = string

const getCategoriesFromFashionItems = (
  fashionItems: FashionItemForCloset[]
): Category[] => {
  const categories = fashionItems.map(fashionItem => fashionItem.category)
  return removeDuplicatedValueFromArray(categories)
}

const getColorsFromFashionItems = (
  fashionItems: FashionItemForCloset[]
): Color[] => {
  const colors = fashionItems.map(fashionItem => fashionItem.color)
  return removeDuplicatedValueFromArray(colors)
}

type FilterFashionItemsArgs = {
  category: string
  color: string
  fashionItems: FashionItemForCloset[]
}

type FilterFashionItems = (
  args: FilterFashionItemsArgs
) => FashionItemForCloset[]

const filterFashionItems: FilterFashionItems = ({
  category,
  color,
  fashionItems,
}) => {
  const filteredFashionItems = fashionItems
    .filter(byCategory(category))
    .filter(byColor(color))
  return filteredFashionItems
}

const byCategory =
  (category: string) =>
  (fashionItem: FashionItemForCloset): boolean => {
    if (category === ALL_TEXT) {
      return true
    }
    return fashionItem.category === category
  }

const byColor =
  (color: string) =>
  (fashionItem: FashionItemForCloset): boolean => {
    if (color === ALL_TEXT) {
      return true
    }
    return fashionItem.color === color
  }
