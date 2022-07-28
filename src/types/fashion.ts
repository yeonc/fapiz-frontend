export type FashionItemInfo = {
  id: number
  category: string | ''
  price: number | ''
  buyingPlace: string | ''
}

type FashionStyleName =
  | '캐주얼'
  | '스트릿'
  | '빈티지'
  | '시크'
  | '페미닌'
  | '스포티'
  | '모던'
  | '럭셔리'
  | '댄디'
  | '클래식'
  | '아메카지'
  | '힙스터'

export type FashionStyle = {
  id: number
  name: FashionStyleName
}