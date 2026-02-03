import { createContext, useContext, useState } from 'react'
import Notification from '../components/common/Notification'
import type { NotificationType } from '../types/common'

type NotificationContextType = {
    setNotify: React.Dispatch<React.SetStateAction<NotificationType>>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notify, setNotify] = useState<NotificationType>({
        message: '',
        type: 'success',
        open: false
    })

    return (
        <NotificationContext.Provider value={{ setNotify }}>
            {children}
            <Notification notify={notify} setNotify={setNotify} />
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
    return ctx
}
