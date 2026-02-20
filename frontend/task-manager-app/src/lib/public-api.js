import axios from "axios"

const publicApi = axios.create({
  baseURL: "https://te.urbantrends.dev/",
})

export default publicApi
