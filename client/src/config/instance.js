import axios from "axios";
const instance = axios.create({
  // baseURL: "http://localhost:3003"
  baseURL: "https://roastify-api.aryajati.my.id/"
})
export default instance