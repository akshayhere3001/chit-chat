import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api", 
    withCredentials: true,    // with this we can send cookies at every single request
})