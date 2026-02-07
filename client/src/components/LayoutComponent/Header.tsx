import { Box, Divider, Stack, Typography } from '@mui/material'
import SearchBar from './SearchBar'
import UserInfo from './UserInfo'
import { useUserContext } from '../../contexts/UserContext'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export interface HeaderProps {
    title: string
    total?: number
    pageType?: string
}

function Header({ title, total, pageType }: HeaderProps) {
    const location = useLocation()

    const { user } = useUserContext()

    const [displaySearchBar, setDisplaySearchBar] = useState(false)

    useEffect(() => {
        // Show search bar only on use cases page
        if (location.pathname === '/scenarios') {
            setDisplaySearchBar(true)
        } else {
            setDisplaySearchBar(false)
        }
    }, [location.pathname])

    return (
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ padding: 2 }}>
            <Box display='flex' gap={2} alignItems='center' justifyContent='center'>
                <Typography variant='h3'>{title}</Typography>
                <Divider
                    orientation='vertical'
                    variant='middle'
                    sx={{
                        color: '#9FA7BE',
                        height: '2rem',
                        borderRightWidth: 2,
                        mx: 1
                    }}
                />
                {pageType && typeof total === 'number' && total > 0 && (
                    <Typography variant='subtitle1' color='#9FA7BE' fontWeight='bold'>
                        <span style={{ color: '#F25D5A' }}>{total}</span> {pageType}
                    </Typography>
                )}
            </Box>
            {/* {displaySearchBar && (
                <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                        <SearchBar />
                    </Box>
                </Box>
            )} */}
            {user && (
                <UserInfo
                    username={user.username}
                    notifications={user.notifications}
                    role={user.role}
                    avatarUrl={user.avatarUrl}
                />
            )}
        </Stack>
    )
}

export default Header
