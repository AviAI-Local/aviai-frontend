import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react'
import type { PromptContext, PromptTemplate } from '../types/prompt'
import { useLoading } from './LoadingContext'
import { useUserContext } from './UserContext'
import { useLocation } from 'react-router-dom'
import { getPrompts } from '../api/prompt'

const PromptContext = createContext<PromptContext | undefined>(undefined)

function PromptProvider({ children }: { children: ReactNode }) {
    const [prompts, setPrompts] = useState<PromptTemplate[]>([])
    const [newPrompt, setNewPrompt] = useState(false)
    const { setLoading } = useLoading()
    const { user } = useUserContext()
    const location = useLocation()

    // Prevent fetching on every render
    const handleUpdatePrompts = useCallback(() => {
        setLoading(true)
        setNewPrompt((prev) => !prev)
    }, [setLoading])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getPrompts()
                const data = res.map((item: any) => ({
                    id: item.template_id,
                    template_name: item.template_name,
                    category: item.category,
                    content: item.content
                }))
                setPrompts(data)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [newPrompt, setLoading, user, location.pathname])

    const promptList: PromptContext = {
        prompts,
        setPrompts,
        handleUpdatePrompts
    }

    return <PromptContext.Provider value={promptList}>{children}</PromptContext.Provider>
}

const usePromptContext = () => {
    const context = useContext(PromptContext)
    if (!context) {
        throw new Error('usePromptContext must be used within a PromptProvider')
    }
    return context
}

export { PromptProvider, usePromptContext }
