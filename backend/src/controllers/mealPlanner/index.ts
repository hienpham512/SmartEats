import config from '../../config'
import type { Request, Response } from 'express'
import { getParamValue } from '../recipes/helper'
import {
  calculateBMI,
  calculateBMR,
  calculateCaloriesIntakeAndBurn,
  calculateCustomMealCalories,
} from './helper'
import axios from 'axios'
import {
  ActivityLevel,
  BMILevel,
  type BodyPart,
  TMealType,
  type Target,
  type Gender,
  type IExercise,
  type IMealPlanDaily,
  type IMealPlanRequestParams,
  type IMealPlanner,
  type IRecipe,
  type IRecipesRequestParams,
  type TCuisineType,
  type TDiet,
  type TDishType,
  type THealth,
} from '@hienpham512/smarteats'

const apiKey = config.services.recipes.apiKey
const apiId = config.services.recipes.apiId

const apiKeyExercises = config.services.exercises.apiKey
const host = config.services.exercises.host
const urlExercises = config.services.exercises.url

const listExercises = async ({
  bodyParts,
  targets,
}: {
  bodyParts: BodyPart[] | undefined
  targets: Target[] | undefined
}): Promise<IExercise[] | undefined> => {
  try {
    let exercises: IExercise[] = []

    if (bodyParts && !targets) {
      for (let i = 0; i < bodyParts.length; i++) {
        const exercisesByBodyPart = await axios.get(
          `${urlExercises}/bodyPart/${bodyParts[i].toString()}`,
          {
            params: {
              limit: 20,
            },
            headers: {
              'X-RapidAPI-Key': apiKeyExercises,
              'X-RapidAPI-Host': host,
            },
          },
        )
        exercises = [...exercises, ...exercisesByBodyPart.data]
      }
    } else if (!bodyParts && targets) {
      for (let i = 0; i < targets.length; i++) {
        const exercisesByTarget = await axios.get(
          `${urlExercises}/target/${targets[i].toString()}`,
          {
            params: {
              limit: 20,
            },
            headers: {
              'X-RapidAPI-Key': apiKeyExercises,
              'X-RapidAPI-Host': host,
            },
          },
        )

        exercises = [...exercises, ...exercisesByTarget.data]
      }
    } else if (targets && bodyParts) {
      for (let i = 0; i < targets.length; i++) {
        const exercisesByTarget = await axios.get(
          `${urlExercises}/target/${targets[i].toString()}`,
          {
            params: {
              limit: 20,
            },
            headers: {
              'X-RapidAPI-Key': apiKeyExercises,
              'X-RapidAPI-Host': host,
            },
          },
        )

        exercises = [...exercises, ...(exercisesByTarget.data as IExercise[])]
      }

      for (let i = 0; i < bodyParts.length; i++) {
        const exercisesByBodyPart = await axios.get(
          `${urlExercises}/bodyPart/${bodyParts[i].toString()}`,
          {
            params: {
              limit: 20,
            },
            headers: {
              'X-RapidAPI-Key': apiKeyExercises,
              'X-RapidAPI-Host': host,
            },
          },
        )

        const exercisesByBodyPartData = exercisesByBodyPart.data as IExercise[]

        exercises = [
          ...exercises,
          ...exercisesByBodyPartData.filter((exercise: IExercise) => {
            const foundSameId = exercises.find((ex) => ex.id === exercise.id)

            return !foundSameId
          }),
        ]
      }
    } else {
      const exercisesRandom = await axios.get(urlExercises, {
        params: {
          limit: 20,
        },
        headers: {
          'X-RapidAPI-Key': apiKeyExercises,
          'X-RapidAPI-Host': host,
        },
      })

      return exercisesRandom.data
    }

    return exercises
  } catch {
    return undefined
  }
}

