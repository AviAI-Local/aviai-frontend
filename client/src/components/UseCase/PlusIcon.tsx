import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

type PlusIconProps = {
    title: string
    onClick?: () => void
}

function PlusIcon({ title, onClick }: PlusIconProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                width: 'fit-content',
                height: 30,
                borderRadius: 1.5,
                overflow: 'hidden',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                backgroundColor: '#3D64FD',
                cursor: 'pointer'
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#3D64FD',
                    px: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: title ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'
                }}
            >
                <AddIcon sx={{ color: 'white' }} />
            </Box>

            {title && (
                <Box
                    sx={{
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: 14,
                            color: 'white'
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default PlusIcon
