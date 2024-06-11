import googleIcon from "@/assets/icons/googleIcon.svg"
import smartEatsLogo from "@/assets/logos/smartEatsLogo.png"
import LoadingSpinner from "@/components/loading-spinner"
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { auth, db } from "@/lib/firebase"
import {
   GoogleAuthProvider,
   UserCredential,
   createUserWithEmailAndPassword,
   fetchSignInMethodsForEmail,
   signInWithEmailAndPassword,
   signInWithPopup
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import React from "react"
import { Link } from "react-router-dom"

const Login: React.FC = () => {
   const [email, setEmail] = React.useState<string>("")
   const [password, setPassword] = React.useState<string>("")

   const [isNewUser, setIsNewUser] = React.useState<boolean>(false)
   const [signinLoading, setSigninLoading] = React.useState<boolean>(false)
   const [googleSigninLoading, setGoogleSigninLoading] = React.useState<boolean>(false)
   const [signupLoading, setSignupLoading] = React.useState<boolean>(false)

   const handleAddUserToFirestore = async (userCredential: UserCredential) => {
      const docRef = doc(db, "users", userCredential.user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) return
      await setDoc(docRef, {
         id: userCredential.user.uid,
         email: userCredential.user.email
      })
   }
   const handleSingin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      if (signInMethods.length === 0) return setIsNewUser(true)
      setSigninLoading(true)
      try {
         await signInWithEmailAndPassword(auth, email, password)
         toast({
            title: "Login Successful"
         })
      } catch (error) {
         console.log(error)
         toast({
            title: "Login Failed",
            description: "Please check your email and password"
         })
      }
      setSigninLoading(false)
   }
   const handleSignup = async () => {
      setSignupLoading(true)
      try {
         const res = await createUserWithEmailAndPassword(auth, email, password)
         handleAddUserToFirestore(res)
         toast({
            title: "Account Created"
         })
      } catch (error) {
         console.log(error)
      }
      setSignupLoading(false)
      setIsNewUser(false)
   }
   const handleSigninWithGoogle = async () => {
      setGoogleSigninLoading(true)
      try {
         const provider = new GoogleAuthProvider()
         const res = await signInWithPopup(auth, provider)
         handleAddUserToFirestore(res)
         toast({
            title: "Login Successful"
         })
      } catch (error) {
         console.log(error)
      }
      setGoogleSigninLoading(false)
   }

   return (
      <form onSubmit={handleSingin}>
         <AlertDialog open={isNewUser}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Welcome aboard !</AlertDialogTitle>
                  <AlertDialogDescription>
                     Would you like to create an account with the email <strong>{email}</strong> ? Make sure you have
                     access to this email and you remember your password.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsNewUser(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSignup}>
                     {signupLoading ? <LoadingSpinner /> : "Create Account"}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <Card className="relative mx-auto max-w-sm">
            <img src={smartEatsLogo} className="absolute right-2 top-2 h-10 w-10" />
            <CardHeader>
               <CardTitle className="text-2xl">SmartEats Login</CardTitle>
               <CardDescription>Enter your email below to login or signup to your account</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link to="forgot-password" className="ml-auto inline-block text-sm underline">
                           Forgot your password?
                        </Link>
                     </div>
                     <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="*************"
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full">
                     {signinLoading ? <LoadingSpinner /> : "Login"}
                  </Button>
                  <Button
                     type="button"
                     variant="outline"
                     className="inline-flex w-full gap-x-4"
                     onClick={handleSigninWithGoogle}
                  >
                     {googleSigninLoading ? (
                        <LoadingSpinner />
                     ) : (
                        <>
                           <img src={googleIcon} className="h-5 w-5" />
                           <p>Login with Google</p>
                        </>
                     )}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </form>
   )
}

export default Login
