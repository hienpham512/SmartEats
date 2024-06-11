//TODO ADD error handling with toasts
import { getRecipeWithFilters } from "@/api/recipes"
import LoadingSpinner from "@/components/loading-spinner"
import SkeletonLoader from "@/components/skeleton-loader"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger
} from "@/components/ui/sheet"
import useRecipesStore from "@/store/recipes"
import useUserStore from "@/store/user"
import { IRecipe, TCuisineType, TDiet, TDishType, THealth, TMealType } from "@hienpham512/smarteats"
import { BookmarkIcon } from "lucide-react"
import React from "react"
import CustomSelect from "../subComponents/custom-select"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "@/components/ui/use-toast"

const Recipes: React.FC = () => {
   const { user } = useUserStore()
   const { recipes, isRecipesLoading, fetchRecipes, lastSynced } = useRecipesStore()
   const [filters, setFilters] = React.useState<TRecipeFilters>({
      calories: "",
      cuisineType: "" as TCuisineType,
      diet: "" as TDiet,
      dishType: "" as TDishType,
      mealType: "" as TMealType,
      health: "" as THealth
   })
   React.useEffect(() => {
      if (
         recipes &&
         recipes.length !== 0 &&
         lastSynced &&
         new Date().getTime() - new Date(lastSynced).getTime() < 1000 * 60 * 60 * 24
      )
         return
      fetchRecipes(user!.accessToken)
   }, [])

   if (isRecipesLoading) return <SkeletonLoader variant="cardGrid" />
   return (
      <>
         <RecipeSearchSheet {...{ filters, setFilters }} />
         <div className="grid grid-cols-1 gap-y-8 pt-6">
            {recipes.map((recipe, index) => (
               <RecipeCard key={index} recipe={recipe} />
            ))}
         </div>
      </>
   )
}

export default Recipes

type IRecipeCard = {
   recipe: IRecipe
   footer?: boolean
}

//TODO: export from components
export const RecipeCard: React.FC<IRecipeCard> = ({ recipe, footer = true }) => {
   const { user } = useUserStore()
   const {
      recipe: {
         image,
         label,
         totalNutrients,
         healthLabels,
         cuisineType: cuisine,
         dishType: dish,
         totalCO2Emissions,
         yield: servings,
         ingredientLines,
         url
      }
   } = recipe

   const calories = {
      label: "Calories",
      quantity: Math.round(totalNutrients.ENERC_KCAL.quantity),
      unit: totalNutrients.ENERC_KCAL.unit
   }

   const dishType = dish?.[0]
   const cuisineType = cuisine?.[0]

   const dishMainInfo = [
      { variant: "secondary", text: dishType },
      { variant: "secondary", text: cuisineType },
      { variant: "secondary", text: `${servings} servings` },
      {
         variant: "default",
         text: `${calories.label}/Servings: ${Math.round(Number(calories.quantity) / servings)}${calories.unit}`
      },
      { variant: "destructive", text: `${Math.round(totalCO2Emissions)} CO2 emissions` }
   ]

   const handleSaveRecipe = async () => {
      await addDoc(collection(db, "savedRecipes"), {
         userId: user?.uid,
         recipe
      })
         .catch((error) => {
            console.error(error)
            toast({ title: `Failed to save`, duration: 1000 })
         })
         .finally(() => {
            toast({ title: `Recipe saved`, duration: 1000 })
         })
   }

   return (
      <Card
         onClick={() => {
            window.open(url, "_blank")
         }}
      >
         <CardHeader className="-m-6">
            <div
               className="relative flex h-56 w-full rounded-xl rounded-b-none bg-cover bg-center bg-no-repeat"
               style={{
                  backgroundImage: `url(${image})`
               }}
            >
               <img src={image} alt={label} className="h-full w-full rounded-xl object-contain backdrop-blur-sm" />
            </div>
            <div className="flex items-center justify-between">
               <CardTitle className="line-clamp-1 px-6">{label}</CardTitle>
               <Button
                  variant="ghost"
                  onClick={(e) => {
                     e.stopPropagation()
                     handleSaveRecipe()
                  }}
                  className="ml-auto mt-auto"
               >
                  <BookmarkIcon color="#F97316" size={20} />
               </Button>
            </div>
         </CardHeader>
         <CardContent className="space-y-2 pb-0 pt-3">
            <ul className="space-y-2 px-3.5">
               {dishMainInfo.map((info, index) => (
                  <Badge
                     key={index}
                     variant={info.variant as "secondary" | "default" | "destructive" | "outline" | null | undefined}
                     className="list-item w-max list-disc capitalize tracking-tighter"
                  >
                     {info.text}
                  </Badge>
               ))}
            </ul>
            {footer && (
               <Accordion type="multiple">
                  <AccordionItem value="nutrients">
                     <AccordionTrigger onClick={(e) => e.stopPropagation()}>Nutrients</AccordionTrigger>
                     <AccordionContent>
                        <ul className="space-y-2 px-4">
                           {Object.entries(totalNutrients).map(([key, value]) => (
                              <Badge
                                 variant="secondary"
                                 key={key}
                                 className="list-item w-max list-disc font-medium tracking-tighter"
                              >
                                 {value.label}: {Math.round(value.quantity)}
                                 {value.unit}
                              </Badge>
                           ))}
                        </ul>
                     </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ingredients">
                     <AccordionTrigger onClick={(e) => e.stopPropagation()}>Ingredients</AccordionTrigger>
                     <AccordionContent>
                        <ul className="space-y-2 px-4">
                           {ingredientLines.map((ingredient, index) => (
                              <Badge
                                 variant="outline"
                                 key={index}
                                 className="list-item w-fit list-disc font-medium tracking-tighter"
                              >
                                 {ingredient}
                              </Badge>
                           ))}
                        </ul>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            )}
         </CardContent>
         <CardFooter className="w-full">
            {footer && (
               <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="healthLabels">
                     <AccordionTrigger onClick={(e) => e.stopPropagation()}>Health Labels</AccordionTrigger>
                     <AccordionContent>
                        <div className="flex flex-wrap gap-3">
                           {healthLabels.map((healthLabel, index) => (
                              <Badge key={index} variant="secondary" className="min-w-max">
                                 {healthLabel}
                              </Badge>
                           ))}
                        </div>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            )}
         </CardFooter>
      </Card>
   )
}

