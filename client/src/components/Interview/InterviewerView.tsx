import { Box, Chip } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useUserContext } from '../../contexts/UserContext'
import { useMeetingContext } from '../../contexts/MeetingContext'

function InterviewerView() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const { user } = useUserContext()
    const { cameraEnabled } = useMeetingContext()

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                streamRef.current = stream

                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (error) {
                console.error('Error accessing camera:', error)
            }
        }

        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
                streamRef.current = null
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }

        if (cameraEnabled) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => {
            stopCamera()
        }
    }, [cameraEnabled])

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 40,
                right: 50,
                width: { xs: 200, md: 280 },
                height: { xs: 100, md: 160 },
                borderRadius: 2,
                overflow: 'hidden',
                zIndex: 1
            }}
        >
            <Box sx={{
                position: 'relative'
            }}>
                <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 100
                }}
            ></video>
            <Chip
                label={user?.username}
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 10,
                    backgroundColor: '#FFFFFF80',
                    width: 100,
                    zIndex: 1
                }}
            />
            </Box>
        </Box>
    )
}
export default InterviewerView
