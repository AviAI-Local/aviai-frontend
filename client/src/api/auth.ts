import { serverAPI } from './axios'
import Cookies from 'js-cookie'

export async function signup(email: string, password: string, fullName: string, major: string) {
    const response = await serverAPI.post('/account/create', {
        account_name: email,
        user_name: fullName,
        major: major,
        password: password,
        role: 'student',
        avatar: `https://avatar.iran.liara.run/username?username=${fullName}`
    })

    if (response.status === 200) {
        await login(email, password)
    } else {
        return response
    }
}

export async function login(email: string, password: string) {
    const response = await serverAPI.post(
        '/auth/token',
        new URLSearchParams({
            username: email,
            password: password
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    const { access_token: accessToken } = response.data
    // Store JWT in cookies
    Cookies.set('token', accessToken, {
        expires: 2,
        sameSite: 'Lax'
    })
    return accessToken
}

export async function getUser() {
    const res = await serverAPI.get('/auth/me')
    return res.data
}

export async function updateAccountFields(accountId: string, updates: {
    account_name?: string
    user_name?: string
    major?: string
    avatar?: string
    password?: string
}) {
    const res = await serverAPI.patch(`/account/update/${accountId}`, updates)
    return res.data
}

export async function uploadAvatar(accountId: string, file: File) {
    // Convert file to base64 string
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            // Remove the data:image/...;base64, prefix
            const base64String = result.split(',')[1]
            resolve(base64String)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
    
    // Send as JSON with base64 encoded image
    const res = await serverAPI.patch(`/account/update/${accountId}`, {
        avatar: `data:${file.type};base64,${base64}`
    })
    return res.data
}
