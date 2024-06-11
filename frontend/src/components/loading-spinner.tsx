import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react"

interface ILoadingSpinnerProps {
   className?: string
   color?: string
   size?: number
}

const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({ className, color, size }) => {
   return <LoaderCircleIcon className={cn("animate-spin", className)} size={size} color={color} />
}

export default LoadingSpinner
