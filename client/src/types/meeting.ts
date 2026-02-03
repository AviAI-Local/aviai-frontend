import type { Dispatch, SetStateAction } from "react"

export interface UnsplashPhoto {
    id: string
    urls: {
        regular: string
    }
    alth_description: string
}


export type Transcript = {
    id: string
    name: string
    message: string
    timestamp: number
    isSelf: boolean
}

export type MeetingContextType = {
    showChat: boolean
    toggleChat: () => void
    showTranscript: boolean
    toggleTranscript: () => void
    micEnabled: boolean
    toggleMic: () => void
    cameraEnabled: boolean
    toggleCamera: () => void
    elapsedTime: number
    isRecord: boolean
    setIsRecord: Dispatch<SetStateAction<boolean>>
    recording: boolean
    startAudioRecording: () => Promise<void>
    startVideoRecording: () => Promise<void>
    stopAudioRecording: () => Promise<void>
    stopVideoRecording: () => void
    showNote: boolean
    toggleNote: () => void
    option: string | null
    setOption: Dispatch<SetStateAction<string | null>>
}
