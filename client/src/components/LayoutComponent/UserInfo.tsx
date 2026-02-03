import { Avatar, Badge, Box, Stack, Typography } from '@mui/material'
import type { Role } from '../../types/common'
import { NotificationsNone } from '@mui/icons-material'
import { useMemo } from 'react'

export interface UserInfoProps {
    username: string
    role: Role
    notifications?: number
    avatarUrl?: string
}

function UserInfo({ username, role, notifications, avatarUrl }: UserInfoProps) {
    console.log('avatarUrl', avatarUrl)
       return (
        <Box display='flex' alignItems='center' gap={4}>
            <Badge
                badgeContent={notifications || null}
                sx={{
                    '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        width: 10,
                        height: 15,
                        top: 4,
                        backgroundColor: '#F25D5A',
                        color: 'white'
                    }
                }}
            >
                {/* <NotificationsNone /> */}
            </Badge>
            <Stack direction='row' spacing={2}>
                <Box textAlign='right'>
                    <Typography variant='subtitle2' fontWeight='bold'>
                        {username}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {role}
                    </Typography>
                </Box>
                <Avatar
                    src={avatarUrl}
                    sx={{
                        bgcolor: avatarUrl ? 'transparent' : '#FCADBD',
                        width: 45,
                        height: 45,
                        borderRadius: 2,
                        fontSize: 16
                    }}
                >
                    {/* {!avatarUrl ? usernameInitials : null} */}
                </Avatar>
            </Stack>
        </Box>
    )
}

export default UserInfo
