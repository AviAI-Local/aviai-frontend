export type Config = {
    settings: {
        wsURL: string
        token: string
        roomName: string
        participantName: string
        inputs: {
            camera: boolean
            mic: boolean
        }
        outputs: {
            audio: boolean
            video: boolean
        }
    }
}
