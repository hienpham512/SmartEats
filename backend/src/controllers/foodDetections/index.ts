import config from '../../config'
import { type IFoodDetected, type IFoodDetection } from '@hienpham512/smarteats'
import axios from 'axios'
import { type Request, type Response } from 'express'
import { getNextPageParam } from '../foods/helper'

const apiKey = config.services.huggingFace.apiKey
const url = config.services.huggingFace.url
const apiIdFoodSearch = config.services.recipes.apiIdFoodDatabase
const apiKeyFoodSearch = config.services.recipes.apiKeyFoodDatabase

const getFoodDetections = async (
  req: Request,
  res: Response,
): Promise<
  | IFoodDetected[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  const fileData = req.body as Uint8Array

  if (!fileData) {
    return {
      error: {
        code: 'missing',
        message: 'Missing photo data',
      },
    }
  }

  try {
    const response = await axios.post(url, fileData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/octet-stream',
      },
    })

    const foodsDetected = response.data as IFoodDetection[]
    const foodsAccurate = foodsDetected
      .filter((food: IFoodDetection) => Number(food.score) > 0.8)
      .sort((a: IFoodDetection, b: IFoodDetection) => Number(b.score) - Number(a.score))

    if (foodsAccurate.length === 0) {
      return {
        error: {
          code: 'accuracy',
          message: 'Accuracy is not enough',
        },
      }
    }

    const result: IFoodDetected[] = []

    for (let i = 0; i < foodsAccurate.length; i++) {
      const foodsBaseUrl = `${
        config.services.recipes.urlFoodDatabase
      }?type=public&app_id=${apiIdFoodSearch}&app_key=${apiKeyFoodSearch}&ingr=${foodsAccurate[
        i
      ].label.replace('_', '+')}&nutrition-type=logging`

      const foodsSearchResponse = await axios.get(foodsBaseUrl)

      result.push({
        label: foodsAccurate[i].label,
        score: foodsAccurate[i].score,
        food: foodsSearchResponse.data.hints,
        nextPage: getNextPageParam(foodsSearchResponse.data?._links?.next?.href) ?? null,
      })
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

export { getFoodDetections }
