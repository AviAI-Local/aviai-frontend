import { Button, Typography } from '@mui/material'

type CTAButtonProps = {
    title: string
    onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => Promise<void>
}

function CTAButton({ title, onClick }: CTAButtonProps) {
    return (
        <Button
            onClick={(e) => onClick(e)}
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: '#3D64FD'
                },
                '&:hover .hover-text': {
                    color: 'white'
                }
            }}
        >
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
        </Button>
    )
}

export default CTAButton