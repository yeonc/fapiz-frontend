import { Nullable, FashionStyle } from 'types'

export type UserForSearching = {
  id: number
  username: string
  gender: Nullable<string>
  fashionStyles: Nullable<FashionStyle[]>
  avatarUrl: string | undefined
}
