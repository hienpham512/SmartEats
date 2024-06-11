import LoadingSpinner from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth"
import { CornerUpLeftIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

const ForgotPassword: React.FC = () => {
   const navigate = useNavigate()

   const [email, setEmail] = React.useState<string>("")
   const [isLoading, setIsLoading] = React.useState<boolean>(false)

   const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      if (signInMethods.length === 0) {
         setIsLoading(false)
         toast({
            title: "Email not found",
            description: "Please enter a valid email address"
         })
         setEmail("")
         return
      }
      if (signInMethods.includes("google.com")) {
         toast({
            title: "Google account",
            description: "Please use the Google sign in option"
         })
         setTimeout(() => navigate("/"), 1000)
         setIsLoading(false)
         setEmail("")
         return
      }
      try {
         await sendPasswordResetEmail(auth, email)
         toast({
            title: "Password reset email sent",
            description: "Please check your email for further instructions"
         })
         setTimeout(() => navigate("/auth/login"), 1000)
         setEmail("")
      } catch (error) {
         console.error(error)
      }
      setIsLoading(false)
   }

   return (
      <form onSubmit={resetPassword}>
         <Card className="relative w-full max-w-sm">
            <Button variant="link" className="absolute right-2 top-2" onClick={() => navigate("/")}>
               <CornerUpLeftIcon color="#fff" size={20} />
            </Button>
            <CardHeader>
               <CardTitle className="text-2xl">Forgot password</CardTitle>
               <CardDescription>Enter your email below to receive instructions to reset your password.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     type="email"
                     placeholder="m@example.com"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
            </CardContent>
            <CardFooter>
               <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Reset password"}
               </Button>
            </CardFooter>
         </Card>
      </form>
   )
}

export default ForgotPassword
