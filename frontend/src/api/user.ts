import { db } from "@/lib/firebase"
import { IFollow } from "@/types/follow"
import { IUserData } from "@/types/user"
import axios from "axios"
import {
   Timestamp,
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDoc,
   getDocs,
   query,
   updateDoc,
   where
} from "firebase/firestore"

const fetchUserData = async (id: string, other?: boolean): Promise<(IUserData & { followedBy?: string[] }) | null> => {
   try {
      const docRef = doc(db, "users", id)
      const docSnap = await getDoc(docRef)
      const userData = docSnap.exists() ? docSnap.data() : null
      if (other) {
         const followRef = query(collection(db, "follow"), where("to", "==", id))
         const followSnap = await getDocs(followRef)
         const followedBy = followSnap.docs.map((doc) => doc.data().from as string)
         return { ...userData, followedBy } as IUserData & { followedBy: string[] }
      }
      return userData as IUserData
   } catch (error) {
      return null
   }
}

const updateUserData = async (id: string, data: Partial<IUserData>) => {
   try {
      const docRef = doc(db, "users", id)
      await updateDoc(docRef, data)
   } catch (error) {
      console.error("Error updating user data: ", error)
      return false
   }
}

const followUser = async (from: string, to: string) => {
   const data: Partial<IFollow> = {
      from,
      to,
      createdAt: Timestamp.now()
   }
   try {
      await addDoc(collection(db, "follow"), data)
      const newUserData = await fetchUserData(to)
      return newUserData
   } catch (error) {
      console.error("Error following user: ", error)
      return null
   }
}

const unfollowUser = async (from: string, to: string) => {
   try {
      console.log({ from, to })
      const followRef = query(collection(db, "follow"), where("from", "==", from), where("to", "==", to))
      const followSnap = await getDocs(followRef)
      if (followSnap.empty) return console.error("No follow data found")
      const followDoc = followSnap.docs[0]
      await deleteDoc(followDoc.ref)
   } catch (error) {
      console.error("Error unfollowing user: ", error)
      return null
   }
}

const getFollowers = async (id: string): Promise<string[]> => {
   try {
      const followRef = query(collection(db, "follow"), where("to", "==", id))
      const followSnap = await getDocs(followRef)
      return followSnap.docs.map((doc) => doc.data().from as string)
   } catch (error) {
      console.error("Error getting followers: ", error)
      return []
   }
}

const getFollowing = async (id: string): Promise<string[]> => {
   try {
      const followRef = query(collection(db, "follow"), where("from", "==", id))
      const followSnap = await getDocs(followRef)
      return followSnap.docs.map((doc) => doc.data().to as string)
   } catch (error) {
      console.error("Error getting following: ", error)
      return []
   }
}

const getNbPosts = async (id: string): Promise<number> => {
   try {
      const q = query(collection(db, "posts"), where("userID", "==", id))
      const querySnapshot = await getDocs(q)
      return querySnapshot.size
   } catch (error) {
      console.error("Error getting number of posts: ", error)
      return 0
   }
}

const searchUsers = async (search: string): Promise<{ id: string; score: number }[]> => {
   try {
      type SearchResult = {
         id: { raw: string }
         _meta: { score: number }
      }

      const response = await axios.post<{
         results: Partial<SearchResult>[]
      }>(
         "https://41728245c26a46068270d3b522647997.ent-search.us-central1.gcp.cloud.es.io/api/as/v1/engines/smarteats-users/search",
         {
            query: search
         },
         {
            headers: {
               Authorization: "Bearer search-j8rwd9hoxofmvmtf1aoy11a8"
            }
         }
      )
      const data = response.data.results
         .filter((u): u is SearchResult => !!u.id && !!u._meta)
         .map((user) => ({
            id: user.id.raw,
            score: user._meta.score
         }))
      return data || []
   } catch (error) {
      console.error("Error searching users: ", error)
      return []
   }
}

export { fetchUserData, followUser, getFollowers, getFollowing, getNbPosts, searchUsers, unfollowUser, updateUserData }
