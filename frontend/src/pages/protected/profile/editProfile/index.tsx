import { updateUserData } from "@/api/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import useUserStore from "@/store/user"
import type { IUserData } from "@/types/user"
import React from "react"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Timestamp } from "firebase/firestore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gender } from "@hienpham512/smarteats"

const EditProfile: React.FC = () => {
   const { userData, refresh } = useUserStore()
   const name = React.useRef<HTMLInputElement>(null)
   const username = React.useRef<HTMLInputElement>(null)
   const bio = React.useRef<HTMLTextAreaElement>(null)
   const height = React.useRef<HTMLInputElement>(null)
   const weight = React.useRef<HTMLInputElement>(null)
   const [dateOfBirth, setDateOfBirth] = React.useState<Date | null>(null)
   const [gender, setGender] = React.useState<Gender | null>(null)
   const age = React.useMemo(() => {
      if (userData?.age && !dateOfBirth) return userData.age
      if (!dateOfBirth) return null

      const today = new Date()
      const age = today.getFullYear() - dateOfBirth.getFullYear()
      const isBirthdayPassed =
         today.getMonth() > dateOfBirth.getMonth() ||
         (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate())

      return isBirthdayPassed ? age : age - 1
   }, [dateOfBirth])
   const navigate = useNavigate()

   const handleSubmit = async () => {
      if (!userData?.id) return console.error("No user data found")
      const data: Partial<IUserData> = {
         name: name.current?.value || undefined,
         username: username.current?.value || undefined,
         bio: bio.current?.value || undefined,
         height: height.current?.value ? Number(height.current?.value) : undefined,
         weight: weight.current?.value ? Number(weight.current?.value) : undefined,
         dateOfBirth: dateOfBirth || undefined,
         age: age || undefined,
         gender: gender || undefined
      }
      await updateUserData(userData.id, data).then(() => {
         refresh().then(() => {
            toast({ title: "Profile updated", duration: 1000 })
            navigate("/profile", { replace: true })
         })
      })
   }

   const userDateOfBirth =
      userData?.dateOfBirth instanceof Timestamp ? new Date(userData?.dateOfBirth?.seconds * 1000) : undefined

   return (
      <Card className="space-y-4 pt-4">
         <p className="text-center text-lg font-semibold">Personal Information</p>
         <CardContent className="space-y-2 rounded-md border-y py-4">
            <Input type="text" autoComplete="name" defaultValue={userData?.name} placeholder={"Name"} ref={name} />
            <Input
               type="text"
               autoCapitalize="none"
               autoComplete="username"
               placeholder="Username"
               defaultValue={userData?.username}
               ref={username}
            />
            <textarea
               className="flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
               defaultValue={userData?.bio}
               placeholder="Bio"
               ref={bio}
            />
         </CardContent>
         <CardContent className="space-y-2 rounded-md border-y py-4">
            <p className="text-center text-lg font-semibold">Private Information</p>
            <p className="text-center text-sm text-muted-foreground">
               Your private information is not shared with anyone and used only for internal purposes.
            </p>
            <Popover>
               <PopoverTrigger className="w-full">
                  <Button
                     variant={"outline"}
                     className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && !userDateOfBirth && "text-muted-foreground"
                     )}
                  >
                     {!age && <CalendarIcon className="mr-2 h-4 w-4" />}

                     {dateOfBirth || userDateOfBirth ? (
                        <div className="flex w-full justify-between">
                           <p>
                              <span className="text-muted-foreground">DOB: </span>
                              {dateOfBirth?.toLocaleDateString() || userDateOfBirth?.toLocaleDateString()}
                           </p>
                           <p>
                              <span className="text-muted-foreground">Age: </span> {age}
                           </p>
                        </div>
                     ) : (
                        <>Date of birth</>
                     )}
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-full">
                  <Calendar
                     mode="single"
                     selected={dateOfBirth || userDateOfBirth}
                     onSelect={(date) => setDateOfBirth(new Date(date!))}
                     captionLayout="dropdown"
                     fromYear={1950}
                     toYear={2008}
                  />
               </PopoverContent>
            </Popover>
            <Select defaultValue={userData?.gender ?? ""} onValueChange={(value) => setGender(value as Gender)}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gender" className="placeholder:text-muted-foreground" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value={Gender.Male}>Male</SelectItem>
                  <SelectItem value={Gender.Female}>Female</SelectItem>
               </SelectContent>
            </Select>
            <Input
               ref={height}
               type="number"
               placeholder={userData?.height ? `${userData?.height} cm` : "Height (cm)"}
            />
            <Input
               ref={weight}
               type="number"
               placeholder={userData?.weight ? `${userData?.weight} kg` : "Weight (kg)"}
            />
         </CardContent>
         <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
               Save changes
            </Button>
         </CardFooter>
      </Card>
   )
}

export default EditProfile
