import type { PromptTemplate } from "../types/prompt"
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

export const getPromptById = async (id: string): Promise<PromptTemplate | null> => {
    const res = await serverAPI.get(`/prompt/${id}`)
    if (res.status === 200) {
        return res.data
    }
    return null
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