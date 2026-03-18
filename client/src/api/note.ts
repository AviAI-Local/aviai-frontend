import { serverAPI } from './axios'

export async function getNotes(accountId: string) {
    const res = await serverAPI.get(`/note/account/${accountId}`)

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
        const res = await serverAPI.patch(`/note/update/${noteId}`, {
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
    const res = await serverAPI.post(`/note/create`, {
        title: title,
        note_content: content,
        account_id: userId,
        session_id: sessionId || null
    })
    return res.data
}
export async function getNote(id: string) {
    const res = await serverAPI.get(`/note/${id}`)

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}

export async function deleteNote(id: string) {
    const res = await serverAPI.delete(`/note/delete/${id}`)
    return res.data
}

export const searchNoteByScenarioName = async (name: string) => {
    const res = await serverAPI.get(
        `/note/search/by-scenario-name`, { params: { scenario_name: name } }
    )

    try {
        if (res.status === 200) {
            return res.data
        }
    } catch (err) {
        return err
    }
}