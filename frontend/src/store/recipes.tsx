import { getRecipes } from "@/api/recipes"
import { IRecipe, TDishType } from "@hienpham512/smarteats"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

type RecipesStore = {
   recipes: IRecipe[]
   query: string
   isRecipesLoading: boolean
   lastSynced: Date | null
   fetchRecipes: (token: string) => void
   setQuery: (query: string) => void
}

const useRecipesStore = create<RecipesStore>()(
   devtools(
      persist(
         (set) => ({
            recipes: [],
            isRecipesLoading: true,
            lastSynced: null,
            query: "",
            fetchRecipes: async (token: string) => {
               await getRecipes(
                  { q: useRecipesStore.getInitialState().query, dishType: TDishType.MAIN_COURSE },
                  token
               ).then((res) =>
                  set({
                     recipes: res?.hits,
                     isRecipesLoading: false,
                     lastSynced: new Date()
                  })
               )
            },
            setQuery: (query: string) => set({ query })
         }),
         {
            name: "recipes"
         }
      )
   )
)

export default useRecipesStore
