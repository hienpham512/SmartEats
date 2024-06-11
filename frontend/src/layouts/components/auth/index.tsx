import React from "react"
import { Outlet } from "react-router-dom"

const AuthLayout: React.FC = () => (
   <div className="container min-h-screen pt-24">
      <Outlet />
   </div>
)

export default AuthLayout
