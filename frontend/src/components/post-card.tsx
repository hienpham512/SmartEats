import { addLike, createComment, removeLike } from "@/api/posts"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import useUserStore from "@/store/user"
import { Post } from "@/types/post"
import { Timestamp, deleteDoc, doc } from "firebase/firestore"
import {
   // BookmarkIcon,
   CircleIcon,
   CircleUserIcon,
   GripVerticalIcon,
   HeartIcon,
   MessageCircleIcon,
   SendIcon,
   SquareArrowUpRightIcon
} from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Separator } from "./ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Textarea } from "./ui/textarea"
import { toast } from "./ui/use-toast"
import { db } from "@/lib/firebase"

interface IPostCardProps {
   mainPost: Post
}

const PostCard: React.FC<IPostCardProps> = ({ mainPost }) => {
   const [api, setApi] = React.useState<CarouselApi>()
   const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0)
   const { userData } = useUserStore()
   const [post, setPost] = React.useState<Post>(mainPost)

   React.useEffect(() => {
      if (!api) return
      api.on("select", () => {
         setSelectedImageIndex(api.selectedScrollSnap())
      })
   }, [api])

   const isLiked = post.likes?.some((like) => like.userID === userData?.id)
   const handleLike = () => {
      if (!userData) return
      if (!isLiked) {
         addLike(post.id, {
            id: userData.id,
            username: userData.username || "",
            avatar: userData.avatar || ""
         })
         setPost((prev) => ({
            ...prev,
            likes: [
               ...prev.likes!,
               { userID: userData.id, username: userData.username || "", avatar: userData.avatar || "" }
            ]
         }))
      } else {
         removeLike(post.id, userData.id)
         setPost((prev) => ({
            ...prev,
            likes: prev.likes!.filter((like) => like.userID !== userData.id)
         }))
      }
      toast({
         title: isLiked ? "Like removed" : "Like added"
      })
   }
   const navigate = useNavigate()
   const deletePost = async () => {
      const confirm = window.confirm("Are you sure you want to delete this post?")
      if (confirm) {
         const postRef = doc(db, "posts", post.id)
         await deleteDoc(postRef)
         toast({
            title: "Post deleted",
            duration: 1000
         })
         navigate(-1)
         window.location.reload()
      }
   }
   return (
      <div>
         <Card className="space-y-3 p-3">
            <div className="flex items-center gap-x-2">
               <Avatar className="h-7 w-7" onClick={() => navigate(`/user/${post.userID}`)}>
                  {post.avatar ? <AvatarImage src={post?.avatar} /> : <CircleUserIcon size={28} />}
               </Avatar>
               <CardTitle>{post?.username}</CardTitle>
               {post.userID === userData?.id && (
                  <div className="ml-auto">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <GripVerticalIcon size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={deletePost}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               )}
            </div>
            <Carousel setApi={setApi} className="-mx-3">
               <CarouselContent className="relative">
                  {post?.images.map((image, index) => (
                     <CarouselItem key={index}>
                        <img src={image} alt="post" className="h-96 w-full object-cover" />
                     </CarouselItem>
                  ))}
               </CarouselContent>
               {post!.images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-4 mx-auto flex w-max items-center justify-center gap-x-1 rounded-full px-4 backdrop-blur-3xl">
                     {post?.images.map((_, index) => (
                        <CircleIcon
                           key={index}
                           size={8}
                           fill={index === selectedImageIndex ? "#F97316" : "white"}
                           className="transition-all duration-200 ease-in-out"
                        />
                     ))}
                  </div>
               )}
            </Carousel>

            <div className="flex items-center justify-between">
               <div className="flex items-center justify-between gap-x-2">
                  <HeartIcon
                     fill={isLiked ? "red" : "transparent"}
                     color={isLiked ? "red" : "currentColor"}
                     onClick={handleLike}
                  />
                  <CommentSheet post={post} setPost={setPost} />
                  <SquareArrowUpRightIcon />
               </div>
            </div>

            {post.likes && post.likes.length > 0 && (
               <div className="flex items-center gap-x-4">
                  <div className="relative flex items-center">
                     {post?.likes.slice(0, 3).map((like, index) => (
                        <div
                           style={{
                              left: `${index * 9}px`
                           }}
                           className={`absolute rounded-full`}
                           key={index}
                        >
                           {like.avatar ? (
                              <Avatar className="h-5 w-5">
                                 <AvatarImage src={like.avatar} />
                              </Avatar>
                           ) : (
                              <CircleUserIcon size={20} />
                           )}
                        </div>
                     ))}
                  </div>
                  <p
                     className={`${post.likes.length >= 3 ? "ml-8" : post.likes.length === 2 ? "ml-5" : "ml-2"} text-sm`}
                  >
                     Liked by <span className="font-medium">{post?.likes[0].username.toLowerCase()}</span> and{" "}
                     <span className="font-medium">{post!.likes.length - 1} others</span>
                  </p>
               </div>
            )}

            <div>
               <PostInfo className="text-sm" username={post?.username} body={post?.body} />
            </div>
            {post.comments && post.comments.length > 0 && (
               <CardFooter className="flex-col items-start gap-y-0.5 px-0">
                  <CommentSheet post={post} setPost={setPost} viewAll />
                  <PostInfo
                     className="mt-0.5 text-xs"
                     username={post?.comments[0].username.toLowerCase()}
                     body={post?.comments[0].body}
                  />
               </CardFooter>
            )}
         </Card>
      </div>
   )
}

