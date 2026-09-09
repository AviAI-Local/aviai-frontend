import { Box, Fade } from '@mui/material'
import FullChatPanel from '../components/Interview/FullChatPanel'
import { MeetingProvider, useMeetingContext } from '../contexts/MeetingContext'
import InterviewHeader from '../components/Interview/InterviewHeader'
import EndButton from '../components/Interview/EndButton'
import { useEffect, useState } from 'react'
import { useSession as useSessionV1 } from '../contexts/SessionContext'
import { useSession, SessionProviderV2 } from '../contexts/SessionContextV2'
import { ConversationProvider, useConversation } from '../contexts/ConversationContext'
import { useNavigate } from 'react-router-dom'
import FullPageLoader from '../components/common/FullPageLoader'
import { useLoading } from '../contexts/LoadingContext'
import { useUserContext } from '../contexts/UserContext'
import { createNote } from '../api/note'
import { formatDate, formatTimeToHHMM } from '../utils/format'
import { convertPlainTextToLexical } from '../utils/note'

// Chat-only interview UI: full-width chat plus mic + end-call controls.
// No avatar/video area. See InterviewV2.tsx for the full-featured page.
function InterviewChatOnly() {
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

    const { session, usecase, setSession, setUsecase } = useSessionV1()

    const { status, isPlayingAudio, latestResponse, avatarInstructions, userQuery, connectConversation, disconnect, resetSession } =
        useSession()

    const { setTranscripts, setMessages, setFacialExpression, setIsSpeaking } = useConversation()
    const { loading } = useLoading()

    const { option, setOption, stopVideoRecording, toggleMic } = useMeetingContext()

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

    const [noteText, setNoteText] = useState('')

    useEffect(() => {
        if (!session?.id) return

        connectConversation(session.id).catch((err) => {
            console.error('Failed to connect:', err)
        })

        return () => {
            disconnect()
        }
    }, [session?.id])

    useEffect(() => {
        setIsSpeaking(isPlayingAudio)
    }, [isPlayingAudio, setIsSpeaking])

    useEffect(() => {
        setFacialExpression(avatarInstructions)
    }, [avatarInstructions, setFacialExpression])

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
        if (!userQuery) return

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

    useEffect(() => {
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

        if (option == 'video') {
            stopVideoRecording()
            setOption(null)
        }

        if (noteText.trim() !== '') {
            try {
                await createNote(
                    `Interview Note ${formatDate(new Date().toISOString())} ${formatTimeToHHMM(new Date().toISOString())}`,
                    convertPlainTextToLexical(noteText),
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
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100vh - 85px)'
                    }}
                >
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <FullChatPanel />
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            height: 60,
                            paddingX: 2.5,
                            borderTop: '0.5px solid #C0C8DB'
                        }}
                    >
                        <EndButton onClick={leaveRoom} />
                    </Box>
                </Box>
            </Box>
        </Fade>
    )
}

export default InterviewChatOnly