type IRecipeSearchSheet = {
   filters: TRecipeFilters
   setFilters: React.Dispatch<React.SetStateAction<TRecipeFilters>>
}
const RecipeSearchSheet: React.FC<IRecipeSearchSheet> = ({ filters, setFilters }) => {
   const { user } = useUserStore()
   const [query, setQuery] = React.useState<string>("")
   const [searchResults, setSearchResults] = React.useState<IRecipe[]>([])
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const handleGetRecipes = async () => {
      setIsLoading(true)
      try {
         const res = await getRecipeWithFilters(
            {
               ...Object.entries({ q: query, ...filters }).reduce((a, [k, v]) => (v ? { ...a, [k]: v } : a), {})
            },
            user!.accessToken
         )
         setSearchResults(
            res!.hits.map((hit) => ({
               recipe: hit.recipe
            }))
         )
      } catch (error) {
         console.log(error)
      }
      setIsLoading(false)
   }

   const selectedFilters = React.useMemo(
      () => ({
         ...Object.entries({ q: query, ...filters }).reduce((a, [k, v]) => (v ? { ...a, [k]: v } : a), {})
      }),
      [query, filters]
   )

   const handleResetSearch = () => {
      setQuery("")
      setFilters({
         calories: "",
         cuisineType: "" as TCuisineType,
         diet: "" as TDiet,
         dishType: "" as TDishType,
         mealType: "" as TMealType,
         health: "" as THealth
      })
      setSearchResults([])
   }
   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button variant="outline" asChild className="w-full justify-start">
               <p className="opacity-60">Search for a recipe...</p>
            </Button>
         </SheetTrigger>
         <SheetContent className="w-full" side="bottom">
            {searchResults.length !== 0 ? (
               <div className="space-y-4">
                  <SheetHeader>
                     <SheetTitle>Search Results</SheetTitle>
                     <SheetDescription className="mx-auto flex flex-wrap gap-1">
                        {Object.values(selectedFilters).map((filter, index) => (
                           <Badge
                              key={index}
                              variant="secondary"
                              className="w-max list-disc capitalize tracking-tighter"
                           >
                              {filter as string}
                           </Badge>
                        ))}
                     </SheetDescription>
                  </SheetHeader>
                  <Carousel className="w-full">
                     <CarouselContent className="relative">
                        {searchResults.map((recipe, index) => (
                           <CarouselItem className="basis-[90%]" key={index}>
                              <RecipeCard recipe={recipe} footer={false} />
                           </CarouselItem>
                        ))}
                     </CarouselContent>
                  </Carousel>
                  <Button className="w-full" onClick={handleResetSearch}>
                     Reset search
                  </Button>
               </div>
            ) : (
               <div>
                  <SheetHeader>
                     <SheetTitle>Recipe search</SheetTitle>
                     <SheetDescription>You can search for a recipe here, apply filters etc..</SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                     <Input
                        type="text"
                        placeholder="Ex. Chicken....."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                     />
                     <Accordion type="single" collapsible defaultValue="filters">
                        <AccordionItem value="filters">
                           <AccordionTrigger>Apply Filters</AccordionTrigger>
                           <AccordionContent className="grid grid-cols-1 gap-2">
                              <Input
                                 type="text"
                                 placeholder="Max calories.... Ex: 2000"
                                 onChange={(e) => {
                                    if (isNaN(Number(e.target.value))) return
                                    setFilters({ ...filters, calories: e.target.value })
                                 }}
                                 value={filters.calories}
                              />
                              <CustomSelect
                                 customEnum={TCuisineType}
                                 placeholder="Cuisine type"
                                 handleSelect={(value) =>
                                    setFilters({ ...filters, cuisineType: value as TCuisineType })
                                 }
                              />
                              <CustomSelect
                                 customEnum={TDiet}
                                 placeholder="Diet type"
                                 handleSelect={(value) => setFilters({ ...filters, diet: value as TDiet })}
                              />
                              <CustomSelect
                                 customEnum={TDishType}
                                 placeholder="Dish type"
                                 handleSelect={(value) => setFilters({ ...filters, dishType: value as TDishType })}
                              />
                              <CustomSelect
                                 customEnum={TMealType}
                                 placeholder="Meal type"
                                 handleSelect={(value) => setFilters({ ...filters, mealType: value as TMealType })}
                              />
                              <CustomSelect
                                 customEnum={THealth}
                                 placeholder="Health type"
                                 handleSelect={(value) => setFilters({ ...filters, health: value as THealth })}
                              />
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>
                  <SheetFooter>
                     <Button onClick={handleGetRecipes}>{isLoading ? <LoadingSpinner /> : "Search"}</Button>
                  </SheetFooter>
               </div>
            )}
         </SheetContent>
      </Sheet>
   )
}

type TRecipeFilters = {
   calories: string
   cuisineType: TCuisineType
   diet: TDiet
   dishType: TDishType
   mealType: TMealType
   health: THealth
}
