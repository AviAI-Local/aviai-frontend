import { Box, Button, Dialog, DialogContent, Tooltip, Typography } from '@mui/material'
import ControlButton from './ControlButton'
import RecordIcon from '../Icons/RecordIcon'
import { useState } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { useMeetingContext } from '../../contexts/MeetingContext'
import { useSession } from '../../contexts/SessionContextV2'

function RecordOption() {
    const [open, setOpen] = useState(false)
    // const [option, setOption] = useState<String | null>(null)
    const { user } = useUserContext()
    const { startScreenRecording, stopScreenRecording, isRecording } = useSession()
    const { startAudioRecording, stopAudioRecording, startVideoRecording, stopVideoRecording, option, setOption } = useMeetingContext()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleStopRecording = () => {
        if (option === 'audio') {
            stopAudioRecording()
        } else {
            stopScreenRecording()
        }
    }

    return (
        <>
            <Tooltip title={'Record'} placement='top'>
                <ControlButton
                    disabled={isRecording}
                    onClick={option ? handleStopRecording : handleClickOpen}
                    icon={RecordIcon}
                    accentColor={'#F25D5A'}
                    baseColor={'#FFD0D8'}
                />
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 4,
                            width: 400,
                            height: 160,
                            overflow: 'hidden',
                            backgroundColor: 'primary.contrastText'
                        }
                    }
                }}
            >
                <DialogContent
                    sx={{
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 4,
                        overflowY: 'auto',
                        minHeight: '30vh',
                        position: 'relative'
                    }}
                >
                    <>
                        <HighlightOffOutlinedIcon
                            aria-label='close'
                            onClick={handleClose}
                            sx={{
                                color: 'primary.main',
                                cursor: 'pointer',
                                position: 'absolute',
                                right: 20,
                                top: 0,
                                pointer: 'cursor'
                            }}
                        >
                            <CloseIcon />
                        </HighlightOffOutlinedIcon>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 3
                            }}
                        >
                            <Typography>Please choose your prefer recording</Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2
                                }}
                            >
                                <OptionButton
                                    color={true}
                                    title={'Audio'}
                                    onClick={async () => {
                                        setOption('audio')
                                        startAudioRecording()
                                        setOpen(false)
                                    }}
                                />

                                <OptionButton
                                    color={false}
                                    title={'Video'}
                                    onClick={async () => {
                                        setOption('video')
                                        startScreenRecording()
                                        setOpen(false)
                                    }}
                                />
                            </Box>
                        </Box>
                    </>
                </DialogContent>
            </Dialog>
        </>
    )
}

type OptionButtonProps = {
    color: boolean
    title: string
    onClick: () => Promise<void>
}

function OptionButton({ color, title, onClick }: OptionButtonProps) {
    return (
        <Button
            onClick={onClick}
            sx={{
                backgroundColor: color ? '#3D64FD' : 'transparent',
                width: 90,
                height: 38,
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingX: 1,
                paddingY: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                border: color ? null : '1px solid #3D64FD',
                '&:hover': {
                    backgroundColor: color ? 'transparent' : '#3D64FD',
                    border: '1px solid #3D64FD'
                },
                '&:hover .hover-text': {
                    color: color ? '#3D64FD' : 'white'
                }
            }}
        >
            <Typography
                className='hover-text'
                sx={{
                    color: color ? 'white' : '#3D64FD',
                    fontWeight: 600,
                    fontSize: 14
                }}
            >
                {title}
            </Typography>
        </Button>
    )
}

export default RecordOption
