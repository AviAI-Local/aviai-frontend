import { Alert, Snackbar } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'
import type { NotificationType } from '../../types/common'

export interface NotificationProps {
    notify: NotificationType
    setNotify: Dispatch<SetStateAction<NotificationType>>
}
function Notification({ setNotify, notify }: NotificationProps) {
    return (
        <Snackbar open={notify.open} autoHideDuration={2000} onClose={() => setNotify({ ...notify, open: false })}>
            <Alert severity={notify.type} onClose={() => setNotify({ ...notify, open: false })}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}

export default Notification
