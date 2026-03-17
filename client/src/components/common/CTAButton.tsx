import { Box, Button, CircularProgress, Typography } from '@mui/material'
import ApiStatusBadge from './ApiStatusBadge'

type CTAButtonProps = {
    title: string
    onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => Promise<void>
    loading?: boolean
    apiStatus?: number | null
}

function CTAButton({ title, onClick, loading = false, apiStatus = null }: CTAButtonProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
                onClick={(e) => onClick(e)}
                disabled={loading}
                sx={{
                    backgroundColor: '#F8F9FD',
                    maxWidth: 250,
                    height: 36,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingX: 1,
                    paddingY: 0.5,
                    borderRadius: 3,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: loading ? '#F8F9FD' : '#3D64FD'
                    },
                    '&:hover .hover-text': {
                        color: loading ? '#3D64FD' : 'white'
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#F8F9FD'
                    }
                }}
            >
                {loading ? (
                    <CircularProgress size={18} sx={{ color: '#3D64FD' }} />
                ) : (
                    <Typography
                        className='hover-text'
                        sx={{
                            color: '#3D64FD',
                            fontWeight: 600,
                            fontSize: 18
                        }}
                    >
                        {title}
                    </Typography>
                )}
            </Button>
            <ApiStatusBadge status={apiStatus} />
        </Box>
    )
}

export default CTAButton
