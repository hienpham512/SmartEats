import { db } from "@/lib/firebase"
import { Comment, Like, Post } from "@/types/post"
import { Timestamp, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"

const getAllPosts = async (): Promise<Post[]> => {
   const postsRef = collection(db, "posts")
   const postsSnap = await getDocs(postsRef)
   const posts = postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Post)
   return posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
}

const getUserPosts = async (userId: string | undefined): Promise<Post[]> => {
   try {
      if (!userId) throw new Error("User ID is required")
      const postsRef = query(collection(db, "posts"), where("userID", "==", userId))
      const postsSnap = await getDocs(postsRef)
      const posts = postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Post)
      return posts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
   } catch (error) {
      console.error("Error fetching user posts: ", error)
      return []
   }
}

const createComment = async (postId: string, body: string, user: { id: string; avatar: string; username: string }) => {
   const comment: Omit<Comment, "id"> = {
      body,
      createdAt: Timestamp.now(),
      userID: user.id,
      avatar: user.avatar,
      username: user.username
   }
   try {
      const docSnap = await getDoc(doc(db, "posts", postId))
      if (!docSnap.exists()) throw new Error("Post not found")
      const comments = [...docSnap.data().comments, comment]
      await updateDoc(docSnap.ref, {
         comments: comments.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      })
      return true
   } catch (error) {
      console.error("Error creating comment: ", error)
      return false
   }
}

const addLike = async (postId: string, user: { id: string; avatar: string; username: string }) => {
   try {
      const docSnap = await getDoc(doc(db, "posts", postId))
      if (!docSnap.exists()) throw new Error("Post not found")
      const newLike: Like = { userID: user.id, avatar: user.avatar, username: user.username }
      const likes = [...docSnap.data().likes, newLike]
      // filter out duplicate likes
      await updateDoc(docSnap.ref, {
         likes: likes.filter((like, index, self) => self.findIndex((l) => l.userID === like.userID) === index)
      })
      return true
   } catch (error) {
      console.error("Error adding like: ", error)
      return false
   }
}

const removeLike = async (postId: string, userId: string) => {
   try {
      const docSnap = await getDoc(doc(db, "posts", postId))
      if (!docSnap.exists()) throw new Error("Post not found")
      const likes = docSnap.data().likes.filter((like: Like) => like.userID !== userId)
      await updateDoc(docSnap.ref, { likes })
      console.log(likes)
      return true
   } catch (error) {
      console.error("Error removing like: ", error)
      return false
   }
}

export { addLike, createComment, getAllPosts, getUserPosts, removeLike }
