import { Box } from '@mui/material'
import { useState, type ReactNode } from 'react'
import SideBar from '../LayoutComponent/SideBar'
import Header, { type HeaderProps } from '../LayoutComponent/Header'
import { useNavigate } from 'react-router-dom'
import { useDirtyForm } from '../../contexts/DirtyFormContext'
import ConfirmationDialog from '../common/ConfirmationDialog'
import { DialogType } from '../../constants/notes'

interface PageLayoutProps {
    children: ReactNode
    headerProps: HeaderProps
    noScroll?: boolean
}

function PageLayout({ children, headerProps, noScroll = false }: PageLayoutProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pendingPath, setPendingPath] = useState<string | null>(null)
    const navigate = useNavigate()
    const { isDirty, setIsDirty } = useDirtyForm()
    const handleSidebarClick = (path: string) => {
        if (isDirty) {
            setPendingPath(path)
            setDialogOpen(true)
        } else {
            navigate(path)
        }
    }

    const handleConfirm = () => {
        setIsDirty(false)
        if (pendingPath) {
            navigate(pendingPath)
        }
        setDialogOpen(false)
        setPendingPath(null)
    }

    return (
        <Box display='flex' height='100vh' overflow='hidden'>
            <Box width='240px' bgcolor='#F8F9FD' sx={{ flexShrink: 0 }}>
                <SideBar onNavigate={handleSidebarClick} />
            </Box>

            <Box flex={1} display='flex' flexDirection='column' overflow='auto'>
                <Box height='86px' borderBottom='1px solid #e0e0e0'>
                    <Header {...headerProps} />
                </Box>

                {/* Page Content */}
                <Box
                    flex={1}
                    sx={{
                        overflow: noScroll ? 'hidden' : 'auto'
                    }}
                    my={1}
                >
                    {children}
                </Box>
            </Box>
            <ConfirmationDialog
                open={dialogOpen}
                dialogType={DialogType.Exit}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirm}
            />
        </Box>
    )
}

export default PageLayout
