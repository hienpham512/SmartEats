import { type Request, type Response } from 'express'
import config from '../../config'
import type { IExercise } from '@hienpham512/smarteats'
import axios from 'axios'

const apiKey = config.services.exercises.apiKey
const host = config.services.exercises.host
const url = config.services.exercises.url

const getExercises = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const exercises = await axios.get(url, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

const getExercisesBodyPart = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { bodyPart } = req.params
    const exercises = await axios.get(`${url}/bodyPart/${bodyPart}`, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

const getExercisesEquipment = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { equipment } = req.params
    const exercises = await axios.get(`${url}/equipment/${equipment}`, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

const getExercisesTarget = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { target } = req.params
    const exercises = await axios.get(`${url}/target/${target}`, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

const getExerciseName = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { name } = req.params
    const exercises = await axios.get(`${url}/name/${name}`, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

const getExerciseId = async (
  req: Request,
  res: Response,
): Promise<
  | IExercise[]
  | {
      error: {
        code: string
        message: string
      }
    }
> => {
  try {
    const { id } = req.params
    const exercises = await axios.get(`${url}/exercise/${id}`, {
      params: {
        limit: 20,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    })

    return exercises.data
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

export {
  getExerciseId,
  getExerciseName,
  getExercises,
  getExercisesBodyPart,
  getExercisesEquipment,
  getExercisesTarget,
}
