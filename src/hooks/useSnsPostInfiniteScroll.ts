import { useState, useEffect, RefObject } from 'react'
import axios, { AxiosResponse } from 'axios'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { SnsPostForMainPage } from 'types/snsPost'
import { Nullable } from 'types/common'
import { FashionStyle } from 'types/fashion'

type FetchFilteredSnsPostsArgs = {
  pageNumber: number
  pageSize: number
  isLoggedIn: boolean
  myGender: Nullable<string>
  myBodyShape: Nullable<string>
  myFashionStyles: Nullable<FashionStyle[]>
}

type FetchFilteredSnsPosts = (
  args: FetchFilteredSnsPostsArgs
) => Promise<AxiosResponse<SnsPostForMainPage[]>>

const fetchFilteredSnsPosts: FetchFilteredSnsPosts = async ({
  pageNumber,
  pageSize,
  isLoggedIn,
  myGender,
  myBodyShape,
  myFashionStyles,
}) => {
  const myFashionStylesString = JSON.stringify(myFashionStyles)
  const encodedMyFashonStyles = encodeURIComponent(myFashionStylesString)

  return axios({
    method: 'get',
    url: '/api/filtered-sns-posts',
    params: {
      pageNumber,
      pageSize,
      isLoggedIn,
      myGender,
      myBodyShape,
      myFashionStyles: myFashionStyles && encodedMyFashonStyles,
    },
  })
}

type UseSnsPostInfiniteScrollArgs = {
  initialPageNumber: number
  pageSize: number
  isLoggedIn: boolean
  myGender: Nullable<string>
  myBodyShape: Nullable<string>
  myFashionStyles: Nullable<FashionStyle[]>
}

type UseSnsPostInfiniteScrollReturns = {
  snsPosts: SnsPostForMainPage[]
  isSnsPostsLoading: boolean
  fetchTriggerRef: RefObject<HTMLElement>
}

type UseSnsPostInfiniteScroll = (
  args: UseSnsPostInfiniteScrollArgs
) => UseSnsPostInfiniteScrollReturns

const useSnsPostInfiniteScroll: UseSnsPostInfiniteScroll = ({
  initialPageNumber,
  pageSize,
  isLoggedIn,
  myGender,
  myBodyShape,
  myFashionStyles,
}) => {
  const [snsPosts, setSnsPosts] = useState<SnsPostForMainPage[]>([])
  const [isSnsPostsLoading, setIsSnsPostsLoading] = useState(false)
  const [pageNumber, setPageNumber] = useState(initialPageNumber)

  const increasePageNumber = () => setPageNumber(prev => prev + 1)
  const fetchTriggerRef = useInfiniteScroll(increasePageNumber)

  useEffect(() => {
    setIsSnsPostsLoading(true)
    fetchFilteredSnsPosts({
      pageNumber,
      pageSize,
      isLoggedIn,
      myGender,
      myBodyShape,
      myFashionStyles,
    })
      .then(response => setSnsPosts(prev => [...prev, ...response.data]))
      .catch(console.error)
      .finally(() => setIsSnsPostsLoading(false))
  }, [pageNumber])

  return {
    snsPosts,
    isSnsPostsLoading,
    fetchTriggerRef,
  }
}

export default useSnsPostInfiniteScroll