import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useConversation } from '../../contexts/ConversationContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownward } from '@mui/icons-material'
import MessageFormInput from './MessageFormInput'
import ControlButton from './ControlButton'
import MicIcon from '../Icons/MicIcon'
import { useMeetingContext } from '../../contexts/MeetingContext'
import { useSession } from '../../contexts/SessionContextV2'

// Full-width chat, same message list/input as ChatPanel but sized to fill
// the whole content area instead of a 25%-wide side panel.
function FullChatPanel() {
    const { messages } = useConversation()
    const { sendMessage } = useSession()
    const { micEnabled, toggleMic } = useMeetingContext()

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
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
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
                    px: 3,
                    maxWidth: 720,
                    width: '100%',
                    mx: 'auto',
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
                        position: 'absolute',
                        bottom: 70,
                        right: 20,
                        zIndex: 1000,
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        color: 'primary.main'
                    }}
                >
                    <ArrowDownward />
                </IconButton>
            )}

            <Box
                sx={{
                    backgroundColor: 'white',
                    borderTop: '0.5px solid #C0C8DB',
                    minHeight: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    paddingX: 2
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 720, width: '100%' }}>
                    <MessageFormInput handleSubmit={sendMessage} />

                    <Tooltip title={'Mic'} placement='top'>
                        <Box sx={{ flexShrink: 0 }}>
                            <ControlButton
                                onClick={toggleMic}
                                icon={MicIcon}
                                accentColor={'#3D64FD'}
                                baseColor={'#DCE6FF'}
                                selected={micEnabled}
                            />
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}

export default FullChatPanel
