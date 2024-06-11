interface IUser {
  allergies?: string[];
  avatar?: string;
  birthday: string | Date;
  cuisineType?: string[];
  diet?: string[];
  email: string;
  fistName: string;
  gender?: string;
  health?: string[];
  high?: number;
  id: string;
  lastName: string;
  phoneNumber?: string;
  points: number;
  posts?: string[];
  weight?: number;
  savedPosts?: string[];
  savedRecipes?: string[];
  savedExercises?: string[];
}

export enum IPrivacy {
  PUBLIC = "Public",
  PRIVATE = "Private",
  FOLLOWERS = "Followers",
}

export type { IUser };
