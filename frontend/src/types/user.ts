import { Gender } from "@hienpham512/smarteats"
import { Timestamp } from "firebase/firestore"

export interface IUserData {
   id: string
   email: string
   nbFollowers?: string
   nbFollowing?: string
   nbPosts?: string
   username?: string
   bio?: string
   name?: string
   avatar?: string
   height?: number
   weight?: number
   dateOfBirth?: Date | Timestamp
   age?: number
   gender?: Gender
}
