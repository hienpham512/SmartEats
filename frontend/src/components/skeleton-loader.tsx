import React from "react"
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface SkeletonLoaderProps {
   variant: "card" | "list" | "image" | "imageGrid" | "cardGrid" | "profile"
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant }) => {
   switch (variant) {
      case "card":
         return <CardSkeleton />
      case "image":
         return <ImageSkeleton />
      case "cardGrid":
         return <CardGridSkeleton />
      case "imageGrid":
         return <ImageGridSkeleton />
      case "profile":
         return <ProfileSkeleton />
   }
   return null
}

export default SkeletonLoader

const ProfileSkeleton: React.FC = () => {
   return (
      <div className="space-y-4">
         <Card className="">
            <CardHeader className="flex flex-row items-center justify-between gap-x-10">
               <Skeleton className="h-16 w-16 rounded-full" />
               <div className="flex gap-x-5">
                  {["posts", "following", "followers"].map((name, index) => (
                     <div key={index} className="flex flex-col items-center">
                        <Skeleton className="h-4 w-8" />
                        <CardDescription>{name}</CardDescription>
                     </div>
                  ))}
               </div>
            </CardHeader>
            <CardContent className="space-y-1">
               <Skeleton className="h-4 w-24" />
               <span className="flex items-center gap-x-2">
                  @ <Skeleton className="h-4 w-16" />
               </span>
               <Skeleton className="h-12 w-36" />
            </CardContent>
         </Card>
         <Card>
            <CardContent className="grid grid-cols-3 gap-1.5 p-3">
               {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="relative">
                     <Skeleton className="h-28 w-28 rounded-xl" />
                  </div>
               ))}
            </CardContent>
         </Card>
      </div>
   )
}

const CardSkeleton: React.FC = () => {
   return (
      <Card>
         <CardHeader className="-m-6">
            <Skeleton className="h-56 w-full" />
         </CardHeader>
         <CardContent className="space-y-4 px-3.5 pt-4">
            <div className="space-y-1.5">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton className="h-2 w-1/2" key={index} />
               ))}
            </div>
            <div className="space-y-1.5">
               {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton className="h-2 w-3/4" key={index} />
               ))}
            </div>
         </CardContent>
      </Card>
   )
}
const CardGridSkeleton: React.FC = () => {
   return (
      <div className="grid grid-cols-1 gap-4">
         {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
         ))}
      </div>
   )
}

const ImageSkeleton: React.FC = () => {
   return <Skeleton className="h-28 w-36 rounded-xl" />
}

const ImageGridSkeleton: React.FC = () => {
   return (
      <Card className="grid w-full grid-cols-3 gap-2.5 p-3">
         {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton className="h-24 rounded-xl" key={index} />
         ))}
      </Card>
   )
}
