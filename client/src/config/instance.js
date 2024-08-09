import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3003"
  // baseURL: "http://18.141.164.100"
})
export default instance