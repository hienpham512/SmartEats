import LoadingSpinner from "@/components/loading-spinner"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import useUserStore from "@/store/user"
import { type IRecipe } from "@hienpham512/smarteats"
import { collection, getDocs, query, where } from "firebase/firestore"
import React from "react"
import { RecipeCard } from "../library/components/recipes"

type TRecipe = {
   recipe: IRecipe
   userId: string
}

const SavedRecipes: React.FC = () => {
   const [allSavedRecipes, setAllSavedRecipes] = React.useState<TRecipe[]>([] as TRecipe[])
   const [isRecipesLoading, setIsRecipesLoading] = React.useState<boolean>(true)
   const { user } = useUserStore()

   React.useEffect(() => {
      ;(async () => {
         setIsRecipesLoading(true)

         const q = query(collection(db, "savedRecipes"), where("userId", "==", user?.uid))
         const querySnapshot = await getDocs(q)

         setAllSavedRecipes(querySnapshot.docs.map((doc) => doc.data() as TRecipe))

         setIsRecipesLoading(false)
      })()
   }, [])

   if (isRecipesLoading) return <LoadingSpinner />
   return (
      <div className="-mx-5">
         <CardHeader>
            <CardTitle>Saved Recipes</CardTitle>
         </CardHeader>
         <CardContent>
            {allSavedRecipes.map(({ recipe }, index) => (
               <RecipeCard key={index} recipe={recipe} />
            ))}
         </CardContent>
      </div>
   )
}

export default SavedRecipes