export default PostCard

interface IPostInfoProps {
   username: string | undefined
   body: string | undefined
   className: string
}
const PostInfo: React.FC<IPostInfoProps> = ({ username, body, className }) => (
   <p className={`${className} font-semibold leading-none`}>
      {username} <span className="ml-1 font-normal leading-none">{body}</span>
   </p>
)

const CommentSheet: React.FC<{
   post: Post
   setPost: React.Dispatch<React.SetStateAction<Post>>
   viewAll?: boolean
}> = ({ post, setPost, viewAll = false }) => {
   const comment = React.useRef<HTMLTextAreaElement>(null)
   const { userData } = useUserStore()
   const handleSend = async () => {
      await createComment(post.id, comment.current?.value as string, {
         id: userData?.id as string,
         username: userData?.username || "",
         avatar: userData?.avatar || ""
      })
      setPost((prev) => ({
         ...prev,
         comments: [
            ...prev.comments,
            {
               body: comment.current?.value as string,
               createdAt: Timestamp.fromDate(new Date()),
               userID: userData?.id as string,
               username: userData?.username || "",
               avatar: userData?.avatar || ""
            }
         ]
      }))
      toast({
         title: "Comment added",
         duration: 1000
      })
      comment.current!.value = ""
   }
   return (
      <Sheet>
         <SheetTrigger asChild>
            {viewAll ? (
               <CardDescription className="text-xs">View all {post!.comments.length} comments</CardDescription>
            ) : (
               <MessageCircleIcon size={28} />
            )}
         </SheetTrigger>
         <SheetContent side="bottom" className="h-[90%] w-full">
            <CardTitle>Comments</CardTitle>
            <div className="mt-5 grid gap-3 overflow-y-scroll">
               {post.comments.map((comment, index) => (
                  <React.Fragment key={index}>
                     <div className="relative flex items-center gap-2">
                        {comment.avatar ? (
                           <Avatar className="h-7 w-7">
                              <AvatarImage src={comment.avatar} />
                           </Avatar>
                        ) : (
                           <CircleUserIcon className="min-h-7 min-w-7" />
                        )}
                        <PostInfo className="text-sm" username={comment.username} body={comment.body} />
                        <div className="absolute bottom-0 right-0">
                           <p className="text-end text-[8px]">
                              {comment.createdAt.toDate().toLocaleDateString("us", {
                                 month: "short",
                                 day: "numeric",
                                 hour: "numeric",
                                 minute: "numeric"
                              })}
                           </p>
                        </div>
                     </div>

                     <Separator />
                  </React.Fragment>
               ))}
            </div>
            <div className="absolute bottom-2 left-0 mx-4 flex items-center gap-x-4">
               <Textarea className="w-80" placeholder="Add a comment" rows={4} ref={comment} />
               <SendIcon onClick={handleSend} />
            </div>
         </SheetContent>
      </Sheet>
   )
}
