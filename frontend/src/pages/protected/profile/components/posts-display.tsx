import SkeletonLoader from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { Post } from "@/types/post"
import { collection, getDocs, query, where } from "firebase/firestore"
import { CopyIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

const PostsDisplay: React.FC<{
   id?: string | null
}> = ({ id = null }) => {
   const navigate = useNavigate()
   const { user } = useUserStore()

   const [userPosts, setUserPosts] = React.useState<Post[]>([])
   const [isLoading, setIsLoading] = React.useState(true)

   const fetchPosts = React.useCallback(async () => {
      const q = query(collection(db, "posts"), where("userID", "==", id ?? user?.uid))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
         const posts = querySnapshot.docs.map((doc) => doc.data() as Post)
         setUserPosts(posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()))
      }
      setTimeout(() => setIsLoading(false), 1000)
   }, [id])

   React.useEffect(() => {
      fetchPosts()
   }, [fetchPosts])

   const handlePostClick = (id: string) => {
      navigate(`/post/${id}`)
   }
   if (isLoading) return <SkeletonLoader variant="imageGrid" />
   return (
      <Card className="min-h-[30rem]">
         {userPosts.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
               <CardDescription>No posts to display</CardDescription>
               <CardDescription>Go to home page to make a post !</CardDescription>
            </div>
         ) : (
            <CardContent className="grid grid-cols-3 gap-1.5 p-3">
               {userPosts.map((post) => (
                  <div
                     key={post.id}
                     className="relative"
                     onClick={() => {
                        handlePostClick(post.id)
                     }}
                  >
                     <img src={post.images[0]} alt="post" className="h-28 w-36 rounded-xl object-cover" />
                     {post.images.length > 1 && <CopyIcon size={16} className="absolute bottom-2 right-2" />}
                  </div>
               ))}
            </CardContent>
         )}
      </Card>
   )
}

export default PostsDisplay
