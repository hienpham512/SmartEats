import { fetchUserData } from "@/api/user"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { IUserData } from "@/types/user"
import { User, onAuthStateChanged } from "firebase/auth"
import { create } from "zustand"

type IUser = User & {
   accessToken: string
}

interface IUserStore {
   user: IUser | null
   userData: IUserData | null
   other: (IUserData & { followedBy?: string[] })[]
   isUserLoading: boolean
   getOtherUserData: (id: string) => Promise<void>
   logout: () => Promise<void>
   refresh: () => Promise<void>
}

const useUserStore = create<IUserStore>()((set, get) => {
   onAuthStateChanged(auth, (user) => {
      if (!user) return set({ user: null, isUserLoading: false })
      fetchUserData(user.uid).then((userData) => {
         set({ user: user as IUser, userData, isUserLoading: false })
      })
   })

   const refresh = async () => {
      if (!auth.currentUser) return set({ user: null, userData: null })
      fetchUserData(auth.currentUser.uid).then((userData) => {
         set({ user: auth.currentUser as IUser, userData })
      })
   }

   const logout = async () => {
      set({ isUserLoading: true })
      try {
         await auth.signOut()
         set({ user: null, userData: null, isUserLoading: false })
         toast({
            title: "Logged out",
            description: "You have been logged out successfully !"
         })
      } catch (error) {
         console.error("Error logging out: ", error)
      }
   }

   const getOtherUserData = async (id: string) => {
      const userData = await fetchUserData(id, true)
      if (!userData) return
      const other = [...get().other.filter((user) => user.id !== id), userData]
      set({ other })
   }

   return {
      user: null,
      userData: null,
      isUserLoading: true,
      other: [],
      logout,
      refresh,
      getOtherUserData
   }
})

export default useUserStore
