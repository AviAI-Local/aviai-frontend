// UnsavedChangesContext.tsx
import { createContext, useContext, useState } from 'react'

interface DirtyFormContextType {
    isDirty: boolean
    setIsDirty: (value: boolean) => void
}

const DirtyFormContext = createContext<DirtyFormContextType | undefined>(undefined)

export function DirtyFormProvider({ children }: { children: React.ReactNode }) {
    const [isDirty, setIsDirty] = useState(false)

    return <DirtyFormContext.Provider value={{ isDirty, setIsDirty }}>{children}</DirtyFormContext.Provider>
}

export function useDirtyForm() {
    const context = useContext(DirtyFormContext)
    if (!context) throw new Error('useDirtyForm must be used inside DirtyFormProvider')
    return context
}
