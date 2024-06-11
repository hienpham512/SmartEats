interface IRecipesRequestParams {
  calories?: string;
  cuisineType?: TCuisineType;
  diet?: TDiet;
  dishType?: TDishType;
  excluded?: string[];
  from?: number;
  health?: THealth;
  mealType?: TMealType;
  q?: string;
  time?: string;
  _cont?: string;
}

interface IRecipes {
  count: number;
  from: number;
  hits: IRecipe[];
  nextPage: string | null;
  to: number;
}

interface IRecipe {
  recipe: {
    uri: string;
    label: string;
    image: string;
    images: IImage[];
    source: string;
    url: string;
    shareAs: string;
    yield: number;
    dietLabels: TDiet[];
    healthLabels: string[];
    cautions: string[];
    ingredientLines: string[];
    ingredients: IIngredient[];
    calories: number;
    totalWeight: number;
    totalTime: number;
    cuisineType: TCuisineType[];
    mealType: TMealType[];
    dishType: TDishType[];
    totalNutrients: INutrients;
    totalDaily: INutrients;
    digest: IDigest[];
    totalCO2Emissions: number;
    _links: {
      self: {
        href: string;
        title: string;
      };
    };
  };
}

interface IImage {
  THUMBNAIL: IImageType;
  SMALL: IImageType;
  REGULAR: IImageType;
  LARGE: IImageType;
}

interface IImageType {
  url: string;
  width: number;
  height: number;
}

interface IIngredient {
  food: string;
  measure: string;
  foodCategory: string;
  foodId: string;
  image: string;
  quantity: number;
  text: string;
  weight: number;
}

interface INutrients {
  ENERC_KCAL: INutrient;
  FAT: INutrient;
  FASAT: INutrient;
  FATRN: INutrient;
  FAMS: INutrient;
  FAPU: INutrient;
  CHOCDF: INutrient;
  "CHOCDF.net": INutrient;
  FIBTG: INutrient;
  SUGAR: INutrient;
  "SUGAR.added": INutrient;
  "SUGAR.alcohol": INutrient;
  PROCNT: INutrient;
  CHOLE: INutrient;
  NA: INutrient;
  CA: INutrient;
  MG: INutrient;
  K: INutrient;
  FE: INutrient;
  ZN: INutrient;
  P: INutrient;
  VITA_RAE: INutrient;
  VITC: INutrient;
  THIA: INutrient;
  RIBF: INutrient;
  NIA: INutrient;
  VITB6A: INutrient;
  FOLDFE: INutrient;
  FOLFD: INutrient;
  FOLAC: INutrient;
  VITB12: INutrient;
  VITD: INutrient;
  TOCPHA: INutrient;
  VITK1: INutrient;
  WATER: INutrient;
}

interface INutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface IDigest {
  label: string;
  tag: string;
  schemaOrgTag: string;
  total: number;
  hasRDI: boolean;
  daily: number;
  unit: string;
  sub: IDigest[];
}

export enum TRecipeType {
  PUBLIC = "public",
  USER = "user",
  ANY = "any",
}

export enum THealth {
  ALCOHOL_COCKTAIL = "alcohol-cocktail",
  ALCOHOL_FREE = "alcohol-free",
  CELERY_FREE = "celery-free",
  CRUSTACEAN_FREE = "crustacean-free",
  DAIRY_FREE = "dairy-free",
  EGG_FREE = "egg-free",
  FISH_FREE = "fish-free",
  GLUTEN_FREE = "gluten-free",
  KETOGENIC = "ketogenic",
  FODMAP_FREE = "fodmap-free",
  IMMUNE_SUPPORTIVE = "immune-supportive",
  KETO_FRIENDLY = "keto-friendly",
  KOHSER = "kosher",
  LOW_FAT_ABS = "low-fat-abs",
  LOW_POTASSIUM = "low-potassium",
  LOW_SUGAR = "low-sugar",
  LUPINE_FREE = "lupine-free",
  MEDITERRANEAN = "mediterranean",
  MOLLUSK_FREE = "mollusk-free",
  MUSTARD_FREE = "mustard-free",
  NO_OIL_ADDED = "no-oil-added",
  PALEO = "paleo",
  PEANUT_FREE = "peanut-free",
  PESCATARIAN = "pescatarian",
  PORK_FREE = "pork-free",
  RED_MEAT_FREE = "red-meat-free",
  SESAME_FREE = "sesame-free",
  SHELLFISH_FREE = "shellfish-free",
  SOY_FREE = "soy-free",
  SUGAR_CONSCIOUS = "sugar-conscious",
  SULFITE_FREE = "sulfite-free",
  TREE_NUT_FREE = "tree-nut-free",
  VEGAN = "vegan",
  VEGETARIAN = "vegetarian",
  WHEAT_FREE = "wheat-free",
}

