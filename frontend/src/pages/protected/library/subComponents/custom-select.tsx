import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BodyPart, TCuisineType, TDiet, TDishType, THealth, TMealType, Target } from "@hienpham512/smarteats"

interface ICustomSelect {
   placeholder: string
   customEnum:
      | typeof Target
      | typeof BodyPart
      | typeof TCuisineType
      | typeof TDiet
      | typeof TDishType
      | typeof TMealType
      | typeof THealth
   handleSelect: (value: string) => void
}
const CustomSelect: React.FC<ICustomSelect> = ({ placeholder, customEnum, handleSelect }) => {
   const data = Object.values(customEnum)
   return (
      <Select onValueChange={(value) => handleSelect(value)}>
         <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
         </SelectTrigger>
         <SelectContent>
            {data.map((item, index) => (
               <SelectItem key={index} value={item}>
                  {item}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   )
}

export default CustomSelect
