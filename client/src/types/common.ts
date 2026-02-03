export const Role = {
    Admin: 'Admin',
    Student: 'Student'
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const PageType = {
    UseCase: 'use cases',
    Notes: 'notes'
}

export interface Note {
    id?: string
    title: string
    content: LexicalEditorState | null
    timestamp?: string
    sessionId?: string
}

export type LexicalEditorState = {
    root: {
        children: any[]
        direction: string | null
        format: string
        indent: number
        type: string
        version: number
    }
}

export type NotificationType = {
    message: string
    type: 'success' | 'error'
    open: boolean
}

export type DropdownOption = {
    value: string | number
    label: string
}
