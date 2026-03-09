import type { ConversationContent, ConversationHistory, Session } from '../types/session'
import type { UseCaseData } from '../types/usecase'
import type { Note } from '../types/common'

export function mapUseCase(item: any): UseCaseData {
    return {
        id: item.scenario_id,
        name: item.scenario_name,
        personalCharacteristic: item.personal_characteristics,
        scenario: item.scenario_text,
        attitude: item.attitude_in_interview,
        createdAt: item.created_at,
        category: item.category,
        interviewRule: item.rule_interview,
        createdBy: item.created_by
    }
}

export const mapSessions = (raw: any[]): Session[] => {
    return raw.map(
        (item): Session => ({
            id: item.session_id,
            scenarioId: item.scenario_id,
            scenarioName: item.scenario_name,
            createdAt: item.created_at,
            recording: item.recording,
            conversationHistory: item.conversation_history 
                ? {
                    id: item.conversation_history.conversation_history_id,
                    sessionId: item.conversation_history.session_id,
                    timestamp: item.conversation_history.timestamp,
                    content: (item.conversation_history.content || []).map(
                        (c: any): ConversationContent => ({
                            timestamp: c.timestamp,
                            datetime: c.datetime,
                            userQuery: c.user_query,
                            response: c.response,
                            userEmotion: c.user_emotion,
                            voiceInstructions: c.voice_instructions,
                            avatarInstructions: c.avatar_instructions
                        })
                    )
                }
                : null
        })
    )
}


export function mapNote(note: any): Note {
    return {
        id: note.note_id,
        title: note.title,
        sessionId: note.session_id,
        content: note.note_content,
        timestamp: note.timestamp
    }
}
