import { listenForMessages, sendMessage, type Message } from "@/api/messages"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import useUserStore from "@/store/user"
import { Timestamp } from "firebase/firestore"
import { XCircleIcon } from "lucide-react"
import React from "react"
import { useNavigate, useParams } from "react-router-dom"

const Message: React.FC<{ mine?: boolean; value: string; createdAt: Timestamp }> = ({
   mine = false,
   value,
   createdAt
}) => {
   return (
      <div className={`mb-2 ${mine ? "self-end" : "self-start"}`}>
         <CardDescription
            className={`${mine ? "bg-gray-200 text-gray-700" : "bg-primary text-white"} inline-block rounded-lg px-4 py-2`}
         >
            {value}
         </CardDescription>
         <CardDescription className={`${mine ? "ml-auto" : "mr-auto"} mt-1 w-max text-[8px]`}>
            {createdAt.toDate().toLocaleDateString("us", {
               month: "short",
               day: "numeric",
               hour: "numeric",
               minute: "numeric"
            })}
         </CardDescription>
      </div>
   )
}

const Chat: React.FC = () => {
   const { id } = useParams<{ id: string }>()
   const { userData, other, getOtherUserData } = useUserStore()
   const [text, setText] = React.useState("")
   const [messages, setMessages] = React.useState<Message[]>([])
   const navigate = useNavigate()

   const data = React.useMemo(() => other.find((user) => user.id === id), [id, other])

   React.useEffect(() => {
      if (!data && id) getOtherUserData(id)
   }, [id])

   const handleSendMessage = () => {
      if (!userData || !id) return
      sendMessage(userData.id, id, text).then((res) => {
         setText("")
         if (!res) toast({ title: "Failed to send message." })
      })
   }

   React.useEffect(() => {
      if (!userData || !id) return

      const unsubscribe = listenForMessages(userData.id, id, (messages) =>
         setMessages(messages.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()))
      )

      return () => unsubscribe()
   }, [])

   return (
      <div className="h-full">
         <div className="fixed top-0 z-50 -mx-4 flex w-full items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-x-2">
               <Avatar className="h-10 w-10" onClick={() => navigate(`/user/${data?.id}`)}>
                  <AvatarImage src={data?.avatar ?? "https://github.com/shadcn.png"} />
               </Avatar>
               <CardTitle>{data?.name || data?.username}</CardTitle>
            </div>
            <XCircleIcon onClick={() => navigate(-1)} />
         </div>
         <div className="mt-5 flex h-full flex-col overflow-y-auto py-14">
            {messages.map(({ message, id, createdAt, from }) => (
               <Message key={id} mine={from === userData?.id} value={message} createdAt={createdAt} />
            ))}
         </div>

         <div className="fixed bottom-0 -mx-4 flex w-full items-stretch gap-x-2 border-t bg-background p-4">
            <Input
               id="user-input"
               type="text"
               placeholder="Type a message"
               autoComplete="off"
               onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage()
               }}
               value={text}
               onChange={(e) => setText(e.target.value)}
            />
            <Button id="send-button" disabled={!text || !text.trim()} onClick={handleSendMessage}>
               Send
            </Button>
         </div>
      </div>
   )
}

export default Chat
