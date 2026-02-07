import { Box } from '@mui/material'
import HomeIcon from '../Icons/HomeIcon'
import BriefcaseIcon from '../Icons/BriefcaseIcon'
import NoteIcon from '../Icons/NoteIcon'
import HistoryIcon from '../Icons/HistoryIcon'
import LogoutIcon from '../Icons/LogoutIcon'
import SidebarItem from './SidebarItem'
import ProfileIcon from '../Icons/ProfileIcon'
import Logo from '../Icons/Logo'
import { useLocation } from 'react-router-dom'
import { useUserContext } from '../../contexts/UserContext'

function SideBar({ onNavigate }: { onNavigate: (path: string) => void }) {
    const location = useLocation()
    const { logout } = useUserContext()
    const isSelected = (path: string, exact: boolean = false) => {
        if (exact) {
            return location.pathname === path
        }
        return location.pathname.startsWith(path)
    }

    return (
        <Box display='flex' flexDirection='column' justifyContent='space-between' height='100vh'>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Logo />
                </Box>
                <Box display='flex' flexDirection='column' gap={1} marginTop={5}>
                    {/* <SidebarItem
                        Icon={HomeIcon}
                        label='Dashboard'
                        selected={isSelected('/', true)}
                        onClick={() => onNavigate('/')}
                    /> */}
                    <SidebarItem
                        Icon={BriefcaseIcon}
                        label='Use Case'
                        selected={isSelected('/scenarios')}
                        onClick={() => onNavigate('/scenarios')}
                    />
                    <SidebarItem
                        Icon={NoteIcon}
                        label='Notes'
                        selected={isSelected('/notes')}
                        onClick={() => onNavigate('/notes')}
                    />
                    <SidebarItem
                        Icon={HistoryIcon}
                        label='History'
                        selected={isSelected('/history')}
                        onClick={() => onNavigate('/history')}
                    />
                    <SidebarItem
                        Icon={ProfileIcon}
                        label='Profile'
                        selected={isSelected('/profile')}
                        onClick={() => onNavigate('/profile')}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    paddingY: 2
                }}
            >
                <SidebarItem Icon={LogoutIcon} label='Log Out' onClick={logout} />
            </Box>
        </Box>
    )
}

export default SideBar
