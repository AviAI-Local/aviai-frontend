import { Box, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useApiNotification, type ApiNotification } from '../../contexts/ApiNotificationContext'

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
}

function statusLabel(status: number): string {
    if (status >= 200 && status < 300) return 'Success'
    if (status === 400) return 'Bad Request'
    if (status === 401) return 'Unauthorized'
    if (status === 403) return 'Forbidden'
    if (status === 404) return 'Not Found'
    if (status === 422) return 'Validation Error'
    if (status >= 500) return 'Server Error'
    return 'Error'
}

function NotificationCard({ notification, onDismiss }: { notification: ApiNotification; onDismiss: () => void }) {
    const isSuccess = notification.status >= 200 && notification.status < 300

    const accent = isSuccess ? '#22c55e' : notification.status >= 500 ? '#ef4444' : '#f97316'
    const iconColor = accent
    const statusBg = isSuccess ? '#f0fdf4' : notification.status >= 500 ? '#fef2f2' : '#fff7ed'
    const statusText = isSuccess ? '#15803d' : notification.status >= 500 ? '#b91c1c' : '#c2410c'

    return (
        <Box
            sx={{
                width: 300,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                borderLeft: `4px solid ${accent}`,
                overflow: 'hidden',
                animation: 'slideIn 0.25s ease-out',
                '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateX(40px)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                }
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    pt: 1,
                    pb: 0.5
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {isSuccess ? (
                        <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16, color: iconColor }} />
                    ) : (
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: iconColor }} />
                    )}
                    <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                        {notification.label}
                    </Typography>
                </Box>
                <IconButton size='small' onClick={onDismiss} sx={{ p: 0.25 }}>
                    <CloseRoundedIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                </IconButton>
            </Box>

            {/* Body */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    pb: 1.25
                }}
            >
                {/* Status pill */}
                <Box
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backgroundColor: statusBg,
                        borderRadius: 1,
                        px: 0.75,
                        py: 0.25
                    }}
                >
                    <Typography sx={{ fontWeight: 700, fontSize: 12, color: statusText, fontFamily: 'monospace' }}>
                        {notification.status}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: statusText }}>
                        {statusLabel(notification.status)}
                    </Typography>
                </Box>

                <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>
                    {timeAgo(notification.timestamp)}
                </Typography>
            </Box>

            {/* Progress bar */}
            <Box
                sx={{
                    height: 3,
                    backgroundColor: accent,
                    opacity: 0.3,
                    animation: 'shrink 5s linear forwards',
                    '@keyframes shrink': {
                        from: { width: '100%' },
                        to: { width: '0%' }
                    }
                }}
            />
        </Box>
    )
}

function ApiNotificationStack() {
    const { notifications, dismissNotification } = useApiNotification()

    if (notifications.length === 0) return null

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}
        >
            {notifications.map((n) => (
                <NotificationCard key={n.id} notification={n} onDismiss={() => dismissNotification(n.id)} />
            ))}
        </Box>
    )
}

export default ApiNotificationStack
