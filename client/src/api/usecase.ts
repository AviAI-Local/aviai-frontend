import type { UseCaseData } from '../types/usecase'
import { mapUseCase } from '../utils/mapping'
import { serverAPI } from './axios'

export const getUseCases = async () => {
    const res = await serverAPI.get(`/scenario`)

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export const getUseCase = async (id: string) => {
    try {
        const res = await serverAPI.get(`/scenario/${id}`)
        if (res.status === 200) {
            return mapUseCase(res.data)
        }
    } catch (err) {
        throw err
    }
}

export async function updateUseCase(useCase: UseCaseData) {
    try {
        const res = await serverAPI.patch(`/scenario/${useCase.id}`, {
            usecase_name: useCase.name,
            usecase_summary: useCase.summary,
            personal_characteristics: useCase.personalCharacteristic,
            attitude_in_interview: useCase.attitude,
            rule_interview: useCase.interviewRule,
            character_name: useCase.characterName,
            character_gender: useCase.gender,
            created_by: useCase.createdBy,
            industry: useCase.industry,
            scenario_text: useCase.scenario
        })

        if (res.status === 200) {
            return res.data
        }
        throw new Error(`Unexpected status code: ${res.status}`)
    } catch (err) {
        return err
    }
}

export async function deleteUseCase(id: string) {
    try {
        const res = await serverAPI.delete(`/scenario/${id}`)

        if (res.status === 200) {
            return res.data
        }
        throw new Error(`Unexpected status code: ${res.status}`)
    } catch (err) {
        return err
    }
}

export const createUseCase = async (
    name: string,
    summary: string,
    personalCharacteristic: string,
    attitude: string,
    interviewRule: string,
    characterName: string,
    gender: string,
    industry: string,
    scenario: string,
    createdBy: string
) => {
    const res = await serverAPI.post(
        '/scenario',
        {
            scenario_name: name,
            scenario_summary: summary,
            personal_characteristics: personalCharacteristic,
            attitude_in_interview: attitude,
            rule_interview: interviewRule,
            character_name: characterName,
            character_gender: gender,
            created_by: createdBy,
            industry: industry,
            scenario_text: scenario
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    try {
        if (res.status === 200) {
            return res
        }
    } catch (err) {
        return err
    }
}

export const extractDocument = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await serverAPI.post('/document/extract', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export const getSortUseCase = async (name = false, date = false, order: 'asc' | 'desc' = 'asc') => {
    let res
    if (name) {
        res = await serverAPI.get(`/scenario/sorted/name`, { params: { order } })
    }

    if (date) {
        res = await serverAPI.get(`/scenario/sorted/date`, { params: { order } })
    }

    try {
        if (res?.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export const searchUseCaseByName = async (name: string) => {
    const res = await serverAPI.get(
        `/scenario/search/by-name`, { params: { usecase_name: name } }
    )

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}
