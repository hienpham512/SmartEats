interface IFoodsRequestParams {
  ingr: string;
  session?: string;
}

interface IFoods {
  text: string;
  parsed: IFood[];
  hints: IFoodHint[];
  nextPage: string | null;
}

interface IFoodHint {
  food: IFood;
  measures: IFoodMeasure[];
}

interface IFood {
  foodId: string;
  label: string;
  knownAs: string;
  nutrients: IFoodNutrients;
  category: IFoodCategory;
  categoryLabel: IFoodCategoryLabel;
  image: string;
}

interface IFoodNutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  FAT: number;
  CHOCDF: number;
  FIBTG: number;
}

interface IFoodMeasure {
  uri: string;
  label: IFoodMeasures;
  weight: number;
  qualified?: IFoodQualifier[];
}

interface IFoodQualifier {
  uri: string;
  label: "large" | "small" | "medium";
  weight: number;
}

export enum IFoodCategory {
  GENERIC_FOODS = "generic-foods",
  PACKAGED_FOODS = "packaged-foods",
  GENERIC_MEALS = "generic-meals",
  FAST_FOODS = "fast-foods",
}

export enum IFoodCategoryLabel {
  FOOD = "food",
  MEAL = "meal",
}

export enum IFoodMeasures {
  Ounce = "Ounce",
  Gram = "Gram",
  Pound = "Pound",
  Kilogram = "Kilogram",
  Pinch = "Pinch",
  Liter = "Liter",
  FluidOunce = "Fluid ounce",
  Gallon = "Gallon",
  Pint = "Pint",
  Quart = "Quart",
  Milliliter = "Milliliter",
  Drop = "Drop",
  Cup = "Cup",
  Tablespoon = "Tablespoon",
  Teaspoon = "Teaspoon",
}

export type {
  IFood,
  IFoodHint,
  IFoodMeasure,
  IFoodNutrients,
  IFoodQualifier,
  IFoods,
  IFoodsRequestParams,
};
