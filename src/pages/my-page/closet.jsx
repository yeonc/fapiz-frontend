import withHeader from 'hocs/withHeader'
import FashionItemsList from 'components/closet/fashionItemsList'
import ButtonGroupsForFilteringFashionItems from 'components/closet/buttonGroupsForFilteringFashionItems'
import FashionItemCreatingArea from 'components/closet/fashionItemCreatingArea'
import useMe from 'hooks/useMe'
import useFashionItems from 'hooks/useFashionItems'
import createUrlQuery from 'utils/createUrlQuery'
import { BACKEND_URL } from 'constants/constants'

const ClosetPage = () => {
  const { me } = useMe()

  const query = createUrlQuery({
    'populate[0]': 'image',
    'populate[1]': 'owner',
    'filters[owner][id][$eq]': me && me.id,
    sort: 'createdAt:desc',
  })

  const { fashionItems: fashionItemsFromStrapi } = useFashionItems(query)

  const fashionItems = fashionItemsFromStrapi.map(fashionItem => ({
    id: fashionItem.id,
    season: fashionItem.attributes.season,
    category: fashionItem.attributes.category,
    color: fashionItem.attributes.color,
    image: {
      url: BACKEND_URL + fashionItem.attributes.image.data.attributes.url,
      altText: fashionItem.attributes.image.data.attributes.alternativeText,
    },
  }))

  return (
    <>
      <ButtonGroupsForFilteringFashionItems />
      <FashionItemsList fashionItems={fashionItems} />
      <FashionItemCreatingArea />
    </>
  )
}

export default withHeader(ClosetPage)