const getMealPlaner = async (
  req: Request,
  res: Response,
): Promise<
  | IMealPlanner
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  const { query } = req

  const { height, weight } = query

  const isWithExercises: boolean = !!query.isWithExercises
  const isWithSnackTime: boolean = !!query.isWithSnackTime

  const timeDuration: number = query.timeDuration
    ? Number(query.timeDuration) > 4
      ? 4
      : Number(query.timeDuration)
    : 1
  const activityLevel = query.activityLevel
    ? (query.activityLevel as unknown as ActivityLevel)
    : ActivityLevel.NotActive
  const age = Number(query.age)
  const gender = query.gender as Gender

  let warning = ''
  let excludedParams: string = ''

  let weightChange = query.weightChange ? Number(query.weightChange) : 0

  if (weightChange / timeDuration < -1.25) {
    weightChange = -1.25 * timeDuration
    warning = 'Suggested: should only lose from 0.5kg to 1.25kg per week'
  } else if (weightChange / timeDuration > Number(weight) * 0.005) {
    weightChange = Number(weight) * 0.005
    warning = 'Suggested: should only gain from 0.25% to 0.5% of body weight per week'
  }

  const excluded = query.excluded ? query.excluded : undefined
  const cuisineType = query.cuisineType ? (query.cuisineType as TCuisineType) : undefined
  const diet = query.diet ? (query.diet as TDiet) : undefined
  const dishType = query.dishType ? (query.dishType as TDishType) : undefined
  const health = query.health ? (query.health as THealth) : undefined
  const mealType = query.mealType ? (query.mealType as TMealType) : undefined

  if (typeof excluded === 'string') {
    excludedParams += `&excluded=${excluded}`
  } else if (Array.isArray(excluded)) {
    excludedParams += (excluded as string[]).map((item) => `&excluded=${item}`).join('')
  } else {
    excludedParams = ''
  }

  const recipesParams: IRecipesRequestParams = {
    cuisineType,
    diet,
    dishType,
    health,
    mealType,
  }

  let targets = query.targets ? query.targets : undefined
  let bodyParts = query.bodyParts ? query.bodyParts : undefined

  if (typeof targets === 'string') {
    targets = [targets] as Target[]
  } else if (Array.isArray(targets)) {
    targets = targets as Target[]
  } else {
    targets = undefined
  }

  if (typeof bodyParts === 'string') {
    bodyParts = [bodyParts] as Target[]
  } else if (Array.isArray(bodyParts)) {
    bodyParts = bodyParts as Target[]
  } else {
    bodyParts = undefined
  }

  const exercisesPerDay = query.exercisesPerDay
    ? Number(query.exercisesPerDay)
    : isWithExercises
    ? 1
    : 0

  const mealPlanParams: IMealPlanRequestParams = {
    height: Number(height),
    weight: Number(weight),
    age: Number(age),
    gender,
    weightChange,
  }

  const bmi = calculateBMI({
    height: Number(height),
    weight: Number(weight),
  })
  const bmr = calculateBMR(mealPlanParams)

  const plans = calculateCaloriesIntakeAndBurn({
    activityLevel,
    age,
    gender,
    height: Number(height),
    isWithExercises,
    timeDuration,
    weight: Number(weight),
    weightChange,
  })

  const baseUrl = `${config.services.recipes.url}?type=public&app_id=${apiId}&app_key=${apiKey}&random=true${excludedParams}`

  try {
    const exercises = isWithExercises
      ? await listExercises({
          bodyParts: bodyParts as BodyPart[],
          targets: targets as Target[],
        })
      : undefined

    const daily: IMealPlanDaily[] = []

    for (let i = 0; i < plans.length; i++) {
      const { dailyCaloriesIntake, dailyCaloriesToBurn } = plans[i]
      const mealPlan = calculateCustomMealCalories(dailyCaloriesIntake, isWithSnackTime)

      const breakfasts = (
        await axios.get(baseUrl, {
          params: {
            ...recipesParams,
            calories: getParamValue(
              `${mealPlan.breakfast - mealPlan.breakfast * 0.3}-${mealPlan.breakfast}`,
            ),
            mealType: TMealType.BREAKFAST,
          },
        })
      ).data.hits as IRecipe[]

      const lunches = (
        await axios.get(baseUrl, {
          params: {
            ...recipesParams,
            calories: getParamValue(`${mealPlan.lunch - mealPlan.lunch * 0.3}-${mealPlan.lunch}`),
            mealType: TMealType.LUNCH,
          },
        })
      ).data.hits as IRecipe[]

      const snacks = mealPlan.snack
        ? ((
            await axios.get(baseUrl, {
              params: {
                ...recipesParams,
                calories: getParamValue(
                  `${mealPlan.snack - mealPlan.snack * 0.3}-${mealPlan.snack}`,
                ),
                mealType: TMealType.SNACK,
              },
            })
          ).data.hits as IRecipe[])
        : undefined

      const dinners = (
        await axios.get(baseUrl, {
          params: {
            ...recipesParams,
            calories: getParamValue(
              `${mealPlan.dinner - mealPlan.dinner * 0.3}-${mealPlan.dinner}`,
            ),
            mealType: TMealType.DINNER,
          },
        })
      ).data.hits as IRecipe[]

      const breakfast = breakfasts[Math.floor(Math.random() * breakfasts.length)]
      const lunch = lunches[Math.floor(Math.random() * lunches.length)]
      const snack = snacks ? snacks[Math.floor(Math.random() * snacks.length)] : undefined
      const dinner = dinners[Math.floor(Math.random() * dinners.length)]

      const exercisesData: Array<{
        calories: number
        exercises: IExercise
        time: number // in minutes
      }> = []

      const caloriesAverage = (Math.floor(Math.random() * 201) + 100) / 15 // 15mn workout burn 100-200 calories
      const caloriesPerExercise = dailyCaloriesToBurn / exercisesPerDay
      const timePerExercise = Math.ceil(caloriesPerExercise / caloriesAverage)

      if (exercises) {
        for (let j = 0; j < exercisesPerDay; j++) {
          const exercise = exercises[Math.floor(Math.random() * exercises.length)]

          exercisesData.push({
            calories: caloriesPerExercise,
            exercises: exercise,
            time: timePerExercise,
          })
        }
      }

      daily.push({
        day: i + 1,
        dailyCaloriesIntake,
        dailyCaloriesToBurn,
        meals: {
          breakfast: {
            calories: breakfast.recipe.calories / breakfast.recipe.yield,
            recipe: breakfast,
          },
          lunch: {
            calories: lunch.recipe.calories / lunch.recipe.yield,
            recipe: lunch,
          },
          snack: snack
            ? {
                calories: snack.recipe.calories / snack.recipe.yield,
                recipe: snack,
              }
            : undefined,
          dinner: {
            calories: dinner.recipe.calories / dinner.recipe.yield,
            recipe: dinner,
          },
        },
        exercises: exercisesData,
      })
    }

    const result: IMealPlanner = {
      bmi,
      bmr,
      bodyStatus:
        bmi < 18.5
          ? BMILevel.Underweight
          : bmi < 25
          ? BMILevel.Normal
          : bmi < 30
          ? BMILevel.GainWeight
          : bmi < 35
          ? BMILevel.ObeseLevel1
          : bmi < 40
          ? BMILevel.ObeseLevel2
          : BMILevel.ObeseLevel3,
      time: timeDuration ? Number(timeDuration) : 1,
      weightChange: weightChange ? Number(weightChange) : 0,
      daily,
      warning,
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

const getBMI = (
  req: Request,
  res: Response,
): {
  bmi: number
  bodyStatus: BMILevel
} => {
  const { query } = req
  const { height, weight } = query

  const bmi = Number(weight) / ((Number(height) / 100) * (Number(height) / 100))

  return {
    bmi,
    bodyStatus:
      bmi < 18.5
        ? BMILevel.Underweight
        : bmi < 25
        ? BMILevel.Normal
        : bmi < 30
        ? BMILevel.GainWeight
        : bmi < 35
        ? BMILevel.ObeseLevel1
        : bmi < 40
        ? BMILevel.ObeseLevel2
        : BMILevel.ObeseLevel3,
  }
}

const getWeightIdeal = (req: Request, res: Response): { min: number; max: number } => {
  const height = Number(req.query.height)

  const min = 18.5 * (height / 100) * (height / 100)
  const max = 24.9 * (height / 100) * (height / 100)

  return {
    min,
    max,
  }
}

const getBMR = (req: Request, res: Response): number => {
  const { query } = req
  const { height, weight, age } = query

  const gender = query.gender as Gender

  const bmr = calculateBMR({
    age: Number(age),
    height: Number(height),
    weight: Number(weight),
    gender,
  })

  return bmr
}

export { getMealPlaner, getWeightIdeal, getBMI, getBMR }
