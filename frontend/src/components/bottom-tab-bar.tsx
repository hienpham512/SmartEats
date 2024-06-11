import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { CameraIcon, LibraryBigIcon, LucideIcon, NewspaperIcon, ScrollTextIcon, UserIcon } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

const BottomTabBar: React.FC = () => {
   const navigate = useNavigate()
   const [isScrollDown, setIsScrollDown] = React.useState<boolean>(false)
   const [lastScrollTop, setLastScrollTop] = React.useState<number>(0)

   React.useEffect(() => {
      const handleScroll = () => {
         const currentScrollTop = window.scrollY || document.documentElement.scrollTop

         if (currentScrollTop > lastScrollTop) setIsScrollDown(true)
         else setIsScrollDown(false)

         setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop)
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
   }, [lastScrollTop])

   return (
      <NavigationMenu
         className={`fixed inset-x-5 left-1/2 max-h-16 min-h-16 w-full max-w-screen-xl -translate-x-1/2 rounded-full border-2 border-primary py-3 backdrop-blur transition-all duration-500 ease-in-out md:max-w-md ${
            isScrollDown ? "-bottom-20" : "bottom-2"
         }`}
         style={{ width: "calc(100% - 3rem)" }}
      >
         <NavigationMenuList className="w-screen gap-x-5 px-10 md:max-w-md">
            {bottomTabs.map((tab, index) => (
               <NavigationMenuItem
                  key={index}
                  className={`flex w-full justify-center transition-all duration-500 ease-in-out ${
                     window.location.pathname === tab.route
                        ? "rounded-full border-b border-primary py-2 text-primary"
                        : "text-gray-500"
                  }`}
                  onClick={() => navigate(tab.route)}
               >
                  <tab.icon />
               </NavigationMenuItem>
            ))}
         </NavigationMenuList>
      </NavigationMenu>
   )
}

export default BottomTabBar

interface IBottomTab {
   route: string
   title: string
   icon: LucideIcon
   iconOnly?: boolean
   children?: {
      route: string
      title: string
   }[]
}

const bottomTabs: IBottomTab[] = [
   {
      route: "/",
      title: "Feed",
      icon: NewspaperIcon
   },
   {
      route: "/library",
      title: "Library",
      icon: LibraryBigIcon,
      children: [
         {
            route: "library/recipes",
            title: "Recipes"
         },
         {
            route: "library/routine",
            title: "Routine"
         }
      ]
   },
   {
      route: "/photo",
      title: "Photo",
      icon: CameraIcon,
      iconOnly: true
   },
   {
      route: "/tasks",
      title: "Tasks",
      icon: ScrollTextIcon
   },
   {
      route: "/profile",
      title: "Profile",
      icon: UserIcon
   }
]
