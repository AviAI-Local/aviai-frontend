import axios from 'axios'
import Cookies from 'js-cookie'

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
    // Without this, axios falls back to relative URLs against the frontend's
    // own origin, so every "API call" silently hits the SPA's static server
    // (index.html) instead of the backend — no network error, just garbage
    // responses that are hard to trace back to a missing env var.
    console.error(
        'VITE_API_BASE_URL is not set. API requests will be sent to the ' +
        'frontend\'s own origin instead of the backend, and will silently fail.'
    )
}

export const serverAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'ngrok-skip-browser-warning': 'true',
    }
})

// Backend origin with no path (e.g. "https://aviai-backend-final.onrender.com"),
// for endpoints mounted outside the /api/v1 prefix (static file serving,
// WebSocket routes) that still need to target the real backend host.
export const API_ORIGIN = API_BASE_URL ? new URL(API_BASE_URL).origin : ''

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
