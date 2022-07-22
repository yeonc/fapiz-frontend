import { FormEvent, useRef } from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { SearchKeyword } from 'types'

type SearchFormProps = {
  onSearchKeywordSubmit: (keyword: SearchKeyword) => void
}

const SearchForm = ({ onSearchKeywordSubmit }: SearchFormProps) => {
  const searchKeywordInputRef = useRef<HTMLInputElement>(null)

  const handleSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const searchKeyword: SearchKeyword = searchKeywordInputRef.current
      ? searchKeywordInputRef.current.value
      : null

    onSearchKeywordSubmit(searchKeyword)
  }

  return (
    <form onSubmit={handleSearchFormSubmit}>
      <OutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        type="search"
        inputProps={{ required: true, minLength: 2 }}
        placeholder="검색어를 입력하세요"
        inputRef={searchKeywordInputRef}
      />
      <Button type="submit" variant="contained" size="large">
        검색
      </Button>
    </form>
  )
}

export default SearchForm
