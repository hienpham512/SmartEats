import { IFoodHint  } from "./foods";

interface IFoodDetection {
  label: string;
  score: number;
}

interface IFoodDetected {
  label: string;
  score: number;
  food: IFoodHint[];
  nextPage: string | null;
}

export type { IFoodDetection, IFoodDetected };