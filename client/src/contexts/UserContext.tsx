import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Role } from '../types/common'
import { getUser } from '../api/auth'
import { capitalize } from '../utils/format'

export interface UserContextProps {
    id: string
    username: string
    email: string
    role: Role
    avatarUrl?: string
    notifications?: number
    major?: string
}

interface UserContextType {
    user: UserContextProps | undefined
    loading: boolean
    refetchUser: () => Promise<void>
    logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserContextProps | undefined>()
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        setLoading(true)
        try {
            const data = await getUser()
            setUser({
                id: data.account_id,
                username: data.user_name,
                email: data.account_name || data.email || '',
                role: data.role && (capitalize(data.role) as Role),
                avatarUrl: data.avatar || undefined,
                notifications: 0,
                major: data.major || undefined
            })
        } catch (err) {
            console.error('Error loading user', err)
            Cookies.remove('token')
            setUser(undefined)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        Cookies.remove('token')
        setUser(undefined)
    }

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            setLoading(false)
            return
        }
        fetchUser()
    }, [])

    return <UserContext.Provider value={{ user, loading, refetchUser: fetchUser, logout }}>{children}</UserContext.Provider>
}

const useUserContext = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider')
    }
    return context
}

export { UserProvider, useUserContext }
