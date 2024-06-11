import LoadingSpinner from "@/components/loading-spinner"
import useUserStore from "@/store/user"
import { Navigate } from "react-router-dom"
import { AuthLayout, ProtectedLayout } from "./components"

enum RedirectPath {
   AUTH = "/auth",
   PROTECTED = "/"
}

const withRenderLayout = (Component: React.FC, redirectPath: string) => {
   return () => {
      const { isUserLoading, user } = useUserStore()

      if (isUserLoading)
         return (
            <div className="container flex min-h-screen justify-center pt-24">
               <LoadingSpinner />
            </div>
         )
      if (user && redirectPath === RedirectPath.AUTH) return <Navigate to="/" />
      if (!user && redirectPath === RedirectPath.PROTECTED) return <Navigate to="/auth/login" />

      return <Component />
   }
}
const RenderAuthLayout = withRenderLayout(AuthLayout, "/auth")
const RenderProtectedLayout = withRenderLayout(ProtectedLayout, "/")

export { RenderAuthLayout, RenderProtectedLayout }
