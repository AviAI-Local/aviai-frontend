import { serverAPI } from './axios'

export async function getNotes(accountId: string) {
    const res = await serverAPI.get(`/note/notes/account/${accountId}`)

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export async function updateNote(noteId: string, title: string, noteContent: any) {
    try {
        const res = await serverAPI.patch(`/note/notes/${noteId}`, {
            title,
            note_content: noteContent
        })

        if (res.status === 200) {
            return res.data
        }
        throw new Error(`Unexpected status code: ${res.status}`)
    } catch (err) {
        return err
    }
}

export async function createNote(title: string, content: any, userId: string, sessionId?: string) {
    try {
        const res = await serverAPI.post(`/note/notes`, {
            title: title,
            note_content: content,
            account_id: userId,
            session_id: sessionId || null
        })

        if (res.status === 200) {
            return res.data
        }
        throw new Error(`Unexpected status code: ${res.status}`)
    } catch (err) {
        return err
    }
}
export async function getNote(id: string) {
    const res = await serverAPI.get(`/note/notes/${id}`)

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export async function deleteNote(id: string) {
    try {
        const res = await serverAPI.delete(`/note/notes/${id}`)

        if (res.status === 200) {
            return res.data
        }
        throw new Error(`Unexpected status code: ${res.status}`)
    } catch (err) {
        return err
    }
}

export const searchNoteByUsecaseName = async (name: string) => {
    const res = await serverAPI.get(
        `/note/search/by-usecase-name`, { params: { usecase_name: name } }
    )

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}