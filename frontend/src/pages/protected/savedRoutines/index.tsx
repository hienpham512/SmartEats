import LoadingSpinner from "@/components/loading-spinner"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { type IExercise } from "@hienpham512/smarteats"
import { collection, getDocs, query, where } from "firebase/firestore"
import React from "react"
import { RoutineCard } from "../library/components/routine"

type TRoutine = {
   exercise: IExercise
   userId: string
}

const SavedRoutines: React.FC = () => {
   const [allSavedRoutines, setAllSavedRoutines] = React.useState<TRoutine[]>([] as TRoutine[])
   const [isRoutinesLoading, setIsRoutinesLoading] = React.useState<boolean>(true)
   const { user } = useUserStore()

   React.useEffect(() => {
      ;(async () => {
         setIsRoutinesLoading(true)

         const q = query(collection(db, "savedRoutines"), where("userId", "==", user?.uid))
         const querySnapshot = await getDocs(q)

         setAllSavedRoutines(querySnapshot.docs.map((doc) => doc.data() as TRoutine))

         setIsRoutinesLoading(false)
      })()
   }, [])

   if (isRoutinesLoading) return <LoadingSpinner />
   return (
      <div className="-mx-5">
         <CardHeader>
            <CardTitle>Saved Routines</CardTitle>
         </CardHeader>
         <CardContent>
            {allSavedRoutines.map(({ exercise }, index) => (
               <RoutineCard key={index} exercise={exercise} />
            ))}
         </CardContent>
      </div>
   )
}

export default SavedRoutines
