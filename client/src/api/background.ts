import { unsplashAPI } from './axios'

export async function fetchBackground() {
    const response = await unsplashAPI.get('/search/photos', {
        params: {
            query: 'office',
            orientation: 'landscape'
        }
    })
    const results = response.data.results
    const randomIndex = Math.floor(Math.random() * 50) + 1
    return results.length > 0 ? results[randomIndex] : null
}
