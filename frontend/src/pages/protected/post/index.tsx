import LoadingSpinner from "@/components/loading-spinner"
import PostCard from "@/components/post-card"
import { db } from "@/lib/firebase"
import { Post as TPost } from "@/types/post"
import { collection, getDocs, query, where } from "firebase/firestore"
import React from "react"
import { useParams } from "react-router-dom"

const Post: React.FC = () => {
   const { id } = useParams()

   const [post, setPost] = React.useState<TPost>({} as TPost)
   const [isLoading, setIsLoading] = React.useState<boolean>(true)

   const fetchPost = React.useCallback(async () => {
      const q = query(collection(db, "posts"), where("id", "==", id))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return
      setPost(querySnapshot.docs[0].data() as TPost)
      setIsLoading(false)
   }, [id])

   React.useEffect(() => {
      fetchPost()
   }, [fetchPost])

   return <div>{isLoading ? <LoadingSpinner /> : <PostCard mainPost={post as TPost} />}</div>
}

export default Post
