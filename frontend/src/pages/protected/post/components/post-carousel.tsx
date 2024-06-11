import React from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { CircleIcon } from "lucide-react"

interface IPostCarouselProps {
   images: string[]
}

const PostCarousel: React.FC<IPostCarouselProps> = ({ images }) => {
   const [api, setApi] = React.useState<CarouselApi>()
   const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0)

   React.useEffect(() => {
      if (!api) return
      api.on("select", () => {
         setSelectedImageIndex(api.selectedScrollSnap())
      })
   }, [api])

   if (!images || images.length === 0) return null
   return (
      <Carousel setApi={setApi} className="-mx-3">
         <CarouselContent className="relative">
            {images.map((image, index) => (
               <CarouselItem key={index}>
                  <img src={image} alt="post" className="h-96 w-full object-cover" />
               </CarouselItem>
            ))}
         </CarouselContent>
         {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 mx-auto flex w-max items-center justify-center gap-x-1 rounded-full px-4 backdrop-blur-3xl">
               {images.map((_, index) => (
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
   )
}

export default PostCarousel
