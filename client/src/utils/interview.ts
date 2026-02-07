import type { Session } from '../types/session'
import { formatTime } from './format'

export function getSessionDuration(session: Session): string | null {
    const createdAt = session.createdAt
    const history = session.conversationHistory
    if (!createdAt || !history) return null
    const start = new Date(createdAt)
    const content = history.content
    if (!content || content.length === 0) return null
    const lastMessage = content[content.length - 1]
    const end = new Date(lastMessage.datetime)
    const durationInSeconds = Math.floor((end.getTime() - start.getTime()) / 1000)
    return formatTime(durationInSeconds)
}
export function downloadBase64PDF(base64: string, filename: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

