import { Timestamp } from "firebase/firestore"

export interface IFollow {
   id: string
   from: string
   to: string
   createdAt: Timestamp
}
