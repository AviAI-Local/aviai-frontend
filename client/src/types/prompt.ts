import { Dispatch, SetStateAction } from "react"

export type PromptFormValues = {
    template_name: string
    category: string
    content: string
}

export type PromptTemplate = {
    id: string
    template_name: string
    category: string
    content: string
    createdAt?: string
}

export type PromptContext = {
    prompts: PromptTemplate[]
    setPrompts: Dispatch<SetStateAction<PromptTemplate[]>>
    handleUpdatePrompts: () => void // adjust type if needed
}