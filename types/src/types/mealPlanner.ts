import type { BodyPart, IExercise, Target } from "./exercises";
import type {
  IRecipe,
  IRecipesRequestParams,
  TCuisineType,
  TDiet,
  TDishType,
  THealth,
  TMealType,
} from "./recipes";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum GoalType {
  Lose = "Lose",
  Gain = "Gain",
  Maintain = "Maintain",
}

export enum ActivityLevel {
  NotActive = 1,
  Sedentary = 1.2,
  LightlyActive = 1.375,
  ModeratelyActive = 1.55,
  VeryActive = 1.725,
  ExtraActive = 1.9,
}

export enum BMILevel {
  Underweight = "Underweight",
  Normal = "Normal",
  GainWeight = "Gain Weight",
  ObeseLevel1 = "Obese Level 1",
  ObeseLevel2 = "Obese Level 2",
  ObeseLevel3 = "Obese Level 3",
}

interface IMealPlanRequestParams {
  activityLevel?: ActivityLevel;
  age: number; // in years
  gender: Gender;
  goalType?: GoalType;
  height: number; // in centimeters
  isWithExercises?: Boolean;
  isWithSnackTime?: Boolean;
  timeDuration?: number; // in weeks, optional
  weight: number; // in kilograms
  weightChange?: number; // in kilograms, positive for gain, negative for lose
  cuisineType?: TCuisineType;
  diet?: TDiet;
  dishType?: TDishType;
  excluded?: string[] | string;
  health?: THealth;
  mealType?: TMealType;
  time?: string;
  exercisesPerDay?: number;
  bodyParts?: string[] | string;
  targets?: string[] | string;
}

interface IMealPlan {
  breakfast: number; // in calories
  lunch: number; // in calories
  dinner: number; // in calories
  snack?: number; // in calories
}

interface IMealPlanner {
  bmi: number;
  bmr: number;
  bodyStatus: BMILevel;
  daily: IMealPlanDaily[];
  time: number;
  warning: string;
  weightChange: number;
}

interface IMealPlanDaily {
  day: number;
  dailyCaloriesIntake: number;
  dailyCaloriesToBurn: number;
  meals: {
    breakfast: {
      calories: number;
      recipe: IRecipe;
    };
    lunch: {
      calories: number;
      recipe: IRecipe;
    };
    dinner: {
      calories: number;
      recipe: IRecipe;
    };
    snack?: {
      calories: number;
      recipe: IRecipe;
    };
  };
  exercises?: {
    calories: number;
    exercises: IExercise;
    time: number; //in minutes
  }[];
}
export type { IMealPlanRequestParams, IMealPlan, IMealPlanner, IMealPlanDaily };
