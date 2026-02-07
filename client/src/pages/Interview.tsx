import { Box, Fade, Typography } from '@mui/material'
import ControlBar from '../components/Interview/ControlBar'
import IntervieweeView from '../components/Interview/IntervieweeView'
import { MeetingProvider, useMeetingContext } from '../contexts/MeetingContext'
import InterviewHeader from '../components/Interview/InterviewHeader'
import EndButton from '../components/Interview/EndButton'
import ChatPanel from '../components/Interview/ChatPanel'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from '../contexts/SessionContext'
import {
    LiveKitRoom,
    RoomAudioRenderer,
    useConnectionState,
    useRoomContext,
    useTracks
} from '@livekit/components-react'
import { ConnectionProvider, useConnection } from '../contexts/ConnectionContext'
import { ConnectionState, Participant, RemoteParticipant, RoomEvent, type TranscriptionSegment } from 'livekit-client'
import { useConfig } from '../contexts/ConfigContext'
import InterviewerView from '../components/Interview/InterviewerView'
import { ConversationProvider, useConversation } from '../contexts/ConversationContext'
import TranscriptPanel from '../components/Interview/TranscriptPanel'
import { useNavigate } from 'react-router-dom'
import FullPageLoader from '../components/common/FullPageLoader'
import { useLoading } from '../contexts/LoadingContext'
import { useUserContext } from '../contexts/UserContext'
import NotePanel, { type NoteFormValues } from '../components/Interview/NotePanel'
import { createNote } from '../api/note'
import { convertNoteToLexical } from '../utils/note'
import { formatDate, formatTime, formatTimeToHHMM } from '../utils/format'

function Interview() {
    const { config } = useConfig()
    const { user } = useUserContext()
    return (
        <ConnectionProvider userId={user?.id ?? ''}>
            <ConversationProvider>
                <LiveKitRoom token={config.settings.token} serverUrl={config.settings.wsURL}>
                    <MeetingProvider>
                        <Inner />
                    </MeetingProvider>
                </LiveKitRoom>
            </ConversationProvider>
        </ConnectionProvider>
    )
}

