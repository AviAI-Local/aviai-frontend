import type { ConversationContent, ConversationHistory, Session } from '../types/session'
import type { UseCaseData } from '../types/usecase'
import type { Note } from '../types/common'

export function mapUseCase(item: any): UseCaseData {
    return {
        id: item.usecase_id,
        name: item.usecase_name,
        personalCharacteristic: item.personal_characteristics,
        scenario: item.scenario_text,
        summary: item.usecase_summary,
        attitude: item.attitude_in_interview,
        characterName: item.character_name,
        createdAt: item.created_at,
        gender: item.character_gender,
        industry: item.industry,
        interviewRule: item.rule_interview,
        createdBy: item.created_by
    }
}

export const mapSessions = (raw: any[]): Session[] => {
    return raw.map(
        (item): Session => ({
            id: item.session_id,
            usecaseId: item.usecase_id,
            createdAt: item.created_at,
            recording: item.recording,
            conversionHistory: (item.conversation_history || []).map(
                (history: any): ConversationHistory => ({
                    id: history.conversation_history_id,
                    sessionId: history.session_id,
                    timestamp: history.timestamp,
                    content: (history.content || []).map(
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
                })
            )
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
