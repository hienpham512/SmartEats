import SkeletonLoader from "@/components/skeleton-loader"
import useUserStore from "@/store/user"
import React, { Suspense } from "react"
import { useParams } from "react-router-dom"
import Posts from "./components/posts-display"
import ProfileCard from "./components/profile-card"

const Profile: React.FC = () => {
   const { userData, getOtherUserData, other } = useUserStore()
   const { id } = useParams()

   if (userData?.id === id) {
      window.location.href = `${window.location.origin}/profile`
      return null
   }

   if (id) {
      getOtherUserData(id)
      const data = other.find((user) => user.id === id)
      if (!data) return <SkeletonLoader variant="profile" />
      return (
         <Suspense fallback={<SkeletonLoader variant="profile" />}>
            <ProfileCard userData={data} other />
            <Posts id={id} />
         </Suspense>
      )
   }

   return (
      <div className="space-y-4">
         <ProfileCard userData={userData} />
         <Posts />
      </div>
   )
}

export default Profile