function Inner() {
    const navigate = useNavigate()
    const roomState = useConnectionState()
    const [existing, setExisting] = useState(false)
    const { setLoading } = useLoading()
    const { user } = useUserContext()
    if (!user) return

    const { config } = useConfig()
    const { session, usecase, setSession, setUsecase } = useSession()
    const { connect, disconnect } = useConnection()
    const { facialExpression, setIsSpeaking, setFacialExpression, setTranscripts, setMessages, transcripts } =
        useConversation()
    const { loading } = useLoading()

    const { showChat, cameraEnabled, showTranscript, showNote, option, setOption, stopVideoRecording } = useMeetingContext()
    const tracks = useTracks()
    const room = useRoomContext()
    const lastMessage = transcripts[transcripts.length - 1]?.message || ''

    const remoteSpeaker = useMemo(() => tracks.find((t) => t.participant instanceof RemoteParticipant), [tracks])

    const [noteValues, setNoteValues] = useState<NoteFormValues>({
        aircraft: '',
        date: '',
        weather: '',
        details: ''
    })

    useEffect(() => {
        if (session?.id && session.usecaseId && roomState === ConnectionState.Disconnected) {
            console.log('session: ', session)
            connect(session.usecaseId, session.id)
            console.debug('Room State:', roomState)
            console.debug('Config:', config)
        }
    }, [session, roomState])

    useEffect(() => {
        if (remoteSpeaker?.participant) {
            setIsSpeaking(remoteSpeaker.participant.isSpeaking)
        }
    }, [remoteSpeaker, setIsSpeaking, facialExpression])

    const speakingTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (roomState !== ConnectionState.Connected || !room) return

        room.registerTextStreamHandler('avatar_instructions', async (reader) => {
            const text = await reader.readAll()

            if (text) {
                setFacialExpression(text)
                setIsSpeaking(true)

                if (speakingTimeout.current) {
                    clearTimeout(speakingTimeout.current)
                }

                speakingTimeout.current = setTimeout(() => {
                    setIsSpeaking(false)
                }, 300)
            }
        })

        return () => {
            if (speakingTimeout.current) {
                clearTimeout(speakingTimeout.current)
            }
        }
    }, [room, roomState, setFacialExpression, setIsSpeaking])

    const handleTranscription = useCallback(
        (segments: TranscriptionSegment[], participant?: Participant) => {
            segments.forEach((segment) => {
                const transcript = {
                    id: segment.id,
                    name: participant?.identity ?? 'Agent',
                    message: segment.text,
                    timestamp: segment.firstReceivedTime ?? Date.now(),
                    isSelf: participant?.isLocal ?? false
                }

                setTranscripts((prev) => [...prev, transcript])

                if (segment.final) {
                    setMessages((prev) => [...prev, transcript])
                }
            })
        },
        [setMessages, setTranscripts]
    )

    useEffect(() => {
        if (!room) return

        room.on(RoomEvent.TranscriptionReceived, handleTranscription)
        return () => {
            room.off(RoomEvent.TranscriptionReceived, handleTranscription)
        }
    }, [room, handleTranscription])

    useEffect(() => {
        console.log('state: ', roomState)
        console.log('session: ', session)
        if (!session && roomState == ConnectionState.Disconnected) {
            setTimeout(() => {
                navigate('/scenarios')
                setUsecase(null)
                setSession(null)
            }, 500)
        }
    }, [session, roomState])

    const leaveRoom = async () => {
        setLoading(true)

        const hasValues = Object.values(noteValues).some((value) => value.trim() !== '')
        
        if (option == "video") {
            stopVideoRecording()
            setOption(null)
        }
        
        if (hasValues) {
            const lexicalJSON = convertNoteToLexical(noteValues)
            try {
                await createNote(
                    `Interview Note ${formatDate(new Date().toISOString())} ${formatTimeToHHMM(new Date().toISOString())}`,
                    lexicalJSON,
                    user.id,
                    session?.id
                )

            } catch (error) {
                console.error('Failed to save note:', error)
            }
        }

        disconnect()
        setExisting(true)

        setTimeout(() => {
            navigate(-1)
            setUsecase(null)
            setSession(null)
            setLoading(false)
        }, 500)
    }

    if (!config.settings.token || loading) {
        return <FullPageLoader loading={!config.settings.roomName || loading} />
    }

    return (
        <Fade in={!existing} timeout={500}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh'
                }}
            >
                {/* This is for sound, do not remove */}
                <RoomAudioRenderer />
                {usecase && <InterviewHeader data={usecase} />}

                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        height: 'calc(100vh - 85px)'
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#DCE6FF',
                                paddingY: 3,
                                flexGrow: 1,
                                position: 'relative'
                            }}
                        >
                            <IntervieweeView />

                            {cameraEnabled && <InterviewerView />}

                            {lastMessage && !showTranscript && (
                                <Typography
                                    variant='h6'
                                    sx={{
                                        position: 'absolute',
                                        bottom: 40,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        zIndex: 2,
                                        maxWidth: '80%',
                                        textAlign: 'center'
                                    }}
                                >
                                    {lastMessage}
                                </Typography>
                            )}
                        </Box>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 80,
                                position: 'relative'
                            }}
                        >
                            <ControlBar />

                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 20
                                }}
                            >
                                <EndButton onClick={leaveRoom} />
                            </Box>
                        </Box>
                    </Box>

                    {showChat && <ChatPanel />}
                    {showTranscript && <TranscriptPanel />}
                    {showNote && <NotePanel noteValues={noteValues} setNoteValues={setNoteValues} />}
                </Box>
            </Box>
        </Fade>
    )
}

export default Interview
