import { Chip } from '@mui/material'

interface ApiStatusBadgeProps {
    status: number | null
}

function ApiStatusBadge({ status }: ApiStatusBadgeProps) {
    if (!status) return null

    const isSuccess = status >= 200 && status < 300
    const isClientError = status >= 400 && status < 500

    const colors = isSuccess
        ? { bg: '#e8f5e9', text: '#2e7d32' }
        : isClientError
          ? { bg: '#fff3e0', text: '#e65100' }
          : { bg: '#ffebee', text: '#c62828' }

    return (
        <Chip
            label={String(status)}
            size='small'
            sx={{
                backgroundColor: colors.bg,
                color: colors.text,
                fontWeight: 700,
                fontSize: 11,
                height: 20,
                px: 0.25,
                '& .MuiChip-label': { px: 0.75 }
            }}
        />
    )
}

export default ApiStatusBadge
