import { createContext, useContext, useEffect, useState, type SetStateAction, type Dispatch } from 'react'
import { type Transcript } from '../types/meeting'

type ConversationContextType = {
    facialExpression: string
    setFacialExpression: (value: string) => void
    isSpeaking: boolean
    setIsSpeaking: (value: boolean) => void
    transcripts: Transcript[]
    setTranscripts: Dispatch<SetStateAction<Transcript[]>>
    addUserMessage(message: string): void
    messages: Transcript[]
    setMessages: Dispatch<SetStateAction<Transcript[]>>
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const [facialExpression, setFacialExpression] = useState('happy')
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcripts, setTranscripts] = useState<Transcript[]>([])
    const [messages, setMessages] = useState<Transcript[]>([])

    const addUserMessage = (message: string) => {
        setTranscripts((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: 'You',
                message,
                timestamp: Date.now(),
                isSelf: true
            }
        ])
    }

    useEffect(() => {
        console.log('facial expression: ', facialExpression)
    }, [facialExpression])

    return (
        <ConversationContext.Provider
            value={{
                facialExpression,
                setFacialExpression,
                isSpeaking,
                setIsSpeaking,
                transcripts,
                setTranscripts,
                addUserMessage,
                messages,
                setMessages
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}

export const useConversation = () => {
    const context = useContext(ConversationContext)
    if (!context) {
        throw new Error('useConversation must be used within a ConversationProvider')
    }
    return context
}
