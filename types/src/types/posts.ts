interface IPost {
  comments: IComment[];
  createdAt: string | Date;
  id: string;
  images: string[];
  isEdited: boolean;
  likes: string[]; //list of user ids
  linkedExercises?: string[] //exercise ids
  linkedRecipes?: string[] //recipe ids
  body: string;
  updatedAt: string | Date;
  userId: string;
  videos: string[];
}

interface IComment {
  createdAt: string | Date;
  id: string;
  isEdited: boolean;
  likes: string[]; //list of user ids
  replyTo: string;
  body: string;
  updatedAt: string | Date;
  userId: string;
}

export type { IPost, IComment };
