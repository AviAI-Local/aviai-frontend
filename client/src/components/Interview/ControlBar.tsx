import { Box, Tooltip } from '@mui/material'
import VideoIcon from '../Icons/VideoIcon'
import ControlButton from './ControlButton'
import MicIcon from '../Icons/MicIcon'
import NoteIcon1 from '../Icons/NoteIcon1'
import ChatIcon from '../Icons/ChatIcon'
import TranscriptIcon from '../Icons/TranscriptIcon'
import { useMeetingContext } from '../../contexts/MeetingContext'
import RecordOption from './RecordOption'
import { useSession } from '../../contexts/SessionContextV2'
import RecordIcon from '../Icons/RecordIcon'
import { useState } from 'react'

export interface ControlBarProps {}

function ControlBar({}: ControlBarProps) {
    const {
        showChat,
        toggleChat,
        micEnabled,
        toggleMic,
        cameraEnabled,
        toggleCamera,
        showTranscript,
        toggleTranscript,
        showNote,
        toggleNote
    } = useMeetingContext()

    const { startScreenRecording, stopScreenRecording, isRecording } = useSession()
    const [hasRecorded, setHasRecorded] = useState(false)

    const handleToggle = async (label: string) => {
        switch (label) {
            case 'Camera':
                toggleCamera()
                break
            case 'Chat':
                toggleChat()
                break
            case 'Mic':
                toggleMic()
                break
            case 'Note':
                toggleNote()
                break
            case 'Transcript':
                toggleTranscript()
                break
        }
    }

    const handleRecordClick = async () => {
        if (isRecording) {
            setHasRecorded(true)
            await stopScreenRecording()
        } else {
            await startScreenRecording()
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5
            }}
        >
            <Tooltip title={'Camera'} placement='top'>
                <ControlButton
                    onClick={() => handleToggle('Camera')}
                    icon={VideoIcon}
                    accentColor={'#3D64FD'}
                    baseColor={'#DCE6FF'}
                    selected={cameraEnabled}
                />
            </Tooltip>

            <Tooltip title={'Mic'} placement='top'>
                <ControlButton
                    onClick={() => handleToggle('Mic')}
                    icon={MicIcon}
                    accentColor={'#3D64FD'}
                    baseColor={'#DCE6FF'}
                    selected={micEnabled}
                />
            </Tooltip>

            <Tooltip title={'Note'} placement='top'>
                <ControlButton
                    onClick={() => handleToggle('Note')}
                    icon={NoteIcon1}
                    accentColor={'#3D64FD'}
                    baseColor={'#DCE6FF'}
                    selected={showNote}
                />
            </Tooltip>


            <Tooltip title={'Record'} placement='top'>
                <ControlButton
                    disabled={hasRecorded}
                    onClick={handleRecordClick}
                    icon={RecordIcon}
                    accentColor={'#F25D5A'}
                    baseColor={'#FFD0D8'}
                    selected={isRecording}
                />
            </Tooltip>

            <Tooltip title={'Chat'} placement='top'>
                <ControlButton
                    onClick={() => handleToggle('Chat')}
                    icon={ChatIcon}
                    accentColor={'#3D64FD'}
                    baseColor={'#DCE6FF'}
                    selected={showChat}
                />
            </Tooltip>

            <Tooltip title={'Transcript'} placement='top'>
                <ControlButton
                    onClick={() => handleToggle('Transcript')}
                    icon={TranscriptIcon}
                    accentColor={'#3D64FD'}
                    baseColor={'#DCE6FF'}
                    selected={showTranscript}
                />
            </Tooltip>
        </Box>
    )
}

export default ControlBar
