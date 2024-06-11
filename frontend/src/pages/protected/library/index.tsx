import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Recipes from "./components/recipes"
import Routine from "./components/routine"
import Food from "./components/food"

interface ILibraryProps {}

const Library: React.FC<ILibraryProps> = () => {
   return (
      <Tabs defaultValue="recipes">
         <TabsList className="grid grid-cols-3">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="routines">Routines</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
         </TabsList>
         <TabsContent value="recipes">
            <Recipes />
         </TabsContent>
         <TabsContent value="routines">
            <Routine />
         </TabsContent>
         <TabsContent value="food">
            <Food />
         </TabsContent>
      </Tabs>
   )
}

export default Library
