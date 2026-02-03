import { Box, Stack, Typography } from '@mui/material'
import PanelLayout from '../layout/PanelLayout'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useConversation } from '../../contexts/ConversationContext'

function TranscriptPanel() {
    const { messages } = useConversation()

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
                    // justifyContent={message.isSelf ? 'flex-end' : 'flex-start'}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                        // paddingX: 2,
                    }}
                >
                    {/* <Box> */}
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: '#29293A',
                            minWidth: 50
                        }}
                    >
                        {message.isSelf ? 'Me:' : 'AviBot:'}
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 400,
                            fontSize: 12,
                            color: '#29293A'
                        }}
                    >
                        {message.message}
                    </Typography>
                </Stack>
            )),
        [messages]
    )

    return (
        <PanelLayout title={'Transcripts'}>
            <Box
                sx={{
                    backgroundColor: '#F8F9FD',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100% - 45px)',
                    paddingX: 2
                }}
            >
                <Box
                    ref={messageContainer}
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        my: 1,
                        scrollbarWidth: 'none',
                        // backgroundColor: '#C0C8DB',
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}
                    onScroll={handleScroll}
                >
                    {renderedMessages}
                    <div ref={messagesEnd} />
                </Box>
            </Box>
        </PanelLayout>
    )
}

export default TranscriptPanel
