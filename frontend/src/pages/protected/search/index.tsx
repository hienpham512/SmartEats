import { getFollowers, getFollowing, searchUsers } from "@/api/user"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { IUserData } from "@/types/user"
import { collection, getDocs } from "firebase/firestore"
import React from "react"
import { useParams } from "react-router-dom"
import { Fallback, FollowCard } from "../../../components/FollowCard"

const Search: React.FC<{ mode?: "following" | "followers" }> = ({ mode }) => {
   const [users, setUsers] = React.useState<{ id: string; score: number }[]>([])
   const [search, setSearch] = React.useState<string>(window.location.search.split("=")[1] || "")
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const { id } = useParams<{ id: string | undefined }>()
   const [randomUsers, setRandomUsers] = React.useState<IUserData[]>([])

   React.useEffect(() => {
      if (search && !isLoading && !users.length) findUsers()
      if (!id) return
      if (mode === "following")
         getFollowing(id).then((following) => {
            setUsers(following.map((id) => ({ id, score: 1001 })))
         })
      if (mode === "followers")
         getFollowers(id).then((followers) => {
            setUsers(followers.map((id) => ({ id, score: 1001 })))
         })
   }, [])

   const findUsers = React.useCallback(async () => {
      if (!search) return
      setIsLoading(true)
      console.log(search)

      searchUsers(search)
         .then((foundUsers) =>
            setUsers((prev) => [...prev, ...foundUsers.filter((u) => !prev.find((p) => p.id === u.id))])
         )
         .then(() => {
            setIsLoading(false)
            window.history.pushState({}, "", `${window.location.pathname}?q=${search}`)
         })
   }, [search])

   const handleTextChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         setSearch(e.target.value)
         if (!e.target.value) {
            window.history.pushState({}, "", `${window.location.pathname}`)
            setUsers((prev) => prev.filter((u) => u.score === 1001))
         }
      },
      [setSearch]
   )

   const { userData } = useUserStore()
   const getRandomUsers = React.useCallback(async () => {
      const collectionRef = collection(db, "users")
      const usersSnapshot = await getDocs(collectionRef)
      const randomUsers = usersSnapshot.docs
         .map((doc) => doc.data())
         .filter((user) => user.id !== userData?.id)
         .slice(0, 5)
      setRandomUsers(randomUsers as IUserData[])
   }, [])

   React.useEffect(() => {
      if (mode) return
      getRandomUsers()
   }, [getRandomUsers])

   return (
      <div className="space-y-6 pt-4">
         <form
            onSubmit={(e) => {
               e.preventDefault()
               findUsers()
            }}
            className="flex items-center gap-x-2"
         >
            <Input placeholder="Search users" value={search} onChange={handleTextChange} />
         </form>
         <SearchResults data={users} searching={isLoading} randomUsers={randomUsers} />
      </div>
   )
}

const SearchResults: React.FC<{
   data: {
      id: string
      score: number
   }[]
   searching: boolean
   randomUsers: IUserData[]
}> = ({ data, searching, randomUsers }) => {
   if (!data.length && searching) return <Fallback length={7} />
   if (data.length === 0 && randomUsers)
      return (
         <div className="space-y-4">
            {randomUsers.map(({ id }) => (
               <FollowCard key={id} userId={id} />
            ))}
         </div>
      )

   return (
      <div className="space-y-4">
         {data
            .sort((a, b) => b.score - a.score)
            .map(({ id }) => (
               <FollowCard key={id} userId={id} />
            ))}
      </div>
   )
}

export default Search
