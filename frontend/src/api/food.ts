import config from "@/lib/config"
import { IFoodsRequestParams } from "@hienpham512/smarteats"
import axios from "axios"

const baseUrl = `${config.backend.url}/foods`

export const getFoods = async (params: IFoodsRequestParams, accessToken: string) => {
   return axios
      .get(`${baseUrl}`, {
         params,
         headers: {
            Authorization: `Bearer ${accessToken}`
         }
      })
      .then((res) => res.data)
      .catch((e) => console.log(e))
}
