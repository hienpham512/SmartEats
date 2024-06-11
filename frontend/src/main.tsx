import ThemeProvider from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import router from "./router"

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <Toaster />
         <RouterProvider router={router} />
      </ThemeProvider>
   </React.StrictMode>
)
