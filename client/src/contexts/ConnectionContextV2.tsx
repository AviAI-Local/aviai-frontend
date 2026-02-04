import { createContext, useCallback, useContext, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useConfig } from './ConfigContext'
import { getLiveKitToken } from '../api/livekit'
import { Room } from 'livekit-client'

type TokenGeneratorData = {
    shouldConnect: boolean
    wsUrl: string
    token: string
    isConnecting: boolean
    setIsConnecting: Dispatch<SetStateAction<boolean>>
    disconnect: () => Promise<void>
    connect: (usecaseId: string, sessionId: string) => Promise<Room>
}

type ConnectionProviderProps = {
    userId: string;
    children: React.ReactNode;
};

const ConnectionContextV2 = createContext<TokenGeneratorData | undefined>(undefined)

const ConnectionProviderV2 = ({ userId, children }: ConnectionProviderProps) => {
    const { setConfig } = useConfig()
    // const room = new Room()
    const [isConnecting, setIsConnecting] = useState(false)
    const conversationWsRef = useRef(null);
    const audioCtxRef = useRef(null);
    const micCtxRef = useRef(null);
    const processorRef = useRef(null);
    const speakingRef = useRef(false);
    const [connected, setConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [latestResponse, setLatestResponse] = useState("");
    const [status, setStatus] = useState("connecting");


    // const connect = useCallback(async (usecaseId: string, sessionId: string) => {
    //     const wsURL = import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_URL
    //     console.log('Connection LiveKit URL:', wsURL)

    //     if (!wsURL) {
    //         throw new Error('Livekit URL is not configured')
    //     }

    //     // Get from user and session context
    //     const participantId = userId
    //     console.log("participantId: ", participantId)
    //     const { accessToken, roomName } = await getLiveKitToken({ participantId, usecaseId, sessionId })
    //     console.log('Connection LiveKit response:', { accessToken, roomName })

    //     await room.connect(wsURL, accessToken, roomName)
    //     room.localParticipant.setName(sessionId)
    //     room.localParticipant.setMetadata(usecaseId)

    //     console.log("room: ", room.name)

    //     // return room
    //     setConnectionDetails({ wsUrl: wsURL, token: accessToken, shouldConnect: true })
    //     setConfig((prev) => ({
    //         ...prev,
    //         settings: {
    //             ...prev.settings,
    //             token: accessToken,
    //             wsURL: wsURL,
    //             roomName: roomName
    //         }
    //     }))
    //     return room
    // }, [])

    const disconnect = useCallback(async () => {
        room.disconnect()

        setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }))
        setConfig((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                token: '',
                roomName: '',
            }
        }))
    }, [])

    return (
        <ConnectionContextV2.Provider
            value={{
                wsUrl: connectionDetails.wsUrl,
                token: connectionDetails.token,
                shouldConnect: connectionDetails.shouldConnect,
                isConnecting,
                setIsConnecting,
                connect,
                disconnect
            }}
        >
            {children}
        </ConnectionContextV2.Provider>
    )
}

const useConnection = () => {
    const context = useContext(ConnectionContextV2)
    if (context === undefined) {
        throw new Error('useConnection must be used within a ConnectionProvider')
    }
    return context
}

export { ConnectionProviderV2, useConnection }
