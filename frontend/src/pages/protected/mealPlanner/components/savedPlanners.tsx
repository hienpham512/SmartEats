import LoadingSpinner from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { Timestamp, collection, getDocs, query, where } from "firebase/firestore"
import { CircleCheckBig, CircleOff } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

type TPlan = {
   planName: string
   weightChange: number
   nbWeeks: number
   progress: number
   warning: string
   bmi: number
   bmr: number
   bodyStatus: string
   createdAt?: Timestamp
}

const SavedPlanners: React.FC = () => {
   const { user } = useUserStore()
   const [plans, setPlans] = React.useState<TPlan[]>([])

   React.useEffect(() => {
      ;(async () => {
         try {
            const q = query(collection(db, "mealPlanner"), where("userId", "==", user?.uid))
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
               setPlans([])
               return
            }

            const userDoc = querySnapshot.docs[0]
            const plans = userDoc.data().plans
            setPlans(plans)
         } catch (error) {
            console.error("Error getting plans: ", error)
            return []
         }
      })()
   }, [])

   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const [allPlans, setAllPlans] = React.useState([])

   React.useEffect(() => {
      ;(async () => {
         setIsLoading(true)
         const q = query(collection(db, "mealPlanner"), where("userId", "==", user?.uid))
         const querySnapshot = await getDocs(q)

         if (querySnapshot.empty) {
            setAllPlans([])
            setIsLoading(false)
            return
         }

         const userDoc = querySnapshot.docs[0]
         const plans = userDoc.data().plans

         for (const plan of plans) {
            const subcollectionRef = collection(db, "mealPlanner", userDoc.id, plan.planName as string)
            const subcollectionSnapshot = await getDocs(subcollectionRef)
            const planData = subcollectionSnapshot.docs.map((doc) => doc.data().status)
            // @ts-expect-error - I know what I'm doing
            setAllPlans((prev) => [
               ...prev,
               {
                  planName: plan.planName,
                  status: [...planData]
               }
            ])
         }
         setIsLoading(false)
      })()
   }, [])

   if (isLoading) {
      return <LoadingSpinner />
   }
   if (plans.length === 0 || !plans) {
      return (
         <div className="flex h-96 items-center justify-center">
            <CardDescription>You don't have any saved planners yet</CardDescription>
         </div>
      )
   }
   return (
      <div className="space-y-5 pt-5">
         {plans.map((plan, index) => {
            const { planName, weightChange, nbWeeks, warning, bmi, bmr, bodyStatus, createdAt } = plan

            // @ts-expect-error - I know what I'm doing
            const statusArray = allPlans.find((p) => p.planName === planName).status
            // @ts-expect-error - I know what I'm doing
            const allStatus = statusArray.map(({ meals, exercises }) => {
               return [...Object.values(meals), ...Object.values(exercises)]
            })

            const statuses = allStatus.flat()
            const total = statuses.length
            // @ts-expect-error - I know what I'm doing
            const completed = statuses.filter((status) => status === "Done" || status === "Skip").length
            const progress = (completed / total) * 100

            return (
               <>
                  <PlanCard
                     key={index}
                     {...{
                        planName,
                        weightChange,
                        nbWeeks,
                        warning,
                        bmi,
                        bmr,
                        bodyStatus,
                        createdAt
                     }}
                     progress={progress}
                  />
               </>
            )
         })}
      </div>
   )
}

export default SavedPlanners

const PlanCard: React.FC<TPlan> = ({ planName, progress, weightChange, nbWeeks, bmi, bmr, createdAt }) => {
   const navigate = useNavigate()
   const handlePlanClick = () => {
      return navigate(`/meal-planner/${planName}`)
   }
   return (
      <Card onClick={handlePlanClick} className="-mx-4 rounded-2xl">
         <CardHeader className="flex flex-row items-center gap-4">
            <CardTitle className="text-nowrap capitalize">{planName}</CardTitle>
            <Progress value={progress} className="h-2.5" />
            {progress === 100 ? (
               <CircleCheckBig className="h-8 w-8 text-green-500" />
            ) : (
               <CircleOff className="h-8 w-8 text-red-500" />
            )}
         </CardHeader>
         <Separator />
         <CardContent className="relative">
            <div className="-mx-3 mb-3 mt-5 flex flex-row flex-wrap justify-between">
               <Badge variant="destructive">{weightChange}kg</Badge>
               <Badge>{nbWeeks} week</Badge>
               <Badge>
                  BMI {Math.round(bmi)}kg/m<sup>2</sup>
               </Badge>
               <Badge>BMR {Math.round(bmr)}J/s</Badge>
            </div>
            <p className="absolute bottom-1 right-2 text-[10px]">
               {createdAt!.toDate().toLocaleDateString("us", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
               })}
            </p>
         </CardContent>
      </Card>
   )
}
