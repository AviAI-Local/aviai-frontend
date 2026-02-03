import type { Dispatch, SetStateAction } from 'react'

export interface UseCaseData {
    id: string
    name: string
    personalCharacteristic: string
    scenario: string
    summary?: string
    attitude: string
    characterName: string
    createdAt: string
    gender: string
    industry: string
    interviewRule: string
    createdBy: string
}

export type UseCaseContext = {
    useCases: UseCaseData[]
    setUseCases: Dispatch<SetStateAction<UseCaseData[]>>
    handleUpdateUseCases: () => void // adjust type if needed
    sortUseCase: (name: boolean, date: boolean) => Promise<void>
    searchUseCase: (name: string) => Promise<void>
}

export type UseCaseFormValues = {
    name: string
    characterName: string
    gender: string
    personalCharacteristic: string
    scenario: string
    attitude: string
    summary?: string
    industry: string
    interviewRule: string
}
