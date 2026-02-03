import { Button, type ButtonProps } from '@mui/material'
import type { ReactNode } from 'react'

interface ControlButtonProps extends ButtonProps {
    icon: ReactNode
    meetingAction: 'normal' | 'primary'
}

function ControlButton({ icon, meetingAction, ...props }: ControlButtonProps) {
    return (
        <Button
            {...props}
            variant='contained'
            sx={{ minWidth: 0, p: 1, borderRadius: 2,
                backgroundColor: meetingAction === 'primary' ? 'error.main' : 'primary.main',
        }}
            disableElevation

        >
            {icon}
        </Button>
    )
}

export default ControlButton
