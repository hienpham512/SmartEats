import smarteatsLogo from "@/assets/logos/smartEatsLogo.png"
import LoadingSpinner from "@/components/loading-spinner"
import PostCard from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { Post } from "@/types/post"
import { Timestamp, addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { CirclePlusIcon, ImagePlusIcon, MessageCircleIcon, SearchIcon, XCircleIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

const Home: React.FC = () => {
   // eslint-disable-next-line
   const [allPosts, setAllPosts] = React.useState<Post[]>([])
   const [isPostsLoading, setIsPostsLoading] = React.useState<boolean>(true)

   const fetchPosts = React.useCallback(async () => {
      setIsPostsLoading(true)
      const postsSnap = await getDocs(collection(db, "posts"))
      const posts = postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Post)
      setAllPosts(posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()))
      setIsPostsLoading(false)
   }, [])

   React.useEffect(() => {
      fetchPosts()
   }, [fetchPosts])

   if (isPostsLoading) return <LoadingSpinner />

   return (
      <div>
         <Navbar setAllPosts={setAllPosts} />
         <div className="mt-16 space-y-8">
            {allPosts.map((post, index) => (
               <PostCard key={index} mainPost={post} />
            ))}
         </div>
      </div>
   )
}

export default Home

const Navbar: React.FC<{
   setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>
}> = ({ setAllPosts }) => {
   const [isScrollDown, setIsScrollDown] = React.useState<boolean>(false)
   const [lastScrollTop, setLastScrollTop] = React.useState<number>(0)
   const navigate = useNavigate()

   React.useEffect(() => {
      const handleScroll = () => {
         const currentScrollTop = window.scrollY || document.documentElement.scrollTop

         if (currentScrollTop > lastScrollTop) setIsScrollDown(true)
         else setIsScrollDown(false)

         setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop)
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
   }, [lastScrollTop])

   return (
      <div
         className={`fixed top-0 z-50 -mx-4 -my-3 flex w-screen items-center justify-between border-b-2 pl-4 pt-2 shadow-sm transition-all duration-500 ease-in-out md:max-w-md ${
            isScrollDown ? "-top-20" : "top-2"
         }`}
      >
         <img src={smarteatsLogo} className="h-16" />
         <div className="flex items-center">
            <MakePostSheet setAllPosts={setAllPosts} />
            <Button variant="ghost" className="rounded-full" onClick={() => navigate("/search")}>
               <SearchIcon size={28} />
            </Button>
            <Button variant="ghost" className="rounded-full" onClick={() => navigate("/messages")}>
               <MessageCircleIcon size={28} />
            </Button>
         </div>
      </div>
   )
}

const MakePostSheet: React.FC<{
   setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>
}> = ({ setAllPosts }) => {
   const body = React.useRef<HTMLTextAreaElement>(null)
   const imageUpload = React.useRef<HTMLInputElement>(null)
   const [postImages, setPostImages] = React.useState<File[]>([])
   const { user, userData } = useUserStore()

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const filesArray = Array.from({ length: e.target.files.length }, (_, i) => e.target.files![i])
         setPostImages((prevImages) => [...prevImages, ...filesArray])
      }
   }

   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const handleMakePost = async () => {
      setIsLoading(true)

      const emptyPost = await addDoc(collection(db, "posts"), {})
      const postId = emptyPost.id

      const storage = getStorage()

      const imageUrls = await Promise.all(
         postImages.map(async (image, index) => {
            const storageRef = ref(storage, `posts/${postId}/image${index}`)
            const uploadTask = uploadBytesResumable(storageRef, image)
            await uploadTask
            return getDownloadURL(storageRef)
         })
      )

      const post: Post = {
         id: postId,
         body: body.current?.value ?? "",
         images: imageUrls,
         createdAt: Timestamp.now(),
         userID: user?.uid,
         avatar: userData?.avatar ?? "",
         username: userData?.username ?? "",
         isEdited: false,
         updatedAt: null,
         likes: [],
         comments: []
      }

      //update the doc with the post data
      await setDoc(doc(db, "posts", postId), post)

      setAllPosts((prevPosts) => [post, ...prevPosts])
      setIsLoading(false)
      setPostImages([])
      body.current!.value = ""
      setOpenSheet(false)
      toast({ title: "Post added", duration: 1000 })
      window.location.reload()
   }

   const [openSheet, setOpenSheet] = React.useState<boolean>(false)

   return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
         <SheetTrigger asChild>
            <Button variant="ghost" className="rounded-full">
               <CirclePlusIcon size={28} />
            </Button>
         </SheetTrigger>
         <SheetContent className="w-full" side="bottom">
            <SheetHeader className="pb-5">
               <SheetTitle>Make a post</SheetTitle>
               <SheetDescription>Share your thoughts with the world</SheetDescription>
            </SheetHeader>
            <div className="space-y-5">
               {/* images */}
               <div className="grid w-full gap-1.5">
                  <Label htmlFor="imageUpload">Add an image</Label>
                  <Input type="file" className="hidden" ref={imageUpload} onChange={handleImageUpload} />
                  <div className="flex flex-wrap gap-4">
                     {postImages.map((image, index) => (
                        <Card key={index} className="relative h-24 w-24">
                           <img
                              src={URL.createObjectURL(image)}
                              alt="Post"
                              className="h-full w-full rounded-xl object-cover"
                           />
                           <XCircleIcon
                              size={24}
                              className="absolute right-0 top-0 rounded-full bg-white text-red-500"
                              onClick={(e) => {
                                 e.stopPropagation()
                                 setPostImages((prevImages) => prevImages.filter((_, i) => i !== index))
                              }}
                           />
                        </Card>
                     ))}
                     <Card
                        className="flex h-24 w-24 items-center justify-center"
                        onClick={() => {
                           imageUpload.current?.click()
                        }}
                     >
                        <ImagePlusIcon size={40} className="text-gray-300" />
                     </Card>
                  </div>
               </div>
               {/* body */}
               <div className="grid w-full gap-1.5">
                  <Label htmlFor="body">Your thoughts</Label>
                  <Textarea placeholder="What's on your mind ?" id="body" rows={6} ref={body} />
               </div>
            </div>
            <Button className="mt-6 w-full" onClick={handleMakePost}>
               {isLoading ? <LoadingSpinner /> : "Make post"}
            </Button>
         </SheetContent>
      </Sheet>
   )
}
