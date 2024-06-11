/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useMealPlannerStore from "@/store/mealPlanner"
import useUserStore from "@/store/user"
import React from "react"
import { useNavigate } from "react-router-dom"
import MakePlanner from "./components/makePlanner"
import SavedPlanners from "./components/savedPlanners"

const MealPlanner: React.FC = () => {
   const navigate = useNavigate()
   const { userData } = useUserStore()
   const { bmi, bmr, idealWeight, fetchUserHealthData, isHealthDataLoading } = useMealPlannerStore()
   const bmiUnit = "kg/m2"
   const bmrUnit = "kcal/day"
   const idealWeightUnit = "kg"

   React.useEffect(() => {
      fetchUserHealthData()
   }, [])

   const isUserProfileIncomplete = !userData?.age || !userData?.gender || !userData?.height || !userData?.weight

   if (isUserProfileIncomplete) {
      return (
         <AlertDialog defaultOpen>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Incomplete Profile</AlertDialogTitle>
                  <AlertDialogDescription>
                     Your profile information is incomplete. Please complete your profile to view your health data and
                     access Meal Planner.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => navigate(-1)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/profile/edit")}>Continue</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      )
   }
   if (isHealthDataLoading) return <LoadingSpinner />

   return (
      <Tabs defaultValue="saved_planner">
         <TabsList className="grid grid-cols-2">
            <TabsTrigger value="make_planner">Make planner</TabsTrigger>
            <TabsTrigger value="saved_planner">Saved planner</TabsTrigger>
         </TabsList>
         <TabsContent value="make_planner">
            <MakePlanner />
         </TabsContent>
         <TabsContent value="saved_planner">
            <SavedPlanners />
         </TabsContent>
      </Tabs>
   )
}

export default MealPlanner
