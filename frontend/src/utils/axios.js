import axios from "axios"

const apiURL = import.meta.env.MODE === "production"
    ? "https://studybuddy-bz2d.onrender.com"
    : "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: apiURL,
    withCredentials: true,
})

export default axiosInstance
