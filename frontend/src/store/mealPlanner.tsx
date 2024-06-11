import { BMILevel, Gender } from "@hienpham512/smarteats"
import { create } from "zustand"
import useUserStore from "./user"
import { getBMI, getBMR, getIdealWeight } from "@/api/mealPlanner"

export type BMIResponse = {
   bmi: number
   bodyStatus: BMILevel
}

export type IdealWeightResponse = {
   min: number
   max: number
}

interface IMealPlannerStore {
   bmi: BMIResponse | null
   bmr: number | null
   idealWeight: IdealWeightResponse | null
   fetchUserHealthData: () => void
   isHealthDataLoading: boolean
}

const useMealPlannerStore = create<IMealPlannerStore>((set) => ({
   bmi: null,
   bmr: null,
   idealWeight: null,
   isHealthDataLoading: true,
   fetchUserHealthData: async () => {
      const accessToken = useUserStore.getState().user?.accessToken || ""
      const height = useUserStore.getState().userData?.height || 0
      const weight = useUserStore.getState().userData?.weight || 0
      const gender = (useUserStore.getState().userData?.gender as Gender) || ""
      const age = useUserStore.getState().userData?.age || 0

      const commonParams = {
         height: height,
         weight: weight
      }
      try {
         const bmi = await getBMI(commonParams, accessToken)

         const bmr = await getBMR({ ...commonParams, gender, age }, accessToken)

         const idealWeight = await getIdealWeight({ height }, accessToken)

         set({
            bmi: { bmi: Math.round(bmi.bmi), bodyStatus: BMILevel.Normal },
            bmr: Math.round(bmr),
            idealWeight: {
               min: Math.round(idealWeight.min),
               max: Math.round(idealWeight.max)
            },
            isHealthDataLoading: false
         })
      } catch (error) {
         console.log(error)
      }
   }
}))

export default useMealPlannerStore
