import type { PromptTemplate } from "../types/prompt"
import { mapPrompt } from "../utils/mapping"
import { serverAPI } from "./axios"

export const getPrompts = async (): Promise<PromptTemplate[]> => {
    const res = await serverAPI.get('/prompt')
    if (res.status === 200) {
        return res.data
    }
    return []
}

export const getPromptsByCategory = async (category: string): Promise<PromptTemplate[]> => {
    const res = await serverAPI.get(`/prompt/category/${category}`)
    if (res.status === 200) {
        return res.data
    }
    return []
}

export const getPromptById = async (id: string) => {
    try {
        const res = await serverAPI.get(`/prompt/${id}`)
        if (res.status === 200) {
            return mapPrompt(res.data)
        }
    } catch (err) {
        throw err
    }
}

export const createPrompt = async (
    template_name: string,
    category: string,
    content: string,
    createdBy: string
) => {
    const res = await serverAPI.post(
        '/prompt/create',
        {
            template_name,
            category,
            content,
            created_by: createdBy
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

export const updatePrompt = async (
    data: PromptTemplate
) => {
    try {
        const res = await serverAPI.put(`/prompt/${data.id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.status === 200) {
            return mapPrompt(res.data)
        }
    } catch (err) {
        throw err
    }
}

export const deletePrompt = async (id: string) => {
    try {
        const res = await serverAPI.delete(`/prompt/${id}`)
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        throw err
    }
}