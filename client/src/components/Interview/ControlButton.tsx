import { Button, Icon, type ButtonProps } from '@mui/material'
import type { CustomIconProps } from '../Icons/types'
import { useState } from 'react'

interface ControlButtonProps extends ButtonProps {
    icon: React.ElementType<CustomIconProps>
    selected?: boolean
    hover?: boolean
    baseColor: string
    accentColor: string
}

function ControlButton({ icon, selected, baseColor: baseColor, accentColor, ...props }: ControlButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Button
            {...props}
            variant='contained'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                minWidth: 0,
                px: 0.5,
                py: 0.5,
                height: 40,
                width: 40,
                borderRadius: '50%',
                backgroundColor: selected ? accentColor : baseColor,
                //  '#DCE6FF',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'none',
                gap: 0.5,
                cursor: 'pointer',
                ...{
                    '&:hover': {
                        backgroundColor: accentColor
                    },
                },
                ...props.sx
            }}
            disableElevation
        >
            <Icon className='icon' component={icon} baseColor={selected || isHovered ? baseColor : accentColor} />
        </Button>
    )
}

export default ControlButton
