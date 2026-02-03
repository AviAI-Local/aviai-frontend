import { useState } from 'react'
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ActionButton from '../common/ActionButton'
import { useLoading } from '../../contexts/LoadingContext'

interface AvatarUploaderProps {
    open: boolean
    onClose: () => void
    onUpload: (file: File) => void
    currentAvatar?: string
}

function AvatarUploader({ open, onClose, onUpload, currentAvatar }: AvatarUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const { loading } = useLoading()

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: false,
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0]
            if (file) {
                setSelectedFile(file)
                // Create preview URL
                const reader = new FileReader()
                reader.onload = () => {
                    setPreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        }
    })

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile)
            onClose()
        }
    }

    const handleClose = () => {
        setSelectedFile(null)
        setPreview(null)
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 4,
                        width: 500,
                        overflow: 'hidden',
                        backgroundColor: 'primary.contrastText'
                    }
                }
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: 'white'
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 500,
                        fontSize: 28
                    }}
                >
                    Update Avatar
                </Typography>
                <HighlightOffOutlinedIcon
                    aria-label='close'
                    onClick={handleClose}
                    sx={{
                        color: 'primary.main',
                        cursor: 'pointer'
                    }}
                >
                    <CloseIcon />
                </HighlightOffOutlinedIcon>
            </DialogTitle>
            <DialogContent
                sx={{
                    padding: 3,
                    backgroundColor: 'white'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 1 }}>
                    {/* Current Avatar Preview */}
                    {currentAvatar && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#29293A' }}>
                                Current Avatar
                            </Typography>
                            <Box
                                component="img"
                                src={currentAvatar}
                                alt="Current avatar"
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #C0C8DB'
                                }}
                            />
                        </Box>
                    )}

                    {/* Upload Area */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            border: '1px dashed #9FA7BE',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'border-color 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 4,
                            paddingY: 5,
                            minHeight: 200,
                            '&:hover': {
                                borderColor: '#3D64FD'
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        
                        {preview ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box
                                    component="img"
                                    src={preview}
                                    alt="Preview"
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #3D64FD'
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: '#3D64FD', fontWeight: 'bold' }}>
                                    {selectedFile?.name}
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: '#9FA7BE' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 400, fontSize: 18, color: 'black', mb: 1 }}>
                                        Choose an image or drag & drop it here
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: 18, color: '#9FA7BE' }}>
                                        JPG, PNG, GIF, or WebP format, up to 5MB
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: 3,
                    gap: 2,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e0e0e0'
                }}
            >
                <ActionButton
                    variant="outlined"
                    actionType="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </ActionButton>
                <ActionButton
                    variant="contained"
                    actionType="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    loading={loading}
                >
                    Upload Avatar
                </ActionButton>
            </DialogActions>
        </Dialog>
    )
}

export default AvatarUploader
