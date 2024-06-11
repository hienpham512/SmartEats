/* eslint-disable @typescript-eslint/no-unused-vars */
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
   ActivityLevel,
   BodyPart,
   Gender,
   IMealPlanRequestParams,
   IMealPlanner,
   TCuisineType,
   TDiet,
   TDishType,
   THealth,
   TMealType
} from "@hienpham512/smarteats"

import { getMealPLanner } from "@/api/mealPlanner"
import DisplayPlan from "@/components/display-plan"
import LoadingSpinner from "@/components/loading-spinner"
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { addDoc, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import React from "react"
import { toast } from "@/components/ui/use-toast"

const MakePlanner: React.FC = () => {
   const { user, userData } = useUserStore()
   const activityLevels = Object.keys(ActivityLevel).filter((key) => isNaN(Number(key))) as Array<
      keyof typeof ActivityLevel
   >

   const [activityLevel, setActivityLevel] = React.useState<keyof typeof ActivityLevel | null>(null)
   const [isWithExercises, setIsWithExercises] = React.useState<boolean>(false)
   const [isWithSnackTime, setIsWithSnackTime] = React.useState<boolean>(false)
   const timeDuration = React.useRef<HTMLInputElement>(null)
   const weightChange = React.useRef<HTMLInputElement>(null)
   const [cuisineType, setCuisineType] = React.useState<TCuisineType>()
   const [diet, setDiet] = React.useState<TDiet>()
   const [dishType, setDishType] = React.useState<TDishType>()
   const [health, setHealth] = React.useState<THealth>()
   const [mealType, setMealType] = React.useState<TMealType>()
   const [bodyPart, setBodyPart] = React.useState<BodyPart>()
   const excluded = React.useRef<HTMLInputElement>(null)
   const exercisesPerDay = React.useRef<HTMLInputElement>(null)

   const getPlannerParams = (): IMealPlanRequestParams => ({
      activityLevel: ActivityLevel[activityLevel as keyof typeof ActivityLevel],
      age: userData?.age as number,
      gender: userData?.gender as Gender,
      height: userData?.height as number,
      isWithExercises,
      isWithSnackTime,
      timeDuration: Number(timeDuration.current?.value) ?? undefined,
      weight: userData?.weight as number,
      weightChange: Number(weightChange.current?.value) ?? undefined,
      cuisineType,
      diet,
      dishType,
      excluded: excluded.current?.value ?? undefined,
      health,
      mealType,
      bodyParts: bodyPart,
      exercisesPerDay: Number(exercisesPerDay.current?.value) ?? undefined
   })

   const [plan, setPlan] = React.useState<IMealPlanner | null>(null)
   // const [plan, setPlan] = React.useState<IMealPlanner | null>(
   //    JSON.parse(localStorage.getItem("mealPlanner") || "null")
   // )
   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const handleMakePlanner = async () => {
      const plannerParams = getPlannerParams()
      if (!plannerParams.timeDuration || !plannerParams.weightChange) {
         toast({ title: "Please fill in all required fields", variant: "destructive", duration: 2000 })
         return
      }
      setIsLoading(true)
      const token = user?.accessToken as string
      await getMealPLanner(plannerParams, token)
         .then((res) => {
            setPlan(res)
            //set res to localStorage
            const mealPlanner = JSON.stringify(res)
            localStorage.setItem("mealPlanner", mealPlanner)
         })
         .catch((err) => {
            console.log(err)
         })
         .finally(() => {
            setIsLoading(false)
         })
   }

   const [isSaved, setIsSaved] = React.useState<boolean>(false)

   const handleSavePlan = async () => {
      setIsSaved(true)

      try {
         const q = query(collection(db, "mealPlanner"), where("userId", "==", user!.uid))

         const querySnapshot = await getDocs(q)

         let userDocRef

         if (!querySnapshot.empty) {
            userDocRef = doc(db, "mealPlanner", querySnapshot.docs[0].id)
         } else {
            userDocRef = await addDoc(collection(db, "mealPlanner"), {
               userId: user?.uid
            })
         }

         const dailyCollection = collection(db, "mealPlanner", userDocRef.id, planName)

         for (const dailyData of plan!.daily) {
            const dailyDataExercisesId = dailyData.exercises?.map(({ exercises }) => exercises.id)
            await addDoc(dailyCollection, {
               ...dailyData,
               status: {
                  meals: {
                     breakfast: "Pending",
                     lunch: "Pending",
                     dinner: "Pending",
                     snack: "Pending"
                  },
                  exercises:
                     dailyDataExercisesId?.reduce((acc, id) => {
                        return { ...acc, [id]: "Pending" }
                     }, {}) ?? {}
               }
            })
         }

         await updateDoc(userDocRef, {
            plans: arrayUnion({
               planName,
               createdAt: new Date(),
               weightChange: plan!.weightChange,
               nbWeeks: plan!.time,
               warning: plan?.warning ?? "",
               bmi: plan?.bmi,
               bmr: plan?.bmr,
               bodyStatus: plan?.bodyStatus
            })
         })

         if (plan?.warning) {
            toast({ title: `Warning: ${plan?.warning}`, variant: "destructive", duration: 2000 })
         }

         console.log("Plan saved with ID: ", userDocRef.id)
      } catch (error) {
         console.log("Error saving plan: ", error)
      } finally {
         setIsSaved(false)
         setPlanName("")
         setSavePlan(false)
         setPlan(null)
         toast({ title: `Planner Saved`, duration: 1000 })
      }
   }

   const [savePlan, setSavePlan] = React.useState<boolean>(false)

   const [planName, setPlanName] = React.useState<string>("")

   if (isLoading) return <LoadingSpinner />

   if (plan)
      return (
         <div>
            <>
               <AlertDialog open={savePlan}>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Save plan</AlertDialogTitle>
                        <AlertDialogDescription>
                           Please enter a name for the plan and click save.
                           <Input
                              value={planName}
                              onChange={(e) => setPlanName(e.target.value)}
                              placeholder="My plan 1"
                           />
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSavePlan(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSavePlan}>
                           {isSaved ? <LoadingSpinner /> : "Save plan"}
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </>
            <div className="my-4 grid grid-cols-2 gap-x-4">
               <Button className="w-full" onClick={() => setSavePlan(true)}>
                  {isSaved ? <LoadingSpinner /> : "Save Plan"}
               </Button>
               <Button className="w-full" onClick={() => setPlan(null)}>
                  Make new plan
               </Button>
            </div>
            <DisplayPlan plan={plan} />
         </div>
      )

   return (
      <div className="space-y-4 pb-40 pt-4">
         <Select onValueChange={(value) => setActivityLevel(value as keyof typeof ActivityLevel)}>
            <SelectTrigger className="w-full">
               <SelectValue placeholder="Activity level" />
            </SelectTrigger>
            <SelectContent>
               {activityLevels.map((item, index) => (
                  <SelectItem key={index} value={item}>
                     {item}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
         <Separator />
         <div className="grid grid-cols-2 gap-x-2">
            <div className="flex items-center space-x-2">
               <Switch
                  id="isWithExercises"
                  checked={isWithExercises}
                  onCheckedChange={(checked) => setIsWithExercises(checked)}
               />
               <Label htmlFor="isWithExercises">Include Exercises</Label>
            </div>
            <div className="flex items-center space-x-2">
               <Switch
                  id="isWithSnackTime"
                  checked={isWithSnackTime}
                  onCheckedChange={(checked) => setIsWithSnackTime(checked)}
               />
               <Label htmlFor="isWithSnackTime">Include Snack Time</Label>
            </div>
         </div>
         {isWithExercises && (
            <>
               <div className="grid gap-1.5">
                  <Label>Exercises per day</Label>
                  <Input type="number" placeholder="1-2-3-4" min={1} ref={exercisesPerDay} />
               </div>
               <CustomSelect
                  placeholder="Body Parts"
                  customEnum={BodyPart}
                  setValue={(value) => setBodyPart(value as BodyPart)}
               />
            </>
         )}
         <Separator />
         <div className="grid gap-1.5">
            <Label>Time duration (number of weeks) *</Label>
            <Input type="number" placeholder="1-2-3-4" min={1} ref={timeDuration} />
         </div>
         <Separator />
         <div className="grid gap-1.5">
            <Label>Weight change *</Label>
            <Input type="number" placeholder="-1.5, 2" ref={weightChange} />
         </div>
         <Separator />
         <CustomSelect
            placeholder="Cuisine Type"
            customEnum={TCuisineType}
            setValue={(value) => setCuisineType(value as TCuisineType)}
         />
         <Separator />
         <CustomSelect placeholder="Diet" customEnum={TDiet} setValue={(value) => setDiet(value as TDiet)} />
         <Separator />
         <CustomSelect
            placeholder="Dish Type"
            customEnum={TDishType}
            setValue={(value) => setDishType(value as TDishType)}
         />
         <Separator />
         <div className="grid gap-1.5">
            <Label>Allergies</Label>
            <Input type="text" placeholder="MSG, Peanut etc.." ref={excluded} />
         </div>
         <Separator />
         <CustomSelect placeholder="Health" customEnum={THealth} setValue={(value) => setHealth(value as THealth)} />
         <Separator />
         <CustomSelect
            placeholder="Meal Type"
            customEnum={TMealType}
            setValue={(value) => setMealType(value as TMealType)}
         />
         <Separator />
         <Button className="w-full" onClick={handleMakePlanner}>
            Make Planner
         </Button>
      </div>
   )
}

export default MakePlanner

type ICustomSelect = {
   placeholder: string
   customEnum:
      | typeof THealth
      | typeof TDishType
      | typeof TDiet
      | typeof TCuisineType
      | typeof BodyPart
      | typeof TMealType
   setValue?: (value: string) => void
}
const CustomSelect: React.FC<ICustomSelect> = ({ customEnum, placeholder, setValue }) => {
   const data = Object.values(customEnum)
   return (
      <Select onValueChange={setValue}>
         <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
         </SelectTrigger>
         <SelectContent>
            {data.map((item, index) => (
               <SelectItem key={index} value={item} className="capitalize">
                  {item}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}
