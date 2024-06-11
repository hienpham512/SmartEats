import config from "@/lib/config"
import { IExercise } from "@hienpham512/smarteats"
import type { BodyPart, Equipment, Target } from "@hienpham512/smarteats"
import axios from "axios"

const baseUrl = `${config.backend.url}/exercises`

const getExercises = async (token: string): Promise<IExercise[]> => {
   try {
      const response = await axios.get(baseUrl, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return []
   }
}

const getExercisesByBodyPart = async (bodyPart: BodyPart, token: string): Promise<IExercise[]> => {
   try {
      const response = await axios.get(`${baseUrl}/body-part/${bodyPart}`, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return []
   }
}

const getExercisesByEquipment = async (equipment: Equipment, token: string): Promise<IExercise[]> => {
   try {
      const response = await axios.get(`${baseUrl}/equipment/${equipment}`, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return []
   }
}

const getExercisesByTarget = async (target: Target, token: string): Promise<IExercise[]> => {
   try {
      const response = await axios.get(`${baseUrl}/target/${target}`, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return []
   }
}

const getExercisesByName = async (name: string, token: string): Promise<IExercise[]> => {
   try {
      const response = await axios.get(`${baseUrl}/name/${name}`, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return []
   }
}

export { getExercises, getExercisesByBodyPart, getExercisesByEquipment, getExercisesByTarget, getExercisesByName }
