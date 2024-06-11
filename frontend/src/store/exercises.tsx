import { getExercises } from "@/api/exercises"
import { IExercise } from "@hienpham512/smarteats"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

type ExerciseStore = {
   exercises: IExercise[]
   isExercisesLoading: boolean
   lastSynced: Date | null
   fetchExercises: (token: string) => void
}

const useExercisesStore = create<ExerciseStore>()(
   devtools(
      persist(
         (set) => ({
            exercises: [],
            isExercisesLoading: true,
            lastSynced: null,
            fetchExercises: async (token: string) => {
               await getExercises(token).then((res) =>
                  set({ exercises: res, isExercisesLoading: false, lastSynced: new Date() })
               )
            }
         }),
         {
            name: "exercises"
         }
      )
   )
)

export default useExercisesStore
