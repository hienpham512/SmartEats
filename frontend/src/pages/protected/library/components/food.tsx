import { getFoods } from "@/api/food"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useUserStore from "@/store/user"
import { IFood, IFoodHint } from "@hienpham512/smarteats"
import React from "react"

const Food: React.FC = () => {
   const { user } = useUserStore()

   const [ingr, setIngr] = React.useState<string>("")
   const [foods, setFoods] = React.useState<IFood[]>([])

   const handleSearchFood = async () => {
      if (ingr.length === 0 || !ingr || !user) return
      try {
         const res = await getFoods({ ingr }, user.accessToken)
         setFoods(res.hints.map((hint: IFoodHint) => hint.food))
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div className="space-y-6 pt-4">
         <div className="flex items-center gap-x-2">
            <Input placeholder="Search food" value={ingr} onChange={(e) => setIngr(e.target.value)} />
            <Button onClick={handleSearchFood}>Search</Button>
         </div>
         <ScrollArea className="h-[600px]">
            <div className="space-y-4">
               {foods.map((food, index) => (
                  <Card key={index}>
                     <CardHeader className="pb-4">
                        <CardTitle>{food.label}</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="flex flex-wrap gap-2">
                           <Badge variant="secondary" className="w-max font-medium tracking-tighter">
                              {food.category}
                           </Badge>
                           {Object.entries(food.nutrients).map(([key, value]) => (
                              <Badge
                                 variant={key === "ENERC_KCAL" ? "default" : "outline"}
                                 key={key}
                                 className="font-medium tracking-tighter"
                              >
                                 {key}: {Math.round(value)}
                                 {key === "ENERC_KCAL" ? " kcal" : " g"}
                              </Badge>
                           ))}
                        </div>
                     </CardContent>
                     <CardFooter className="ml-auto w-max pb-2">
                        <CardDescription className="text-xs">* all values are per 100g</CardDescription>
                     </CardFooter>
                  </Card>
               ))}
            </div>
         </ScrollArea>
      </div>
   )
}

export default Food
