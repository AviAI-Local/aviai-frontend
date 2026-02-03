import { createContext, useState, type Dispatch, type SetStateAction, useContext, useEffect } from 'react'
import type { Config } from '../types/livekit'

export const defaultSettings: Config['settings'] = {
    wsURL: '',
    token: '',
    roomName: '',
    participantName: 'Guest',
    inputs: {
        camera: false,
        mic: false
    },
    outputs: {
        audio: true,
        video: true
    }
}

// Default configuration for the application
export const AppConfig: Config = {
    settings: defaultSettings
}

// Context to hold the configuration and a function to update it
const ConfigContext = createContext<{
    config: Config
    setConfig: Dispatch<SetStateAction<Config>>
} | null>(null)

export const useConfig = () => {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider')
    }
    return context
}

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<Config>(AppConfig)

    useEffect(() => {
        console.log("config: ", config.settings.roomName)
    }, [config])

    return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>
}
