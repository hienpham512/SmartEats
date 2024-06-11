import config from "@/lib/config"
import axios from "axios"

const baseUrl = `${config.backend.url}/food-detections`

const fetchFoodData = async (fileData: Uint8Array, accessToken: string) => {
   if (!accessToken) return

   try {
      const response = await axios.post(baseUrl, fileData, {
         headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/octet-stream"
         }
      })
      return response
   } catch (error) {
      console.error("Error:", error)
   }
}

export { fetchFoodData }
