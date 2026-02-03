import { Button, Typography, type ButtonProps } from '@mui/material'

function EndButton({ ...props }: ButtonProps) {
    return (
        <Button
            {...props}
            sx={{
                width: 120,
                height: 40,
                backgroundColor: '#F25D5A',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                color: 'white',
                textTransform: 'none'
            }}
        >
            <Typography
                sx={{
                    fontWeight: 600,
                    fontSize: 14
                }}
            >
                End Call
            </Typography>
        </Button>
    )
}

export default EndButton
