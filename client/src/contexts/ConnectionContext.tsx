import { createContext, useCallback, useContext, useState, type Dispatch, type SetStateAction } from 'react'
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

const ConnectionContext = createContext<TokenGeneratorData | undefined>(undefined)

const ConnectionProvider = ({ userId, children }: ConnectionProviderProps) => {
    const { setConfig } = useConfig()
    const room = new Room()
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectionDetails, setConnectionDetails] = useState<{
        wsUrl: string
        token: string
        shouldConnect: boolean
    }>({ wsUrl: '', token: '', shouldConnect: false })

    const connect = useCallback(async (usecaseId: string, sessionId: string) => {
        const wsURL = import.meta.env.VITE_NEXT_PUBLIC_LIVEKIT_URL
        console.log('Connection LiveKit URL:', wsURL)

        if (!wsURL) {
            throw new Error('Livekit URL is not configured')
        }

        // Get from user and session context
        const participantId = userId
        console.log("participantId: ", participantId)
        const { accessToken, roomName } = await getLiveKitToken({ participantId, usecaseId, sessionId })
        console.log('Connection LiveKit response:', { accessToken, roomName })
        
        await room.connect(wsURL, accessToken, roomName)
        room.localParticipant.setName(sessionId)
        room.localParticipant.setMetadata(usecaseId)

        console.log("room: ", room.name)

        // return room
        setConnectionDetails({ wsUrl: wsURL, token: accessToken, shouldConnect: true })
        setConfig((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                token: accessToken,
                wsURL: wsURL,
                roomName: roomName
            }
        }))
        return room
    }, [])

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
        <ConnectionContext.Provider
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
        </ConnectionContext.Provider>
    )
}

const useConnection = () => {
    const context = useContext(ConnectionContext)
    if (context === undefined) {
        throw new Error('useConnection must be used within a ConnectionProvider')
    }
    return context
}

export { ConnectionProvider, useConnection }
