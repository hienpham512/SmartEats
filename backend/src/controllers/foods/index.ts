import { type Request, type Response } from 'express'
import config from '../../config'
import axios from 'axios'
import { type IFoodHint, type IFoods, type IFoodsRequestParams } from '@hienpham512/smarteats'
import { filterUniqueFoods, getNextPageParam } from './helper'

const apiKey = config.services.recipes.apiKeyFoodDatabase
const apiId = config.services.recipes.apiIdFoodDatabase

const getFoods = async (
  req: Request,
  res: Response,
): Promise<
  | IFoods
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { query } = req

    // const pattern = /^\d+(?:-\d+)?$|^\d+\+$/

    const ingr = query.ingr as string
    const nextPage = query.nextPage as string

    const params: IFoodsRequestParams = {
      session: nextPage,
      ingr,
    }

    const baseUrl = `${config.services.recipes.urlFoodDatabase}?type=public&app_id=${apiId}&app_key=${apiKey}&nutrition-type=logging`

    const response = await axios.get(baseUrl, { params })

    let foods = response.data ? (response.data.hints as IFoodHint[]) : []

    foods = filterUniqueFoods(foods)

    const result: IFoods = {
      text: response.data.text,
      hints: foods,
      parsed: response.data.parsed,
      nextPage: getNextPageParam(response.data?._links?.next?.href) ?? null,
    }
    return result
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    return {
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }
}

export { getFoods }
