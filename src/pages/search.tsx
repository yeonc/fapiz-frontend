import { useState } from 'react'
import SearchForm from 'components/search/searchForm'
import SnsPostSearchResult from 'components/search/snsPostSearchResult'
import UserSearchResult from 'components/search/userSearchResult'
import withHeader from 'hocs/withHeader'
import { SearchKeyword } from 'types'

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<SearchKeyword>(null)

  const onSearchKeywordSubmit = (keyword: SearchKeyword) => {
    setSearchKeyword(keyword)
  }

  return (
    <>
      <SearchForm onSearchKeywordSubmit={onSearchKeywordSubmit} />
      {searchKeyword ? (
        <>
          <SnsPostSearchResult searchKeyword={searchKeyword} />
          <UserSearchResult searchKeyword={searchKeyword} />
        </>
      ) : null}
    </>
  )
}

export default withHeader(SearchPage)
