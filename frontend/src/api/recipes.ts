import config from "@/lib/config"
import { IRecipe, IRecipes, IRecipesRequestParams } from "@hienpham512/smarteats"
import axios from "axios"

const baseUrl = `${config.backend.url}/recipes`

const getRecipes = async (params: IRecipesRequestParams, token: string): Promise<IRecipes | null> => {
   console.log("getRecipes", params, baseUrl)
   try {
      const response = await axios.get(baseUrl, {
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

const getRecipe = async (id: string, token: string): Promise<IRecipe | null> => {
   try {
      const response = await axios.get(`${baseUrl}/${id}`, {
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      return null
   }
}

const getRecipeWithFilters = async (params: IRecipesRequestParams, token: string): Promise<IRecipes | null> => {
   try {
      const response = await axios.get(baseUrl, {
         params,
         headers: {
            Authorization: `Bearer ${token}`
         }
      })
      return response.data
   } catch (error) {
      console.log(error)
      return null
   }
}

export { getRecipes, getRecipe, getRecipeWithFilters }
