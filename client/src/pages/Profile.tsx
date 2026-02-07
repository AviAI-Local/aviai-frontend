import { Box, Typography, Avatar, IconButton, Paper } from '@mui/material'
import { Edit } from '@mui/icons-material'
import PageLayout from '../components/layout/PageLayout'
import ProfileForm from '../components/Profile/ProfileForm'
import ProfileView from '../components/Profile/ProfileView'
import AvatarUploader from '../components/Profile/AvatarUploader'
import { useUserContext } from '../contexts/UserContext'
import { uploadAvatar } from '../api/auth'
import { useState } from 'react'

function Profile() {
    const { user, refetchUser } = useUserContext()
    const [isEditing, setIsEditing] = useState(false)
    const [avatarUploadOpen, setAvatarUploadOpen] = useState(false)

    if (!user) {
        return <div>Loading...</div>
    }

    // Split user name into first and last name
    const nameParts = user.username.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {
        // Refresh user data to get updated information
        await refetchUser()
        setIsEditing(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleAvatarUpload = async (file: File) => {
        if (!user) return

        try {
            await uploadAvatar(user.id, file)
            // Refresh user data to get updated avatar
            await refetchUser()
            setAvatarUploadOpen(false)
        } catch (error) {
            console.error('Failed to upload avatar:', error)
            // Still close the dialog even if there's an error
            setAvatarUploadOpen(false)
        }
    }

    return (
        <PageLayout headerProps={{ title: 'Profile' }}>
            <Box sx={{ padding: 3 }}>
                {/* Profile Banner Section */}
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: '#DCE6FF',
                        borderRadius: 2,
                        padding: 4,
                        marginBottom: 3,
                        position: 'relative',
                        minHeight: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Avatar */}
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={user.avatarUrl}
                            sx={{
                                width: 120,
                                height: 120,
                                backgroundColor: user.avatarUrl ? 'transparent' : '#FCADBD',
                                fontSize: '2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {!user.avatarUrl && user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </Avatar>
                        
                        {/* Edit Avatar Button
                        <IconButton
                            onClick={() => setAvatarUploadOpen(true)}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#3D64FD',
                                color: 'white',
                                width: 32,
                                height: 32,
                                '&:hover': {
                                    backgroundColor: '#2B4FD1'
                                }
                            }}
                        >
                            <Edit sx={{ fontSize: 16 }} />
                        </IconButton> */}
                    </Box>

                    {/* Edit Banner Button */}
                    <IconButton
                        onClick={handleEdit}
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            backgroundColor: '#3D64FD',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': {
                                backgroundColor: '#2B4FD1'
                            }
                        }}
                    >
                        <Edit sx={{ fontSize: 16 }} />
                    </IconButton>
                </Paper>

                {/* Account Information */}
                <Paper elevation={0} sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                        Account Information
                    </Typography>
                    
                    {isEditing ? (
                        <ProfileForm
                            initialData={{
                                firstName,
                                lastName,
                                email: user.email,
                                role: user.role,
                                major: user.major || ''
                            }}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <ProfileView
                            user={{
                                firstName,
                                lastName,
                                email: user.email,
                                role: user.role,
                                major: user.major || ''
                            }}
                        />
                    )}
                </Paper>

                {/* Avatar Upload Dialog */}
                {/* <AvatarUploader
                    open={avatarUploadOpen}
                    onClose={() => setAvatarUploadOpen(false)}
                    onUpload={handleAvatarUpload}
                    currentAvatar={user.avatarUrl}
                /> */}
            </Box>
        </PageLayout>
    )
}

export default Profile
