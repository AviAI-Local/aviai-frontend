import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ApiNotification {
    id: string
    label: string
    status: number
    timestamp: Date
}

interface ApiNotificationContextValue {
    notifications: ApiNotification[]
    addNotification: (label: string, status: number) => void
    dismissNotification: (id: string) => void
}

const ApiNotificationContext = createContext<ApiNotificationContextValue | null>(null)

const AUTO_DISMISS_MS = 5000

export function ApiNotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<ApiNotification[]>([])

    const addNotification = (label: string, status: number) => {
        const id = `${Date.now()}-${Math.random()}`
        setNotifications((prev) => [...prev.slice(-4), { id, label, status, timestamp: new Date() }])
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
        }, AUTO_DISMISS_MS)
    }

    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    return (
        <ApiNotificationContext.Provider value={{ notifications, addNotification, dismissNotification }}>
            {children}
        </ApiNotificationContext.Provider>
    )
}

export function useApiNotification() {
    const ctx = useContext(ApiNotificationContext)
    if (!ctx) throw new Error('useApiNotification must be used within ApiNotificationProvider')
    return ctx
}
