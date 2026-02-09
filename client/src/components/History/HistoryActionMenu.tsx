import { OpenInNew, SaveAlt } from '@mui/icons-material'
import { Menu, MenuItem } from '@mui/material'
import { useCallback } from 'react'
import { getConversationPDF, getEmotionAnalysis, getPerformanceAnalysis } from '../../api/session'
import { downloadBase64PDF } from '../../utils/interview'
import { useUserContext } from '../../contexts/UserContext'

export interface HistoryActionMenuProps {
    anchorEl: HTMLElement | null
    handleMenuClose: () => void
    conversationHistoryId: string
    recording: string | null
}

const actions = [
    {
        key: 'record',
        label: 'Open record',
        icon: <OpenInNew fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
    },
    {
        key: 'transcript',
        label: 'Transcript',
        icon: <SaveAlt fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
    },
    {
        key: 'emotion',
        label: 'Emotion analysis',
        icon: <SaveAlt fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
    }, 
    {
        key: 'performance',
        label: 'Performance analysis',
        icon: <SaveAlt fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
    }
]

function HistoryActionMenu({ anchorEl, handleMenuClose, conversationHistoryId, recording }: HistoryActionMenuProps) {
    const { user } = useUserContext()
    if (!user) return
    const handleDownloadTranscript = async (conversationHistoryId: string) => {
        try {
            const { pdf_base64, filename } = await getConversationPDF(conversationHistoryId)
            downloadBase64PDF(pdf_base64, filename)
        } catch (err) {
            console.error('Failed to download transcript:', err)
        }
    }

    const handleDownloadEmotionAnalysis = async (conversationHistoryId: string) => {
        try {
            const { pdf_base64, filename } = await getEmotionAnalysis(conversationHistoryId)
            downloadBase64PDF(pdf_base64, filename)
        } catch (err) {
            console.error('Failed to download emotion analysis:', err)
        }
    }

    const handleOpenRecording = () => {
        if (recording) {
            window.open(`http://localhost:8000/recordings/${recording}`, '_blank', 'noopener,noreferrer')
        }
    }

    const handleDownloadPerformanceAnalysis = async (conversationHistoryId: string) => {
        try {
            console.log(conversationHistoryId)
            const { pdf_base64, filename } = await getPerformanceAnalysis(conversationHistoryId, user.id)
            downloadBase64PDF(pdf_base64, filename)
        } catch (err) {
            console.error('Failed to download performance analysis:', err)
        }
    }

    const renderActions = useCallback(
        () =>
            actions
                .filter((action) => action.key !== 'record' || recording)
                .map((action) => {
                    const handleClick = async () => {
                        handleMenuClose()
                        if (action.key === 'transcript') {
                            await handleDownloadTranscript(conversationHistoryId)
                        }
                        if (action.key === 'emotion') {
                            await handleDownloadEmotionAnalysis(conversationHistoryId)
                        }
                        if (action.key === 'record') {
                            handleOpenRecording()
                        }
                        if (action.key === 'performance') {
                            await handleDownloadPerformanceAnalysis(conversationHistoryId)
                        }
                    }

                    return (
                        <MenuItem
                            key={action.key}
                            onClick={handleClick}
                            sx={{
                                fontSize: '12px',
                                fontWeight: '500',
                                color: 'text.secondary',
                                mx: 1,
                                transition: 'background-color 0.1s ease, transform 0.1s ease',

                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                    borderRadius: '5px',
                                    color: 'white',

                                    '& .MuiSvgIcon-root': {
                                        color: 'white'
                                    }
                                }
                            }}
                        >
                            {action.icon}
                            {action.label}
                        </MenuItem>
                    )
                }),
        [conversationHistoryId, handleMenuClose, recording]
    )

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ borderRadius: '100px' }}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        mt: 1
                    }
                }
            }}
        >
            {renderActions()}
        </Menu>
    )
}

export default HistoryActionMenu
