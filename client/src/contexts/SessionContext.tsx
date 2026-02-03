import { createContext, useContext, useState, type ReactNode } from "react";
import type { Session, SessionContextType } from "../types/session";
import type { UseCaseData } from "../types/usecase";

const SessionContext = createContext<SessionContextType | undefined>(undefined)

function SessionProvider({ children }: { children: ReactNode }) {
const [session, setSession] = useState<Session | null>(null);
const [usecase, setUsecase] = useState<UseCaseData | null>(null)


    const sessionList: SessionContextType = {
        session,
        setSession,
        usecase,
        setUsecase
    }

    return <SessionContext.Provider value={sessionList}>
        {children}
    </SessionContext.Provider>
}

const useSession = () => {
    const context = useContext(SessionContext)
    if (!context) {
        throw new Error('useSession must be used within a UseSessionProvider')
    }
    return context
}

export { SessionProvider, useSession }