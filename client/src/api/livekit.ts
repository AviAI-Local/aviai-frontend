import { serverAPI } from './axios'

export async function getLiveKitToken({
    participantId,
    usecaseId,
    sessionId
}: {
    participantId: string
    usecaseId: string
    sessionId: string
}) {
    const response = await serverAPI.get('/token/generateToken', {
        params: {
            participant_id: participantId,
            usecase_id: usecaseId,
            session_id: sessionId
        },
        headers: {
            ContentType: 'application/json'
        }
    })
    console.log('LiveKit token response:', response.data)

    if (!response.data) {
        throw new Error('Failed to fetch LiveKit token')
    }
    return response.data
}
