import BottomTabBar from "@/components/bottom-tab-bar"
import React from "react"
import { Outlet, useLocation } from "react-router-dom"

const ProtectedLayout: React.FC = () => {
   const { pathname } = useLocation()

   const isInMessage = /\/messages\/\w+/.test(pathname)

   return (
      <div className="container min-h-screen w-screen px-4 py-5 md:max-w-md">
         {isInMessage ? null : <BottomTabBar />}
         <Outlet />
      </div>
   )
}

export default ProtectedLayout
