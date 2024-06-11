interface IExercise {
  bodyPart: BodyPart;
  equipment: Equipment;
  gifUrl: string;
  id: string;
  name: string;
  target: Target;
  secondaryMuscles: string[];
  instructions: string[];
}

interface IExerciseRequestParams {
  bodyParts?: BodyPart[];
  equipments?: Equipment[];
  targets?: Target[];
}

export enum BodyPart {
  BACK = "back",
  CARDIO = "cardio",
  CHEST = "chest",
  LOWER_ARMS = "lower arms",
  LOWER_LEGS = "lower legs",
  NECK = "neck",
  SHOULDERS = "shoulders",
  UPPER_ARMS = "upper arms",
  UPPER_LEGS = "upper legs",
  WAIST = "waist",
}

export enum Target {
  ABDUCTORS = "abductors",
  ABS = "abs",
  ADDUCTORS = "adductors",
  BICEPS = "biceps",
  CALVES = "calves",
  CARDIOVASCULAR_SYSTEM = "cardiovascular system",
  DELTS = "delts",
  FOREARMS = "forearms",
  GLUTES = "glutes",
  HAMSTRINGS = "hamstrings",
  LATS = "lats",
  LEVATOR_SCAPULAE = "levator scapulae",
  PECTORALS = "pectorals",
  QUADS = "quads",
  SERRATUS_ANTERIOR = "serratus anterior",
  SPINE = "spine",
  TRAPS = "traps",
  TRICEPS = "triceps",
  UPPER_BACK = "upper back",
}

export enum Equipment {
  ASSISTED = "assisted",
  BAND = "band",
  BARBELL = "barbell",
  BODY_WEIGHT = "body weight",
  BOSU_BALL = "bosu ball",
  CABLE = "cable",
  DUMBBELL = "dumbbell",
  ELLIPTICAL_MACHINE = "elliptical machine",
  EZ_BARBELL = "ez barbell",
  HAMMER = "hammer",
  KETTLEBELL = "kettlebell",
  LEVERAGE_MACHINE = "leverage machine",
  MEDICINE_BALL = "medicine ball",
  OLYMPIC_BARBELL = "olympic barbell",
  RESISTANCE_BAND = "resistance band",
  ROLLER = "roller",
  ROPE = "rope",
  SKIERG_MACHINE = "skierg machine",
  SLED_MACHINE = "sled machine",
  SMITH_MACHINE = "smith machine",
  STABILITY_BALL = "stability ball",
  STATIONARY_BIKE = "stationary bike",
  STEPMILL_MACHINE = "stepmill machine",
  TIRE = "tire",
  TRAP_BAR = "trap bar",
  UPPER_BODY_ERGOMETER = "upper body ergometer",
  WEIGHTED = "weighted",
  WHEEL_ROLLER = "wheel roller",
}

export type { IExercise, IExerciseRequestParams };
