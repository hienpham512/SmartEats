import { fetchFoodData } from "@/api/food-detection"
import { getRecipes } from "@/api/recipes"
import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import useUserStore from "@/store/user"
import { IFoodDetected, IRecipe } from "@hienpham512/smarteats"
import { XIcon } from "lucide-react"
import React from "react"
import { RecipeCard } from "../library/components/recipes"

const FoodDetection: React.FC = () => {
   const { user } = useUserStore()
   const [fileData, setFileData] = React.useState<Uint8Array | null>(null)
   const fileInputRef = React.useRef<HTMLInputElement>(null)
   const takePhotoRef = React.useRef<HTMLInputElement>(null)
   const [isDetecting, setIsDetecting] = React.useState<boolean>(false)
   const [detectedData, setDetectedData] = React.useState<IFoodDetected[] | null>(null)

   const [error, setError] = React.useState<string | null>(null)

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0]
      if (!file) return

      const reader = new FileReader()

      reader.onload = () => {
         const arrayBuffer = reader.result as ArrayBuffer
         const uint8Array = new Uint8Array(arrayBuffer)
         setError(null)

         setFileData(uint8Array)
      }

      reader.readAsArrayBuffer(file)
   }

   const handleSubmit = () => {
      if (!fileData) return
      setIsDetecting(true)
      try {
         fetchFoodData(fileData, user!.accessToken)
            .then((response) => {
               if (!response) throw new Error("No response")
               setDetectedData(response.data as IFoodDetected[])
            })
            .finally(() => setIsDetecting(false))
      } catch (error) {
         console.log(error)
      }
   }
   const [bestMatch, setBestMatch] = React.useState<{
      label: string
      score: number
   } | null>()
   const [detectedFoodRecipes, setDetectedFoodRecipes] = React.useState<IRecipe[]>()

   React.useEffect(() => {
      if (!Array.isArray(detectedData) || detectedData.length === 0) {
         setError("Error, try again !")
         return
      }

      const bestMatch = detectedData.reduce(
         (acc, detected) => {
            if (detected.score > acc.score) return { score: detected.score, label: detected.label }
            return {
               score: acc.score,
               label: acc.label
            }
         },
         {
            score: 0,
            label: ""
         }
      )

      setBestMatch(bestMatch)

      const fetchRecipes = async () => {
         try {
            const response = await getRecipes({ q: bestMatch.label.replace("_", " ") }, user!.accessToken)
            setDetectedFoodRecipes(response?.hits)
         } catch (error) {
            console.error("Error fetching recipes: ", error)
            setError("Error, try again")
         }
      }

      fetchRecipes()
   }, [detectedData])

   const tryAgain = () => {
      setFileData(null)
      setDetectedData(null)
      setError(null)
   }

   if (!isDetecting && detectedData && detectedData.length > 0 && detectedFoodRecipes && fileData)
      return (
         <div className="space-y-8 overflow-y-scroll pb-16">
            <Card>
               <CardHeader className="-m-6">
                  <div
                     className="relative flex h-56 w-full rounded-xl rounded-b-none bg-cover bg-center bg-no-repeat"
                     style={{
                        backgroundImage: `url(${URL.createObjectURL(new Blob([fileData]))})`
                     }}
                  >
                     <img
                        src={URL.createObjectURL(new Blob([fileData]))}
                        alt="Uploaded file"
                        className="h-full w-full object-contain backdrop-blur-sm"
                     />
                     <Button
                        variant="ghost"
                        className="absolute right-0 top-0"
                        onClick={() => {
                           setFileData(null)
                           setDetectedData(null)
                           setError(null)
                        }}
                     >
                        <XIcon size={24} color="#000" />
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="pt-6">
                  <CardTitle className="capitalize">{bestMatch?.label.replace("_", " ")} detected</CardTitle>
               </CardContent>
            </Card>
            <div className="space-y-2">
               <CardTitle className="capitalize">
                  Recommended recipes for {bestMatch?.label.replace("_", " ")}
               </CardTitle>
               <Carousel>
                  <CarouselContent>
                     {detectedFoodRecipes.map((recipe, index) => (
                        <CarouselItem className="basis-[85%]">
                           <RecipeCard key={index} recipe={recipe} footer={false} />
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </Carousel>
            </div>
         </div>
      )

   return (
      <div className="flex">
         <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileChange} hidden ref={fileInputRef} />
         <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleFileChange}
            hidden
            ref={takePhotoRef}
            capture="environment"
         />
         <Card className="w-full">
            <CardHeader className={`${fileData ? "-m-6" : ""}`}>
               {fileData ? (
                  <div
                     className="relative flex h-56 w-full rounded-xl rounded-b-none bg-cover bg-center bg-no-repeat"
                     style={{
                        backgroundImage: `url(${URL.createObjectURL(new Blob([fileData]))})`
                     }}
                  >
                     <img
                        src={URL.createObjectURL(new Blob([fileData]))}
                        alt="Uploaded file"
                        className="h-full w-full object-contain backdrop-blur-sm"
                     />
                     <Button
                        variant="ghost"
                        className="absolute right-0 top-0"
                        onClick={() => {
                           setFileData(null)
                           setDetectedData(null)
                           setError(null)
                        }}
                     >
                        <XIcon size={24} color="#000" />
                     </Button>
                  </div>
               ) : (
                  <>
                     <CardTitle className="text-center">Food Detection</CardTitle>
                     <CardDescription className="text-center">Please upload an image to continute</CardDescription>
                  </>
               )}
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-y-2">
               {!fileData && (
                  <>
                     <Button onClick={() => fileInputRef.current?.click()}>Choose file</Button>
                     <CardDescription>OR</CardDescription>
                     <Button onClick={() => takePhotoRef.current?.click()}>Take a photo</Button>
                  </>
               )}
            </CardContent>
            <CardFooter>
               {fileData && !detectedData && (
                  <Button className="w-full" onClick={handleSubmit}>
                     {isDetecting ? <LoadingSpinner /> : "Detect"}
                  </Button>
               )}
               {error && (
                  <Button variant="outline" onClick={tryAgain} className="w-full text-center">
                     Reload and Detect
                  </Button>
               )}
            </CardFooter>
         </Card>
      </div>
   )
}

export default FoodDetection
