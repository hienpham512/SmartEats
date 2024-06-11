import { Timestamp } from "firebase/firestore"

type Image = string

export type Comment = {
   body: string
   createdAt: Timestamp
   userID: string
   avatar: string
   username: string
}

export type Like = {
   userID: string
   avatar: string
   username: string
}

export type Post = {
   id: string
   body: string
   images: Image[]
   createdAt: Timestamp
   userID: string | undefined
   avatar: string
   username: string
   isEdited: boolean
   updatedAt: null
   likes: Like[]
   comments: Comment[]
}
