import axios from "axios"

const axiosInstance=axios.create({
    baseURL:"https://studybuddy-bz2d.onrender.com",
    withCredentials:true,
})

export default axiosInstance
