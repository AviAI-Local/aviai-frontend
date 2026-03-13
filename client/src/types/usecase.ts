import type { Dispatch, SetStateAction } from 'react'

export interface UseCaseData {
    id: string
    name: string
    personalCharacteristic: string
    scenario: string
    attitude: string
    createdAt: string
    category: string
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
    personalCharacteristic: string
    scenario: string
    attitude: string
    interviewRule: string
}
