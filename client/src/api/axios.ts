import axios from 'axios'
import Cookies from 'js-cookie'

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

export const serverAPI = axios.create({
    // baseURL: 'https://6cb6d80a5613.ngrok-free.app/api/v1',  // to be adjusted
    // baseURL: 'http://localhost:8115/api/v1',
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        'ngrok-skip-browser-warning': 'true',
    }
})

serverAPI.interceptors.request.use((config) => {
    const token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const unsplashAPI = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
})
