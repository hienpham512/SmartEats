import config from "@/lib/config"
import { DailyTaskStatus, Gender, IMealPlanRequestParams, IMealPlanner } from "@hienpham512/smarteats"
import axios from "axios"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const baseUrl = `${config.backend.url}`

const getBMI = async (params: { height: number; weight: number }, token: string) => {
   try {
      const response = await axios.get(`${baseUrl}/bmi`, {
         params,
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return null
   }
}

const getBMR = async (params: { height: number; weight: number; gender: Gender; age: number }, token: string) => {
   try {
      const response = await axios.get(`${baseUrl}/bmr`, {
         params,
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return null
   }
}

const getIdealWeight = async (params: { height: number }, token: string) => {
   try {
      const response = await axios.get(`${baseUrl}/ideal-weight`, {
         params,
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return null
   }
}

const getMealPLanner = async (params: IMealPlanRequestParams, token: string) => {
   try {
      const response = await axios.get(`${baseUrl}/meal-planner`, {
         params,
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return null
   }
}

const fetchUserMealPlanner = async (userId: string) => {
   try {
      const docRef = doc(db, "meal-planners", userId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) return docSnap.data() as IMealPlanner
      else return null
   } catch (error) {
      return null
   }
}

const setMealPlanner = async (userId: string, mealPlanner: IMealPlanner) => {
   try {
      await setDoc(doc(db, "meal-planners", userId), {
         ...mealPlanner,
         createdAt: new Date(),
         updatedAt: new Date(),
         userId
      })
   } catch (error) {
      return null
   }
}

const updatedMealPlanner = async (
   userId: string,
   day: number,
   status: {
      meals: {
         breakfast: DailyTaskStatus
         lunch: DailyTaskStatus
         diner: DailyTaskStatus
         snack: DailyTaskStatus
      }
      exercises: DailyTaskStatus[]
   }
) => {
   try {
      const mealPlannerRef = doc(db, "meal-planners", userId)
      const mealPlannerSnap = await getDoc(mealPlannerRef)

      if (mealPlannerSnap.exists()) {
         const mealPlanner = mealPlannerSnap.data() as IMealPlanner

         const now = new Date()

         const daily = mealPlanner.daily.map((dai) => {
            if (dai.day === day) {
               return {
                  ...dai,
                  status: status,
                  updatedAt: now
               }
            } else {
               return dai
            }
         })

         setDoc(mealPlannerRef, { daily, updatedAt: now }, { merge: true })
         return {
            ...mealPlanner,
            daily,
            updatedAt: now
         }
      }

      return null
   } catch (error) {
      return null
   }
}

export { getBMI, getBMR, getIdealWeight, getMealPLanner, fetchUserMealPlanner, setMealPlanner, updatedMealPlanner }
