import { Obj } from 'types'

type QueryString = string

const createUrlQuery = (queryParamsObj: Obj): QueryString => {
  const searchParams = new URLSearchParams(queryParamsObj)
  const query = searchParams.toString()
  return query
}

export default createUrlQuery
