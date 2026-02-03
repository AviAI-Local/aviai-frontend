import { Box, Chip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Track, TrackPublication } from 'livekit-client'
import { useRoomContext } from '@livekit/components-react'
import { useUserContext } from '../../contexts/UserContext'

function InterviewerView() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const room = useRoomContext()
    const localParticipant = room?.localParticipant
    const [track, setTrack] = useState<TrackPublication | null>(null)
    const { user } = useUserContext()

    useEffect(() => {
        if (!localParticipant) return

        const attachVideo = () => {
            const pub = localParticipant.getTrackPublication(Track.Source.Camera)
            const track = pub?.track

            console.log('[attachVideo] camera track:', track)

            if (track && videoRef.current) {
                track.attach(videoRef.current)
                setTrack(pub)
            } else {
                setTimeout(attachVideo, 100)
            }
        }

        const onTrackPublished = (pub: TrackPublication) => {
            if (pub.source === Track.Source.Camera) {
                console.log('[event] trackPublished (camera):', pub.track)
                attachVideo()
            }
        }

        const onTrackMuted = () => {
            console.log('[event] trackMuted')
            attachVideo()
        }

        const onTrackUnmuted = () => {
            console.log('[event] trackUnmuted')
            attachVideo()
        }

        const onTrackUnpublished = () => {
            console.log('[event] trackUnpublished')
            attachVideo()
        }

        localParticipant.on('trackPublished', onTrackPublished)
        localParticipant.on('trackMuted', onTrackMuted)
        localParticipant.on('trackUnmuted', onTrackUnmuted)
        localParticipant.on('trackUnpublished', onTrackUnpublished)

        attachVideo()

        return () => {
            const track = localParticipant.getTrackPublication(Track.Source.Camera)?.track
            if (track && videoRef.current) {
                track.detach(videoRef.current)
                setTrack(null)
            }
            localParticipant.off('trackPublished', onTrackPublished)
            localParticipant.off('trackMuted', onTrackMuted)
            localParticipant.off('trackUnmuted', onTrackUnmuted)
            localParticipant.off('trackUnpublished', onTrackUnpublished)
        }
    }, [localParticipant])

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
