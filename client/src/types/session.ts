import type { Dispatch, SetStateAction } from 'react'
import type { UseCaseData } from './usecase'

export type Session = {
    id: string
    conversionHistory?: ConversationHistory[]
    usecaseId: string
    createdAt?: string
    recording?: string
}

export type SessionContextType = {
    session: Session | null
    setSession: Dispatch<SetStateAction<Session | null>>
    usecase: UseCaseData | null
    setUsecase: Dispatch<SetStateAction<UseCaseData | null>>
}

export interface ConversationContent {
    timestamp: number
    datetime: string
    userQuery: string
    response: string
    userEmotion: string
    voiceInstructions: string
    avatarInstructions: string
}

export interface ConversationHistory {
    id: string
    sessionId: string
    content: ConversationContent[]
    timestamp: string
}
