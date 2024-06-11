import { getExercisesByBodyPart, getExercisesByTarget } from "@/api/exercises"
import SkeletonLoader from "@/components/skeleton-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useExercisesStore from "@/store/exercises"
import useUserStore from "@/store/user"
import { BodyPart, IExercise, Target } from "@hienpham512/smarteats"
import { BookmarkIcon, RefreshCwIcon } from "lucide-react"
import React from "react"
import CustomSelect from "../subComponents/custom-select"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

const Routine: React.FC = () => {
   const { user } = useUserStore()
   const { exercises, isExercisesLoading, lastSynced, fetchExercises } = useExercisesStore()

   React.useEffect(() => {
      if (
         exercises &&
         exercises.length !== 0 &&
         lastSynced &&
         new Date().getTime() - new Date(lastSynced).getTime() < 1000 * 60 * 60 * 24
      )
         return
      fetchExercises(user!.accessToken)
   }, [])
   if (isExercisesLoading) return <SkeletonLoader variant="cardGrid" />

   return (
      <>
         <RoutineSearchSheet />
         <div className="grid grid-cols-1 gap-y-8 pt-6">
            {exercises.map((exercise, index) => (
               <RoutineCard key={index} exercise={exercise} />
            ))}
         </div>
      </>
   )
}

export default Routine

type IRoutineCard = {
   exercise: IExercise
   footer?: boolean
}
export const RoutineCard: React.FC<IRoutineCard> = ({ exercise, footer = true }) => {
   const bodyParts = [exercise.bodyPart, ...exercise.secondaryMuscles]
   const { user } = useUserStore()

   const handleSaveRoutine = async () => {
      await addDoc(collection(db, "savedRoutines"), {
         userId: user?.uid,
         exercise
      })
         .catch((error) => {
            console.error(error)
            toast({ title: `Failed to save`, duration: 1000 })
         })
         .finally(() => {
            toast({ title: `Routine saved`, duration: 1000 })
         })
   }
   return (
      <Card>
         <CardHeader className="-m-6">
            <div
               className="relative flex h-56 w-full rounded-xl rounded-b-none bg-white bg-contain bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${exercise.gifUrl})`
               }}
            >
               <Button
                  variant="ghost"
                  onClick={(e) => {
                     e.stopPropagation()
                     handleSaveRoutine()
                  }}
                  className="mb-2 ml-auto mt-auto"
               >
                  <BookmarkIcon color="#F97316" size={24} />
               </Button>
            </div>
         </CardHeader>
         <CardContent className="pt-6">
            <CardTitle className="line-clamp-1 text-start uppercase">{exercise.name.replace("-", " ")}</CardTitle>
            <div className="mt-4 flex flex-wrap gap-3">
               {bodyParts.map((bodyPart, index) => (
                  <Badge key={index} className="min-w-max">
                     {bodyPart}
                  </Badge>
               ))}
            </div>
         </CardContent>
         {footer && (
            <CardFooter>
               <div>
                  <ul className="space-y-2">
                     {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="list-disc text-start text-xs font-medium tracking-tighter">
                           {instruction}
                        </li>
                     ))}
                  </ul>
               </div>
            </CardFooter>
         )}
      </Card>
   )
}

const RoutineSearchSheet: React.FC = () => {
   const { user } = useUserStore()
   const [target, setTarget] = React.useState<Target | null>(null)
   const [bodyPart, setBodyPart] = React.useState<BodyPart | null>(null)

   const [targetRoutines, setTargetRoutines] = React.useState<IExercise[]>([])
   const [bodyPartRoutines, setBodyPartRoutines] = React.useState<IExercise[]>([])

   const handleSearchByTarget = async () => {
      try {
         await getExercisesByTarget(target!, user!.accessToken)
            .then((data) => setTargetRoutines(data))
            .catch((error) => {
               throw new Error(error)
            })
      } catch (error) {
         console.error(error)
      }
   }

   const handleTargetReset = () => {
      setTargetRoutines([])
      setTarget(null)
   }

   const handleSearchByBodyPart = async () => {
      try {
         await getExercisesByBodyPart(bodyPart!, user!.accessToken)
            .then((data) => setBodyPartRoutines(data))
            .catch((error) => {
               throw new Error(error)
            })
      } catch (error) {
         console.error(error)
      }
   }

   const handleBodyPartReset = () => {
      setBodyPartRoutines([])
      setBodyPart(null)
   }

   const searchTabContentProps: TSearchTabContent[] = [
      {
         value: "target",
         data: targetRoutines,
         handleReset: handleTargetReset,
         handleSelect: (value: unknown) => setTarget(value as Target),
         handleSearch: handleSearchByTarget,
         buttonLabel: "Search by target",
         placeholder: "Select target",
         customEnum: Target
      },
      {
         value: "part",
         data: bodyPartRoutines,
         handleReset: handleBodyPartReset,
         handleSelect: (value: unknown) => setBodyPart(value as BodyPart),
         handleSearch: handleSearchByBodyPart,
         buttonLabel: "Search by body part",
         placeholder: "Select body part",
         customEnum: BodyPart
      }
   ]

   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button variant="outline" asChild className="w-full justify-start">
               <p className="opacity-60">Search for a routine...</p>
            </Button>
         </SheetTrigger>
         <SheetContent className="w-full" side="bottom">
            <SheetHeader>
               <SheetTitle>Routine search</SheetTitle>
               <SheetDescription>Search for a routine by target or body part.</SheetDescription>
               <Tabs defaultValue="target">
                  <TabsList className="grid grid-cols-2">
                     <TabsTrigger value="target">Target</TabsTrigger>
                     <TabsTrigger value="part">Body part</TabsTrigger>
                  </TabsList>
                  {searchTabContentProps.map((props, index) => (
                     <SearchTabContent key={index} {...props} />
                  ))}
               </Tabs>
            </SheetHeader>
         </SheetContent>
      </Sheet>
   )
}
type TSearchTabContent = {
   value: "target" | "part"
   data: IExercise[]
   handleReset: () => void
   handleSelect: (value: string) => void
   handleSearch: () => Promise<void>
   buttonLabel: string
   placeholder: string
   customEnum: typeof Target | typeof BodyPart
}
const SearchTabContent: React.FC<TSearchTabContent> = ({
   value,
   data,
   handleReset,
   handleSelect,
   handleSearch,
   buttonLabel,
   placeholder,
   customEnum
}) => {
   return (
      <TabsContent value={value}>
         {data.length > 0 ? (
            <div className="overflow-y-scroll">
               <div className="h-[65vh] pt-2">
                  <Carousel>
                     <CarouselContent>
                        {data.map((exercie, index) => (
                           <CarouselItem className="basis-[90%]" key={index}>
                              <RoutineCard exercise={exercie} footer={true} />
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                  </Carousel>
               </div>
               <Button onClick={handleReset} className="absolute left-3 top-3">
                  <RefreshCwIcon size={16} />
               </Button>
            </div>
         ) : (
            <div className="space-y-3 pt-4">
               <CustomSelect
                  placeholder={placeholder}
                  customEnum={customEnum}
                  handleSelect={(value) => handleSelect(value)}
               />
               <Button className="w-full" onClick={handleSearch}>
                  {buttonLabel}
               </Button>
            </div>
         )}
      </TabsContent>
   )
}
