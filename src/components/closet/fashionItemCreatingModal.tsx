import { useSWRConfig } from 'swr'
import styled from '@emotion/styled'
import Modal from 'components/common/modals/modal'
import FashionItemCreateForm from 'components/closet/fashionItemCreateForm'
import createUrlQuery from 'utils/createUrlQuery'
import { useAuth } from 'context/AuthContext'

const StyledModal = styled(Modal)`
  border-radius: 10px;
`

type FashionItemCreatingModalProps = {
  isFashionItemCreateModalOpen: boolean
  onFashionItemCreateModalClose: () => void
}

const FashionItemCreatingModal = ({
  isFashionItemCreateModalOpen,
  onFashionItemCreateModalClose,
}: FashionItemCreatingModalProps) => {
  const { me } = useAuth()
  const { mutate } = useSWRConfig()
  const query = createUrlQuery({
    'populate[0]': 'image',
    'populate[1]': 'owner',
    'filters[owner][id][$eq]': me && me.id,
    sort: 'createdAt:desc',
  })
  const refetch = () => mutate({ url: `/api/fashion-items?${query}` })
  const afterCreateFashionItem = () => {
    onFashionItemCreateModalClose()
    refetch()
  }

  return (
    <StyledModal
      title="패션 아이템 추가"
      contents={
        <FashionItemCreateForm
          afterCreateFashionItem={afterCreateFashionItem}
        />
      }
      open={isFashionItemCreateModalOpen}
      onClose={onFashionItemCreateModalClose}
    />
  )
}

export default FashionItemCreatingModal
