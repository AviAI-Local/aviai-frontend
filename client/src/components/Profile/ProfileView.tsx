import { Box, Typography } from '@mui/material'

interface ProfileViewProps {
    user: {
        firstName: string
        lastName: string
        email: string
        role: string
        major: string
    }
}

function ProfileView({ user }: ProfileViewProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Row 1: First Name and Last Name */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A', mb: 0.5 }}>
                        First Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#29293A', padding: '12px', backgroundColor: '#F8F9FD', borderRadius: '12px', border: '1px solid #C0C8DB' }}>
                        {user.firstName}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A', mb: 0.5 }}>
                        Last Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#29293A', padding: '12px', backgroundColor: '#F8F9FD', borderRadius: '12px', border: '1px solid #C0C8DB' }}>
                        {user.lastName}
                    </Typography>
                </Box>
            </Box>

            {/* Row 2: Email, Role, and Major */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 2.1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A', mb: 0.5 }}>
                        Email
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#29293A', padding: '12px', backgroundColor: '#F8F9FD', borderRadius: '12px', border: '1px solid #C0C8DB' }}>
                        {user.email}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A', mb: 0.5 }}>
                        Role
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#29293A', padding: '12px', backgroundColor: '#F8F9FD', borderRadius: '12px', border: '1px solid #C0C8DB' }}>
                        {user.role}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A', mb: 0.5 }}>
                        Major
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#29293A', padding: '12px', backgroundColor: '#F8F9FD', borderRadius: '12px', border: '1px solid #C0C8DB' }}>
                        {user.major || 'Not specified'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default ProfileView
