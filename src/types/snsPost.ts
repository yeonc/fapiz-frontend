export type SnsPostForSearching = {
  id: number
  createdAt: string
  firstImage: {
    url: string | undefined
    altText: string
  }
  content: string
  likeNumbers: number
  author: {
    username: string
    avatarUrl: string | undefined
  }
}
