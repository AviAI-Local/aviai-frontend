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
            personal_characteristics: useCase.personalCharacteristic,
            attitude_in_interview: useCase.attitude,
            rule_interview: useCase.interviewRule,
            created_by: useCase.createdBy,
            category: useCase.category,
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
    category: string,
    scenarioText: string,
    promptId: string,
    personalCharacteristic: string,
    attitude: string,
    interviewRule: string,
    createdBy: string,
) => {
    const res = await serverAPI.post(
        '/scenario',
        {
            scenario_name: name,
            prompt_id: promptId,
            created_by: createdBy,
            scenario_text: scenarioText,
            category: category,
            personal_characteristics: personalCharacteristic,
            attitude_in_interview: attitude,
            rule_interview: interviewRule
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
