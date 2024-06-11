import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import { RecipeCard } from "@/pages/protected/library/components/recipes"
import { RoutineCard } from "@/pages/protected/library/components/routine"
import { DailyTaskStatus, IMealPlanDaily, IMealPlanner } from "@hienpham512/smarteats"
import { doc, updateDoc } from "firebase/firestore"
import { BanIcon, CircleCheckBig, CircleOff } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"

interface IDisplayPlan {
   plan: Partial<IMealPlanner>
   inShowPlan?: boolean
   docIds?: {
      day: number
      id: string
   }[]
   planName?: string
   parentDocId?: string
}

const DisplayPlan: React.FC<IDisplayPlan> = ({ plan, inShowPlan = false, docIds, planName = "", parentDocId = "" }) => {
   const { daily } = plan
   return (
      <div className="pb-40">
         {daily!.map((plan) => {
            return (
               <MealPlan
                  key={plan.day}
                  plan={plan}
                  inShowPlan={inShowPlan}
                  docId={docIds?.find((doc) => doc.day === plan.day)?.id}
                  planName={planName as string}
                  parentDocId={parentDocId}
               />
            )
         })}
      </div>
   )
}

export default DisplayPlan

const MealPlan: React.FC<{
   plan: IMealPlanDaily
   inShowPlan?: boolean
   docId?: string
   planName?: string
   parentDocId?: string
}> = ({ plan, inShowPlan = false, docId = "", planName = "", parentDocId = "" }) => {
   const [cachedPlan, setCachedPlan] = React.useState<IMealPlanDaily>(plan)

   const handleStatusChange = async (key: string, checked?: boolean, status?: DailyTaskStatus) => {
      const newStatus = status ? "Skip" : checked ? "Done" : "Pending"

      setCachedPlan(
         (prev) =>
            ({
               ...prev,
               status: {
                  ...prev.status,
                  meals: {
                     ...prev.status?.meals,
                     [key]: newStatus
                  }
               }
            }) as IMealPlanDaily
      )

      // Update the document in Firebase
      const docRef = doc(db, "mealPlanner", parentDocId, planName, docId)
      await updateDoc(docRef, { [`status.meals.${key}`]: newStatus })
   }

   const handleExerciseStatusChange = async (id: string, checked?: boolean, status?: DailyTaskStatus) => {
      const newStatus = status ? "Skip" : checked ? "Done" : "Pending"

      setCachedPlan(
         (prev) =>
            ({
               ...prev,
               status: {
                  ...prev.status,
                  exercises: {
                     ...prev.status?.exercises,
                     [id]: newStatus
                  }
               }
            }) as IMealPlanDaily
      )

      // Update the document in Firebase
      const docRef = doc(db, "mealPlanner", parentDocId, planName, docId)
      await updateDoc(docRef, { [`status.exercises.${id}`]: newStatus })
   }

   const allDone = !["meals", "exercises"].some(
      (category) =>
         // @ts-expect-error - I know what I'm doing
         cachedPlan.status?.[category] &&
         // @ts-expect-error - I know what I'm doing
         Object.values(cachedPlan.status[category]).some((status) => status === "Pending")
   )

   return (
      <Accordion defaultValue={["day-1"]} type="multiple">
         <AccordionItem value={`day-${plan.day}`}>
            <AccordionTrigger onClick={(e) => e.stopPropagation()}>
               <div className="flex w-full items-center gap-x-5">
                  <h1 className="ml-2 text-nowrap text-start font-bold">Day {plan.day}</h1>
                  <div
                     className={`mr-4 flex w-full ${
                        inShowPlan ? "justify-between" : "justify-end"
                     } items-center gap-x-2`}
                  >
                     {inShowPlan &&
                        (allDone ? (
                           <CircleCheckBig className="text-green-500" />
                        ) : (
                           <CircleOff className="text-red-500" />
                        ))}
                     <Badge className="w-max text-xs" variant="default">
                        Intake {Math.round(plan.dailyCaloriesIntake)}kcal
                     </Badge>
                     <Badge className="w-max text-xs" variant="destructive">
                        Burn {Math.round(plan.dailyCaloriesToBurn)}kcal
                     </Badge>
                  </div>
               </div>
            </AccordionTrigger>
            <AccordionContent>
               <Tabs defaultValue="recipes">
                  <TabsList className="grid grid-cols-2">
                     <TabsTrigger value="recipes">Recipes</TabsTrigger>
                     {plan.exercises && <TabsTrigger value="exercises">Exercises</TabsTrigger>}
                  </TabsList>
                  <TabsContent value="recipes">
                     <Carousel className="mt-5">
                        <CarouselContent>
                           {Object.entries(plan.meals).map(([key, value], index) => (
                              <CarouselItem className="basis-[85%]" key={index}>
                                 <h3 className="mb-1 ml-1 text-base font-medium capitalize">{key}</h3>
                                 <div className="relative">
                                    {inShowPlan && (
                                       <>
                                          <Switch
                                             className="absolute inset-x-2 inset-y-4 z-50"
                                             // @ts-expect-error - I know what I'm doing
                                             checked={cachedPlan.status?.meals[key] === "Done"}
                                             onCheckedChange={(checked) => {
                                                handleStatusChange(key, checked)
                                             }}
                                          />
                                          <Button
                                             className="absolute inset-y-2 right-2 z-50 h-8 w-8 p-0"
                                             // @ts-expect-error - I know what I'm doing
                                             disabled={cachedPlan.status?.meals[key] === "Done"}
                                             variant={
                                                // @ts-expect-error - I know what I'm doing
                                                cachedPlan.status?.meals[key] === "Done" ? "secondary" : "default"
                                             }
                                             onClick={() => {
                                                handleStatusChange(
                                                   key,
                                                   // @ts-expect-error - I know what I'm doing
                                                   cachedPlan.status?.meals[key],
                                                   DailyTaskStatus.Skip
                                                )
                                             }}
                                          >
                                             <BanIcon className="h-4" />
                                          </Button>
                                          <Badge
                                             className="absolute right-2 top-48 z-50 text-xs"
                                             variant={
                                                // @ts-expect-error - I know what I'm doing
                                                cachedPlan.status?.meals[key] === "Done"
                                                   ? "default"
                                                   : // @ts-expect-error - I know what I'm doing
                                                     cachedPlan.status?.meals[key] === "Skip"
                                                     ? "destructive"
                                                     : "secondary"
                                             }
                                          >
                                             {/* @ts-expect-error - I know what I'm doing */}
                                             {cachedPlan.status?.meals[key] === "Done"
                                                ? "Done"
                                                : // @ts-expect-error - I know what I'm doing
                                                  cachedPlan.status?.meals[key] === "Skip"
                                                  ? "Skipped"
                                                  : "Pending"}
                                          </Badge>
                                       </>
                                    )}
                                    <RecipeCard key={index} recipe={value.recipe} footer={false} />
                                 </div>
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                     </Carousel>
                  </TabsContent>
                  {plan.exercises && (
                     <TabsContent value="exercises">
                        <Carousel className="mt-5">
                           <CarouselContent>
                              {plan.exercises.map((exercise, index: number) => (
                                 <CarouselItem className="basis-[85%]" key={index}>
                                    <div className="relative">
                                       {inShowPlan && (
                                          <>
                                             <Switch
                                                className="absolute inset-x-2 inset-y-4 z-50"
                                                // @ts-expect-error - I know what I'm doing
                                                checked={cachedPlan.status?.exercises[exercise.exercises.id] === "Done"}
                                                onCheckedChange={(checked) => {
                                                   handleExerciseStatusChange(exercise.exercises.id, checked)
                                                }}
                                             />
                                             <Button
                                                className="absolute inset-y-2 right-2 z-50 h-8 w-8 p-0"
                                                disabled={
                                                   // @ts-expect-error - I know what I'm doing
                                                   cachedPlan.status?.exercises[exercise.exercises.id] === "Done"
                                                }
                                                variant={
                                                   // @ts-expect-error - I know what I'm doing
                                                   cachedPlan.status?.exercises[exercise.exercises.id] === "Done"
                                                      ? "secondary"
                                                      : "default"
                                                }
                                                onClick={() => {
                                                   handleExerciseStatusChange(
                                                      exercise.exercises.id,
                                                      // @ts-expect-error - I know what I'm doing
                                                      cachedPlan.status?.exercises[exercise.exercises.id],
                                                      DailyTaskStatus.Skip
                                                   )
                                                }}
                                             >
                                                <BanIcon className="h-4" />
                                             </Button>
                                             <Badge
                                                className="absolute left-2 top-48 z-50 text-xs"
                                                variant={
                                                   // @ts-expect-error - I know what I'm doing
                                                   cachedPlan.status?.exercises[exercise.exercises.id] === "Done"
                                                      ? "default"
                                                      : // @ts-expect-error - I know what I'm doing
                                                        cachedPlan.status?.exercises[exercise.exercises.id] === "Skip"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                             >
                                                {/* @ts-expect-error - I know what I'm doing */}
                                                {cachedPlan.status?.exercises[exercise.exercises.id] === "Done"
                                                   ? "Done"
                                                   : // @ts-expect-error - I know what I'm doing
                                                     cachedPlan.status?.exercises[exercise.exercises.id] === "Skip"
                                                     ? "Skipped"
                                                     : "Pending"}
                                             </Badge>
                                          </>
                                       )}
                                       <RoutineCard key={index} exercise={exercise.exercises} footer={false} />
                                    </div>
                                 </CarouselItem>
                              ))}
                           </CarouselContent>
                        </Carousel>
                     </TabsContent>
                  )}
               </Tabs>
            </AccordionContent>
         </AccordionItem>
      </Accordion>
   )
}
