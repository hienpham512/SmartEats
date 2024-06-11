import { db } from "@/lib/firebase"
import { Timestamp, addDoc, and, collection, getDocs, onSnapshot, or, query, where } from "firebase/firestore"

type Message = {
   id: string
   from: string
   to: string
   message: string
   createdAt: Timestamp
}

type Chat = {
   user: string
   lastMessage: Message
}

const listenForMessages = (from: string, to: string, callback: (messages: Message[]) => void) => {
   const messagesRef = query(
      collection(db, "messages"),
      or(and(where("from", "==", from), where("to", "==", to)), and(where("from", "==", to), where("to", "==", from)))
   )
   return onSnapshot(messagesRef, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Message)
      callback(messages)
   })
}

const sendMessage = async (from: string, to: string, message: string) => {
   const data = {
      from,
      to,
      message,
      createdAt: Timestamp.now()
   }
   try {
      await addDoc(collection(db, "messages"), data)
      return true
   } catch (error) {
      console.error("Error sending message: ", error)
      return false
   }
}

const getChatsWithLatestMessage = async (userId: string): Promise<Chat[]> => {
   const messagesRef = query(collection(db, "messages"), or(where("from", "==", userId), where("to", "==", userId)))
   const messagesSnap = await getDocs(messagesRef)
   const messages: Message[] = messagesSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Message)
   const chats: Record<string, Message> = {}
   messages.forEach((message) => {
      const otherUserId = message.from === userId ? message.to : message.from
      if (!chats[otherUserId] || chats[otherUserId].createdAt < message.createdAt) {
         chats[otherUserId] = message
      }
   })
   return Object.entries(chats).map(([user, lastMessage]) => ({
      user,
      lastMessage
   }))
}

export { getChatsWithLatestMessage, listenForMessages, sendMessage, type Chat, type Message }
