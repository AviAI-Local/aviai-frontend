import { ListItemButton, ListItemIcon, Typography } from '@mui/material'
import { useState, type ComponentType } from 'react'
import type { CustomIconProps } from '../Icons/types'
import { useLocation } from 'react-router-dom'

interface SidebarItemProps {
    label: string
    Icon: ComponentType<CustomIconProps>
    selected?: boolean
    onClick?: () => void
}

function SidebarItem({ label, Icon, selected = false, onClick }: SidebarItemProps) {
    const [hovered, setHovered] = useState(false)

    const baseColor = selected || hovered ? '#DCE6FF' : '#3D64FD'
    const accentColor = selected || hovered ? '#F25D5A' : '#FCADBD'

    return (
        <ListItemButton
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                borderRadius: 2,
                px: 2,
                py: 2,
                mx: 1.5,
                color: selected ? 'primary.contrastText' : '#636363',
                backgroundColor: selected ? 'primary.main' : 'transparent',
                '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                }
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon baseColor={baseColor} accentColor={accentColor} />
            </ListItemIcon>

            <Typography variant='subtitle2' fontWeight='bold'>
                {label}
            </Typography>
        </ListItemButton>
    )
}

export default SidebarItem
