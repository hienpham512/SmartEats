import DisplayPlan from "@/components/display-plan"
import LoadingSpinner from "@/components/loading-spinner"
import { CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { IMealPlanDaily } from "@hienpham512/smarteats"
import { collection, getDocs, query, where } from "firebase/firestore"
import React from "react"
import { useParams } from "react-router-dom"

type TPlan = {
   plan: {
      daily: IMealPlanDaily[]
   }
}

const MealPlan: React.FC = () => {
   const { planName } = useParams<{ planName: string }>()
   const { user } = useUserStore()
   const [plan, setPlan] = React.useState<TPlan>({} as TPlan)
   const [isLoading, setIsLoading] = React.useState<boolean>(true)
   const [docIds, setDocIds] = React.useState<
      {
         day: number
         id: string
      }[]
   >()
   const [parentDocId, setParentDocId] = React.useState<string>("")
   React.useEffect(() => {
      ;(async () => {
         setIsLoading(true)
         const q = query(collection(db, "mealPlanner"), where("userId", "==", user?.uid))

         const querySnapshot = await getDocs(q)

         if (querySnapshot.empty) return

         const userDoc = querySnapshot.docs[0]
         setParentDocId(userDoc.id)
         const subcollectionRef = collection(db, "mealPlanner", userDoc.id, planName as string)

         // Fetch all the documents from the subcollection
         const subcollectionSnapshot = await getDocs(subcollectionRef)
         setDocIds(
            subcollectionSnapshot.docs
               .map((doc) => {
                  const data = doc.data() as IMealPlanDaily
                  return { day: data.day, id: doc.id }
               })
               .sort((a, b) => a.day - b.day)
         )
         setPlan({
            plan: {
               daily: subcollectionSnapshot.docs
                  .map((doc) => {
                     const data = doc.data() as IMealPlanDaily
                     const sortedMeals = Object.entries(data.meals)
                        .sort(([mealNameA], [mealNameB]) => {
                           const order = ["breakfast", "snack", "lunch", "dinner"]
                           return order.indexOf(mealNameA) - order.indexOf(mealNameB)
                        })
                        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
                     return { ...data, meals: sortedMeals }
                  })
                  .sort((a, b) => a.day - b.day) as IMealPlanDaily[]
            }
         })
         setIsLoading(false)
      })()
   }, [])
   if (isLoading) return <LoadingSpinner />
   return (
      <div className="">
         <CardTitle className="text-xl capitalize">{planName}</CardTitle>
         <Separator className="my-2" />
         <DisplayPlan plan={plan.plan} inShowPlan docIds={docIds} planName={planName} parentDocId={parentDocId} />
      </div>
   )
}

export default MealPlan
