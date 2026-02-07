import { Box, Fade, Typography } from '@mui/material'
import ControlBar from '../components/Interview/ControlBar'
import IntervieweeView from '../components/Interview/IntervieweeView'
import { MeetingProvider, useMeetingContext } from '../contexts/MeetingContext'
import InterviewHeader from '../components/Interview/InterviewHeader'
import EndButton from '../components/Interview/EndButton'
import ChatPanel from '../components/Interview/ChatPanel'
import { useEffect, useState } from 'react'
import { useSession as useSessionV1 } from '../contexts/SessionContext'
import { useSession, SessionProviderV2 } from '../contexts/SessionContextV2'
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
import { formatDate, formatTimeToHHMM } from '../utils/format'

function Interview() {
    return (
        <SessionProviderV2>
            <ConversationProvider>
                <MeetingProvider>
                    <Inner />
                </MeetingProvider>
            </ConversationProvider>
        </SessionProviderV2>
    )
}

function Inner() {
    const navigate = useNavigate()
    const [existing, setExisting] = useState(false)
    const { setLoading } = useLoading()
    const { user } = useUserContext()
    if (!user) return

    // Session context from V1 (for usecase data)
    const { session, usecase, setSession, setUsecase } = useSessionV1()

    // WebSocket session from V2
    const {
        status,
        connected,
        isSpeaking,
        isPlayingAudio,
        latestResponse,
        avatarInstructions,
        userQuery,
        connectConversation,
        toggleSpeaking,
        disconnect,
        resetSession
    } = useSession()

    const { setTranscripts, setMessages, transcripts, setFacialExpression, setIsSpeaking, addUserMessage } = useConversation()
    const { loading } = useLoading()

    const { showChat, cameraEnabled, showTranscript, showNote, option, setOption, stopVideoRecording, toggleMic } = useMeetingContext()
    // Toggle mic with Space or Enter key (skip when typing in inputs)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                const tag = (e.target as HTMLElement)?.tagName
                if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
                e.preventDefault()
                toggleMic()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleMic])

    const lastMessage = transcripts[transcripts.length - 1]?.message || ''

    const [noteValues, setNoteValues] = useState<NoteFormValues>({
        aircraft: '',
        date: '',
        weather: '',
        details: ''
    })

    // Connect to WebSocket on mount
    useEffect(() => {
        if (!session?.id) return

        connectConversation(session.id).catch((err) => {
            console.error('Failed to connect:', err)
        })

        return () => {
            disconnect()
        }
    }, [session?.id])

    // Update avatar speaking state when audio is playing
    useEffect(() => {
        setIsSpeaking(isPlayingAudio)
    }, [isPlayingAudio, setIsSpeaking])

    // Update avatar facial expression based on backend instructions
    useEffect(() => {
        setFacialExpression(avatarInstructions)
    }, [avatarInstructions, setFacialExpression])

    // Handle latestResponse from WebSocket
    useEffect(() => {
        if (!latestResponse) return

        const transcript = {
            id: Date.now().toString(),
            name: 'Agent',
            message: latestResponse,
            timestamp: Date.now(),
            isSelf: false
        }

        setTranscripts((prev) => [...prev, transcript])
        setMessages((prev) => [...prev, transcript])
    }, [latestResponse, setTranscripts, setMessages])

    useEffect(() => {
        console.log("User Query: ", userQuery)
        if (!userQuery) return 
        // addUserMessage(userQuery)
        const transcript = {
            id: Date.now().toString(),
            name: 'You',
            message: userQuery,
            timestamp: Date.now(),
            isSelf: true
        }

        setTranscripts((prev) => [...prev, transcript])
        setMessages((prev) => [...prev, transcript])
    }, [userQuery, setTranscripts, setMessages])

    // Navigate away when disconnected
    useEffect(() => {
        console.log('status: ', status)
        console.log('session: ', session)
        if (!session && status === 'disconnected') {
            setTimeout(() => {
                navigate('/scenarios')
                setUsecase(null)
                setSession(null)
            }, 500)
        }
    }, [session, status])

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

        resetSession()
        setExisting(true)

        setTimeout(() => {
            navigate(-1)
            setUsecase(null)
            setSession(null)
            setLoading(false)
        }, 500)
    }

    if (status === 'connecting' || loading) {
        return <FullPageLoader loading={status === 'connecting' || loading} />
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
