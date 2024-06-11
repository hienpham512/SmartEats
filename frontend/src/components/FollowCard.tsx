import { followUser, unfollowUser } from "@/api/user"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import useUserStore from "@/store/user"
import React from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage } from "./ui/avatar"

export const Fallback: React.FC<{
   length?: number
}> = ({ length = 7 }) => (
   <div className="flex flex-col gap-y-3">
      {Array.from({ length }).map((_, index) => (
         <Card key={index} className="flex items-center justify-between px-4 py-2">
            <div className="flex gap-x-4">
               <Skeleton className="h-16 w-16 rounded-full" />
               <div className="flex flex-col justify-center gap-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 w-24" />
               </div>
            </div>
            <Skeleton className="h-8 w-16" />
         </Card>
      ))}
   </div>
)

export const FollowCard: React.FC<{ userId: string }> = ({ userId }) => {
   const navigate = useNavigate()
   const { userData, other, getOtherUserData } = useUserStore()
   const user = React.useMemo(() => other.find((user) => user.id === userId), [other, userId])
   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   React.useEffect(() => {
      if (!user) getOtherUserData(userId)
   }, [userId])

   const isFollowing = React.useMemo(() => {
      if (!userData || !user || !user.followedBy) return false
      return user.followedBy.includes(userData.id)
   }, [user, userData])

   const follow = () => {
      if (!user) return console.error("No user data found")
      if (!userData) return console.error("No current user data found")
      setIsLoading(true)
      if (user.followedBy?.includes(userData.id)) {
         unfollowUser(userData.id, user.id).then(() => {
            toast({ title: `You have just unfollowed ${user.name}.` })
         })
      } else {
         followUser(userData.id, user.id).then(() => {
            toast({ title: `You have just started following ${user.name}.` })
         })
      }
      getOtherUserData(user.id).then(() => setIsLoading(false))
   }

   if (!user) return <Fallback length={1} />

   return (
      <Card className="flex items-center justify-between px-4 py-2" onClick={() => navigate(`/user/${user.id}`)}>
         <div className="flex items-center gap-x-4">
            <Avatar className="h-12 w-12">
               <AvatarImage src={user.avatar ?? "https://github.com/shadcn.png"} />
            </Avatar>
            <div className="grid justify-center">
               <p className="text-base font-semibold">{user.name}</p>
               <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
         </div>
         {!isLoading ? (
            <Button
               variant={!isFollowing ? "default" : "secondary"}
               onClick={(e) => {
                  e.stopPropagation()
                  follow()
               }}
            >
               {!isFollowing ? "Follow" : "Unfollow"}
            </Button>
         ) : (
            <Skeleton className="h-8 w-16" />
         )}
      </Card>
   )
}
