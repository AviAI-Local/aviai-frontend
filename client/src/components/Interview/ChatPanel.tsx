import { Box, IconButton, Stack, Typography } from '@mui/material'
import PanelLayout from '../layout/PanelLayout'
import { useConversation } from '../../contexts/ConversationContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownward } from '@mui/icons-material'
import MessageFormInput from './MessageFormInput'
import { useUserContext } from '../../contexts/UserContext'
import { useSession } from '../../contexts/SessionContextV2'

function ChatPanel() {
    const { messages, setMessages } = useConversation()
    const { user } = useUserContext()
    const { sendMessage } = useSession()

    const messagesEnd = useRef<HTMLDivElement>(null)
    const messageContainer = useRef<HTMLDivElement>(null)
    const isAutoScrolling = useRef(false)

    const [showScrollToBottom, setShowScrollToBottom] = useState(false)

    const scrollToBottom = useCallback(() => {
        isAutoScrolling.current = true
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })

        setTimeout(() => {
            isAutoScrolling.current = false
        }, 300)
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const handleScroll = useCallback(() => {
        if (isAutoScrolling.current) return
        const container = messageContainer.current
        if (!container) return

        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50

        setShowScrollToBottom(!isAtBottom)
    }, [])


    // const sendMessage = useCallback(
    //     async (values: { message: string }, { resetForm }: { resetForm: () => void }) => {
    //         const trimmedMessage = values.message.trim()
    //         if (!trimmedMessage) return

    //         try {
    //             // Add message to local state (chat is local only now, no LiveKit)
    //             const newMessage = {
    //                 id: crypto.randomUUID(),
    //                 name: user?.username || 'You',
    //                 message: trimmedMessage,
    //                 timestamp: Date.now(),
    //                 isSelf: true
    //             }

    //             setMessages((prev) => [...prev, newMessage])
    //             resetForm()
    //         } catch (error) {
    //             console.error('Error sending message:', error)
    //         }
    //     },
    //     [user?.username, setMessages]
    // )

    const renderedMessages = useMemo(
        () =>
            messages.map((message) => (
                <Stack
                    key={message.id}
                    direction='row'
                    alignItems='flex-start'
                    justifyContent={message.isSelf ? 'flex-end' : 'flex-start'}
                    sx={{ mb: 2, paddingX: 1 }}
                >
                    <Box
                        sx={{
                            bgcolor: message.isSelf ? '#3D64FD' : '#DCE6FF',
                            color: message.isSelf ? 'white' : 'black',
                            px: 2,
                            py: 1.5,
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            borderBottomLeftRadius: message.isSelf ? 25 : 0,
                            borderBottomRightRadius: message.isSelf ? 0 : 25,
                            maxWidth: '75%'
                        }}
                    >
                        <Typography variant='body2' sx={{ wordBreak: 'break-word' }}>
                            {message.message}
                        </Typography>
                    </Box>
                </Stack>
            )),
        [messages]
    )

    return (
        <PanelLayout title={'Chats'}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100% - 45px)'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        backgroundColor: '#F8F9FD',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        ref={messageContainer}
                        sx={{
                            zIndex: 1,
                            flexGrow: 1,
                            overflowY: 'auto',
                            my: 1,
                            px: 2,
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }}
                        onScroll={handleScroll}
                    >
                        {renderedMessages}
                        <div ref={messagesEnd} />
                    </Box>

                    {showScrollToBottom && (
                        <IconButton
                            onClick={scrollToBottom}
                            sx={{
                                position: 'fixed',
                                bottom: 60,
                                right: 10,
                                zIndex: 1000,
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                backgroundColor: 'white',
                                color: 'primary.main'
                            }}
                        >
                            <ArrowDownward />
                        </IconButton>
                    )}
                </Box>

                <Box
                    sx={{
                        backgroundColor: 'white',
                        minHeight: 50,
                        display: 'flex',
                        alignItems: 'center',
                        paddingX: 2
                    }}
                >
                    <MessageFormInput handleSubmit={sendMessage} />
                </Box>
            </Box>
        </PanelLayout>
    )
}

export default ChatPanel