export enum TCuisineType {
  AMERICAN = "American",
  ASIAN = "Asian",
  BRITISH = "British",
  CARIBBEAN = "Caribbean",
  CENTRAL_EUROPEAN = "Central European",
  CHINESE = "Chinese",
  EASTERN_EUROPEAN = "Eastern European",
  FRENCH = "French",
  INDIAN = "Indian",
  ITALIAN = "Italian",
  JAPANESE = "Japanese",
  KOSHER = "Kosher",
  MEDITERRANEAN = "Mediterranean",
  MEXICAN = "Mexican",
  MIDDLE_EASTERN = "Middle Eastern",
  NORDIC = "Nordic",
  SOUTH_AMERICAN = "South American",
  SOUTH_EASTERN_ASIAN = "Southeastern Asian",
}

export enum TDiet {
  BALANCED = "balanced",
  HIGH_FIBER = "high-fiber",
  HIGH_PROTEIN = "high-protein",
  LOW_CARB = "low-carb",
  LOW_FAT = "low-fat",
  LOW_SODIUM = "low-sodium",
}

export enum TMealType {
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  SNACK = "Snack",
  TEATIME = "Teatime",
}

export enum TDishType {
  BISSCUIT_AND_COOKIES = "Biscuit and cookies",
  BREAD = "Bread",
  CEREALS = "Cereals",
  CONDIMENTS_AND_SAUCES = "Condiments and sauces",
  DESERT = "Desert",
  DRINKS = "Drinks",
  MAIN_COURSE = "Main course",
  PANCAKE = "Pancake",
  PREPS = "Preps",
  PRESERVE = "Preserve",
  SALAD = "Salad",
  SANDWICHES = "Sandwiches",
  SIDE_DISH = "Side dish",
  SOUP = "Soup",
  STATER = "Starter",
  SWEETS = "Sweets",
}

export enum Nutrients {
  ENERC_KCAL = "ENERC_KCAL",
  FAT = "FAT",
  FASAT = "FASAT",
  FATRN = "FATRN",
  FAMS = "FAMS",
  FAPU = "FAPU",
  CHOCDF = "CHOCDF",
  CHOCDF_NET = "CHOCDF.net",
  FIBTG = "FIBTG",
  SUGAR = "SUGAR",
  SUGAR_ADDED = "SUGAR.added",
  SUGAR_ALCOHOL = "SUGAR.alcohol",
  PROCNT = "PROCNT",
  CHOLE = "CHOLE",
  NA = "NA",
  CA = "CA",
  MG = "MG",
  K = "K",
  FE = "FE",
  ZN = "ZN",
  P = "P",
  VITA_RAE = "VITA_RAE",
  VITC = "VITC",
  THIA = "THIA",
  RIBF = "RIBF",
  NIA = "NIA",
  VITB6A = "VITB6A",
  FOLDFE = "FOLDFE",
  FOLFD = "FOLFD",
  FOLAC = "FOLAC",
  VITB12 = "VITB12",
  VITD = "VITD",
  TOCPHA = "TOCPHA",
  VITK1 = "VITK1",
  WATER = "WATER",
}

export type {
  IRecipesRequestParams,
  IRecipes,
  IRecipe,
  IDigest,
  INutrient,
  INutrients,
  IIngredient,
  IImageType,
  IImage,
};
