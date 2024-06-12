import {
  ActivityLevel,
  Gender,
  type IMealPlan,
  type IMealPlanRequestParams,
} from '@hienpham512/smarteats'

export const calculateBMI = ({ weight, height }: { weight: number; height: number }): number => {
  return weight / (((height / 100) * height) / 100)
}

export const calculateBMR = ({
  weight,
  height,
  age,
  gender,
}: {
  weight: number
  height: number
  age: number
  gender: Gender
}): number => {
  if (gender === Gender.Male) {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

export const calculateCaloriesIntakeAndBurn = ({
  activityLevel = ActivityLevel.NotActive,
  age,
  gender,
  height,
  isWithExercises,
  timeDuration,
  weight,
  weightChange,
}: {
  activityLevel: ActivityLevel
  age: number
  gender: Gender
  height: number
  isWithExercises: boolean
  timeDuration: number
  weight: number
  weightChange: number
}): Array<{ day: number; dailyCaloriesIntake: number; dailyCaloriesToBurn: number }> => {
  const plans: Array<{ day: number; dailyCaloriesIntake: number; dailyCaloriesToBurn: number }> = []
  let weightCalculated = weight

  for (let i = 0; i <= timeDuration * 7; i++) {
    let burn = 0
    let intake = calculateBMR({
      age,
      gender,
      height,
      weight: weightCalculated,
    })

    const weightChangePerDay = weightChange / (timeDuration * 7) / activityLevel

    if (weightChange === 0) {
      const caloriesDiffPerDay = Math.floor(Math.random() * 101) + 100

      intake += isWithExercises
        ? weightChangePerDay * 7700 + caloriesDiffPerDay
        : weightChangePerDay * 7700
      burn += isWithExercises ? caloriesDiffPerDay : 0
    } else if (weightChange > 0) {
      intake += isWithExercises
        ? weightChangePerDay * 7700 + (weightChangePerDay * 7700) / 2
        : weightChangePerDay * 7700
      burn += isWithExercises ? (weightChangePerDay * 7700) / 2 : 0
    } else {
      intake += isWithExercises
        ? weightChangePerDay * 7700 - (weightChangePerDay * 7700) / 2
        : weightChangePerDay * 7700
      burn += isWithExercises ? ((weightChangePerDay * 7700) / 2) * -1 : 0
    }

    plans.push({
      dailyCaloriesIntake: intake,
      dailyCaloriesToBurn: burn,
      day: i + 1,
    })

    weightCalculated =
      weightChange > 0
        ? weightCalculated + weightChangePerDay
        : weightCalculated - weightChangePerDay
    weightChange =
      weightChange > 0 ? weightChange + weightChangePerDay : weightChange - weightChangePerDay
  }

  return plans
}

export const calculateDailyCalories = (bmr: number, age: number, gender: Gender): number => {
  let activityMultiplier: number

  // Define activity multipliers based on gender and activity level
  if (gender === Gender.Male) {
    activityMultiplier = 1.55 // Moderate activity level for males
  } else {
    activityMultiplier = 1.56 // Moderate activity level for females
  }

  // Adjust activity multiplier based on age
  if (age >= 18 && age <= 30) {
    activityMultiplier += 0.1 // Young adults have slightly higher activity levels
  } else if (age > 30 && age <= 60) {
    activityMultiplier += 0.05 // Middle-aged adults have slightly lower activity levels
  } // For simplicity, we are not considering age-based adjustments for other age groups

  return bmr * activityMultiplier
}

// Enum definitions for Gender and GoalType here

export const calculateDailyCaloriesToBurn = (
  params: IMealPlanRequestParams,
  dailyCaloriesIntake: number,
): number => {
  const targetWeightLossKg = Math.abs(params.weightChange ?? 0) // Target weight loss in kilograms
  const caloriesPerKg = 7700 // Calories per kilogram of weight loss

  // Calculate total calorie deficit required to achieve target weight loss in a month
  const totalCalorieDeficit = targetWeightLossKg * caloriesPerKg

  // Calculate daily calorie deficit needed
  const dailyCalorieDeficit =
    totalCalorieDeficit / (params.timeDuration ? params.timeDuration * 7 : 7)

  // Calculate daily calories to burn to achieve the deficit
  const dailyCaloriesToBurn = dailyCaloriesIntake - dailyCalorieDeficit

  return dailyCaloriesToBurn
}

export const calculateCustomMealCalories = (
  dailyCalories: number,
  isWithSnackTime: boolean,
): IMealPlan => {
  // Assuming a standard distribution of calories among meals
  const breakfastRatio = 0.25
  const lunchRatio = isWithSnackTime ? 0.4 : 0.5
  const dinnerRatio = 0.35
  const snackRatio = isWithSnackTime ? 0.1 : 0

  const breakfast = dailyCalories * breakfastRatio
  const lunch = dailyCalories * lunchRatio
  const dinner = dailyCalories * dinnerRatio
  const snack = isWithSnackTime ? dailyCalories * snackRatio : undefined

  return {
    breakfast,
    lunch,
    dinner,
    snack,
  }
}
