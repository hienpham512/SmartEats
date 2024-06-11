import { Chat, Message, getChatsWithLatestMessage } from "@/api/messages"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardTitle } from "@/components/ui/card"
import useUserStore from "@/store/user"
import React from "react"
import { useNavigate } from "react-router-dom"

const ChatItem: React.FC<{ user: string; message: Message }> = ({ user, message }) => {
   const navigate = useNavigate()
   const { other, getOtherUserData } = useUserStore()
   const userData = React.useMemo(() => other.find((u) => u.id === user), [user, other])

   React.useEffect(() => {
      if (!userData) getOtherUserData(user)
   }, [user])

   return (
      <Card className="mx-1 flex items-end gap-x-4 p-4" onClick={() => navigate(`/messages/${userData?.id}`)}>
         <div className="flex items-center gap-x-3">
            <Avatar className="h-14 w-14">
               <AvatarImage src={userData?.avatar ?? "https://github.com/shadcn.png"} />
            </Avatar>
            <div className="flex flex-col justify-center gap-y-0.5 pt-1">
               <p className="text-sm font-semibold">{userData?.name}</p>
               <p className="text-xs text-muted-foreground">{message.message.slice(0, 40)}...</p>
            </div>
         </div>
         <p className="ml-auto text-nowrap text-[10px] text-muted-foreground">
            {message.createdAt.toDate().toLocaleDateString("us", {
               month: "short",
               day: "numeric",
               hour: "numeric",
               minute: "numeric"
            })}
         </p>
      </Card>
   )
}

const ChatsList: React.FC = () => {
   const [chats, setChats] = React.useState<Chat[]>([])
   const { userData } = useUserStore()

   React.useEffect(() => {
      if (!userData) return
      getChatsWithLatestMessage(userData.id).then((chats) => {
         setChats(chats.sort((a, b) => b.lastMessage.createdAt.toMillis() - a.lastMessage.createdAt.toMillis()))
      })
   }, [])
   return (
      <div className="h-full">
         <div className="fixed top-0 -mx-4 w-full bg-background px-4 py-4">
            <CardTitle className="text-xl">Chats</CardTitle>
         </div>
         <div className="-mx-4 flex flex-col overflow-y-auto pt-10">
            {chats.map(({ user, lastMessage }) => (
               <ChatItem key={user} user={user} message={lastMessage} />
            ))}
         </div>
      </div>
   )
}

export default ChatsList
