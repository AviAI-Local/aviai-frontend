import { Button, Typography, type ButtonProps } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface ButtonIconProps extends ButtonProps {
    selected?: boolean
    setSelected?: (val: boolean) => void
    number?: number
    icon: SvgIconComponent
    hover?: boolean
    actionType?: 'info' | 'danger'
}

function ButtonIcon({
    selected = false,
    setSelected,
    number = 0,
    icon: Icon,
    hover = true,
    actionType = 'info',
    ...props
}: ButtonIconProps) {
    return (
        <Button
            onClick={() => setSelected?.(!selected)}
            disableElevation
            {...props}
            sx={{
                minWidth: 0,
                px: 0.5,
                py: 0.5,
                height: 30,
                borderRadius: 1.5,
                backgroundColor:
                    selected || (number > 0 && actionType === 'danger')
                        ? 'error.main'
                        : selected || (number > 0 && actionType === 'info')
                          ? '#3D64FD'
                          : 'white',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'none',
                gap: 0.5,
                cursor: 'pointer',
                ...(hover && {
                    '&:hover': {
                        backgroundColor: actionType === 'info' ? '#3D64FD' : 'error.main'
                    },
                    '&:hover svg': {
                        color: 'white'
                    }
                }),
                ...props.sx
            }}
        >
            <Icon
                sx={{
                    color: selected || number > 0 ? 'white' : actionType === 'info' ? '#3D64FD' : 'error.main',
                    width: 18,
                    height: 18
                }}
            />
            {number > 0 && (
                <Typography
                    sx={{
                        color: 'white',
                        fontWeight: 500,
                        fontSize: 14,
                        animation: 'fadeInUp 0.3s ease-out'
                    }}
                >
                    / {number}
                </Typography>
            )}
        </Button>
    )
}

export default ButtonIcon
