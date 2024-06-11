import { create } from "zustand"
import { Post } from "@/types/post"

type PostStore = {
   posts: Post[]
   isPostsLoading: boolean
}

const usePostStore = create<PostStore>()(() => {
   return {
      posts: [],
      isPostsLoading: true
   }
})

export default usePostStore
