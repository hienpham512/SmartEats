import { followUser, getFollowers, getFollowing, getNbPosts, unfollowUser } from "@/api/user"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { IUserData } from "@/types/user"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { BoltIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

interface IProfileCardProps {
   userData:
      | (IUserData & {
           followedBy?: string[] | undefined
        })
      | null
   other?: boolean
}

const ProfileCard: React.FC<IProfileCardProps> = ({ userData, other = false }) => {
   const [nbFollowers, setNbFollowers] = React.useState<number>(0)
   const [nbFollowing, setNbFollowing] = React.useState<number>(0)
   const [nbPosts, setNbPosts] = React.useState<number>(0)
   const { userData: currentUserData, getOtherUserData } = useUserStore()
   const navigate = useNavigate()

   const isFollowing = React.useMemo(() => {
      if (!currentUserData || !userData || !userData.followedBy) return false
      return userData.followedBy.includes(currentUserData.id)
   }, [userData, currentUserData])

   const follow = () => {
      if (!userData) return console.error("No user data found")
      if (!currentUserData) return console.error("No current user data found")
      if (userData.followedBy?.includes(currentUserData.id))
         unfollowUser(currentUserData.id, userData.id).then(() => {
            toast({ title: `You have just unfollowed ${userData.name}.` })
         })
      else
         followUser(currentUserData.id, userData.id).then(() => {
            toast({ title: `You have just started following ${userData.name}.` })
         })
      getOtherUserData(userData.id)
   }

   const getNbFollowing = React.useCallback(async (id: string) => {
      const nb = await getFollowing(id).then((f) => f.length)
      return nb
   }, [])
   const getNbFollowers = React.useCallback(async (id: string) => {
      const nb = await getFollowers(id).then((f) => f.length)
      return nb
   }, [])

   React.useEffect(() => {
      if (!userData) return
      getNbFollowers(userData.id).then((nb) => setNbFollowers(nb))
      getNbFollowing(userData.id).then((nb) => setNbFollowing(nb))
      getNbPosts(userData.id).then((nb) => setNbPosts(nb))
   }, [userData, getNbFollowers, getNbFollowing])

   const info = React.useMemo(
      () => [
         { name: "posts", value: nbPosts, to: "#" },
         { name: "following", value: nbFollowing, to: `/following/${userData?.id}` },
         { name: "followers", value: nbFollowers, to: `/followers/${userData?.id}` }
      ],
      [nbPosts, nbFollowers, nbFollowing, userData]
   )

   const [avatar, setAvatar] = React.useState<File>()
   const avatarRef = React.useRef<HTMLInputElement>(null)

   const handleAvatarUpload = async () => {
      try {
         const storage = getStorage()
         const storageRef = ref(storage, `avatars/${userData?.id}/image${avatar?.name}`)
         const uploadTask = uploadBytesResumable(storageRef, avatar as Blob)
         await uploadTask
         const url = await getDownloadURL(storageRef)
         const docSnap = await getDoc(doc(db, "users", userData?.id as string))
         if (!docSnap.exists()) throw new Error("User not found")
         await updateDoc(docSnap.ref, { avatar: url })
      } catch (error) {
         console.error("Error uploading avatar: ", error)
      }
   }

   React.useEffect(() => {
      if (!avatar) return
      handleAvatarUpload()
   }, [avatar])

   return (
      <Card className="">
         <Input type="file" className="hidden" ref={avatarRef} onChange={(e) => setAvatar(e.target.files?.[0])} />
         <CardHeader className="relative flex flex-row items-center gap-x-10">
            {!other && <BoltIcon className="absolute right-2 top-2" onClick={() => navigate("/settings")} />}
            <Avatar className="h-16 w-16" onClick={() => avatarRef.current?.click()}>
               <AvatarImage
                  className="object-cover"
                  src={
                     avatar
                        ? URL.createObjectURL(avatar)
                        : userData?.avatar
                          ? userData.avatar
                          : "https://github.com/shadcn.png"
                  }
               />
            </Avatar>
            <div className="flex gap-x-4">
               {info.map(({ name, value, to }, index) => (
                  <div onClick={() => navigate(to)} key={index} className="flex flex-col items-center">
                     <CardTitle>{value}</CardTitle>
                     <CardDescription>{name.replace(/^./, (match) => match.toUpperCase())}</CardDescription>
                  </div>
               ))}
            </div>
         </CardHeader>
         <CardContent className="space-y-1">
            <CardTitle>{userData?.name}</CardTitle>
            <p className="text-sm italic">@{userData?.username}</p>
            <CardDescription>{userData?.bio}</CardDescription>
         </CardContent>

         {other ? (
            <CardFooter className="space-x-2">
               {!isFollowing ? (
                  <Button onClick={follow} className="w-full">
                     Follow
                  </Button>
               ) : (
                  <Button variant="secondary" onClick={follow} className="w-full">
                     Unfollow
                  </Button>
               )}
               <Button variant="outline" onClick={() => navigate(`/messages/${userData?.id}`)} className="w-full">
                  Message
               </Button>
            </CardFooter>
         ) : (
            <CardFooter>
               <Button onClick={() => navigate("/profile/edit")} className="w-full">
                  Edit Profile
               </Button>
            </CardFooter>
         )}
      </Card>
   )
}

export default ProfileCard
