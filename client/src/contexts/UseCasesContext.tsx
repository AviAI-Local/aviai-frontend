import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react'
import { getSortUseCase, getUseCases, searchUseCaseByName } from '../api/usecase'
import type { UseCaseContext, UseCaseData } from '../types/usecase'
import { useLoading } from './LoadingContext'
import { useUserContext } from './UserContext'
import { useLocation } from 'react-router-dom'

const UseCasesContext = createContext<UseCaseContext | undefined>(undefined)

function UseCasesProvider({ children }: { children: ReactNode }) {
    const [useCases, setUseCases] = useState<UseCaseData[]>([])
    const [newUseCase, setNewUseCase] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setLoading } = useLoading()
    const { user } = useUserContext()
    const location = useLocation()

    // Prevent fetching on every render
    const handleUpdateUseCases = useCallback(() => {
        setLoading(true)
        setNewUseCase((prev) => !prev)
    }, [setLoading])

    const sortUseCase = async (name: boolean = false, date: boolean = false) => {
        console.log(name, date)
        const res = await getSortUseCase(name, date)
        const data = res.map((item: any) => ({
            id: item.scenario_id,
            name: item.scenario_name,
            personalCharacteristic: item.personal_characteristic,
            scenario: '',
            attitude: item.attitude_in_interview,
            characterName: item.character_name,
            createdAt: item.created_at,
            gender: item.character_gender,
            industry: item.industry,
            interviewRule: item.rule_interview
        }))
        setUseCases(data)
    }

    const searchUseCase = async (name: string) => {
        
        const res = await searchUseCaseByName(name)
        const data = res.map((item: any) => ({
            id: item.usecase_id,
            name: item.usecase_name,
            personalCharacteristic: item.personal_characteristic,
            scenario: '',
            summary: item.usecase_summary,
            attitude: item.attitude_in_interview,
            characterName: item.character_name,
            createdAt: item.created_at,
            gender: item.character_gender,
            industry: item.industry,
            interviewRule: item.rule_interview
        }))
        setUseCases(data)
    }

    useEffect(() => {
        async function fetchData() {
            setError(null)
            try {
                const res = await getUseCases()
                const data = res.map((item: any) => ({
                    id: item.scenario_id,
                    name: item.scenario_name,
                    personalCharacteristic: item.personal_characteristics,
                    scenario: item.scenario_text,
                    attitude: item.attitude_in_interview,
                    createdAt: item.created_at,
                    category: item.category,
                    interviewRule: item.rule_interview
                }))
                setUseCases(data)
            } catch (err) {
                console.error('Failed to load use cases:', err)
                setUseCases([])
                setError('Failed to load scenarios. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [newUseCase, setLoading, user, location.pathname])

    const useCaseList: UseCaseContext = {
        useCases,
        setUseCases,
        handleUpdateUseCases,
        sortUseCase,
        searchUseCase,
        error
    }

    return <UseCasesContext.Provider value={useCaseList}>{children}</UseCasesContext.Provider>
}

const useUseCasesContext = () => {
    const context = useContext(UseCasesContext)
    if (!context) {
        throw new Error('useCasesContext must be used within a UseCasesProvider')
    }
    return context
}

export { UseCasesProvider, useUseCasesContext }
