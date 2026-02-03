import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export interface PanelLayoutProps {
    title: string
    children?: ReactNode
}

function PanelLayout({ title, children }: PanelLayoutProps) {
    return (
        <Box
            width='25%'
            height='100%'
            
            sx={{
                border: '0.5px solid #C0C8DB',
            }}
        >
            <Box
                sx={{
                    borderBottom: '0.5px solid #C0C8DB',
                    padding: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Typography sx={{
                    fontWeight: 500, 
                    fontSize: 16
                }}>
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    )
}

export default PanelLayout
