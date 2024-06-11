import { RenderAuthLayout, RenderProtectedLayout } from "@/layouts"
import ForgotPassword from "@/pages/authentication/forgotPassword"
import Login from "@/pages/authentication/login"
import Chat from "@/pages/protected/chat"
import ChatsList from "@/pages/protected/chat/list"
import FoodDetection from "@/pages/protected/foodDetection"
import Home from "@/pages/protected/home"
import Library from "@/pages/protected/library"
import MealPlanner from "@/pages/protected/mealPlanner"
import MealPlan from "@/pages/protected/mealPlanner/components/mealPlan"
import Post from "@/pages/protected/post"
import Profile from "@/pages/protected/profile"
import EditProfile from "@/pages/protected/profile/editProfile"
import SavedRecipes from "@/pages/protected/savedRecipes"
import SavedRoutines from "@/pages/protected/savedRoutines"
import Search from "@/pages/protected/search"
import Settings from "@/pages/protected/settings"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
   {
      path: "/auth",
      element: <RenderAuthLayout />,
      children: [
         { element: <Login />, index: true, path: "login" },
         { element: <ForgotPassword />, path: "forgot-password" }
      ]
   },
   {
      path: "/",
      element: <RenderProtectedLayout />,
      children: [
         {
            element: <Home />,
            index: true
         },
         {
            element: <Search />,
            path: "search"
         },
         {
            element: <Library />,
            path: "library",
            children: [
               {
                  element: <div>Recipes</div>,
                  path: "recipes"
               },
               {
                  element: <div>Routine</div>,
                  path: "routine"
               }
            ]
         },
         {
            element: <FoodDetection />,
            path: "photo"
         },
         {
            element: <MealPlanner />,
            path: "tasks"
         },
         {
            element: <MealPlan />,
            path: "meal-planner/:planName"
         },
         {
            path: "profile",
            children: [
               {
                  element: <Profile />,
                  index: true
               },
               {
                  element: <EditProfile />,
                  path: "edit"
               }
            ]
         },
         {
            element: <Settings />,
            path: "settings"
         },
         {
            element: <SavedRecipes />,
            path: "saved-recipes"
         },
         {
            element: <SavedRoutines />,
            path: "saved-routines"
         },
         {
            element: <Profile />,
            path: "user/:id"
         },
         {
            path: "followers/:id",
            element: <Search mode="followers" />
         },
         {
            path: "following/:id",
            element: <Search mode="following" />
         },
         {
            element: <Post />,
            path: "post/:id"
         },
         {
            path: "messages",
            children: [
               {
                  element: <ChatsList />,
                  index: true
               },
               {
                  element: <Chat />,
                  path: ":id"
               }
            ]
         }
      ]
   }
])

export default router
