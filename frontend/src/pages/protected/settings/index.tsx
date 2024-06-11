import ModeToggle from "@/components/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/firebase"
import React from "react"
import { Link } from "react-router-dom"

const Settings: React.FC = () => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Change your settings here or see your saved items here.</CardDescription>
         </CardHeader>
         <Separator />
         <CardContent className="relative flex flex-col gap-4 pt-5">
            <Link to="/saved-recipes" className="w-max">
               <p className="text-sm">Saved recipes</p>
            </Link>
            <Link to="/saved-routines" className="w-max">
               <p className="text-sm">Saved routines</p>
            </Link>
            <p className="w-max text-sm" onClick={() => auth.signOut()}>
               Logout
            </p>
            <div className="absolute bottom-2 right-2 ml-auto w-max">
               <ModeToggle />
            </div>
         </CardContent>
      </Card>
   )
}

export default Settings
