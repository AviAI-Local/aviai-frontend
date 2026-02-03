import { Box } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import NoteList from '../components/Note/NoteList'
import NoteView from '../components/Note/NoteView'
import PageLayout from '../components/layout/PageLayout'
import { type Note } from '../types/common'
import { useUserContext } from '../contexts/UserContext'
import { getNotes } from '../api/note'
import { mapNote } from '../utils/mapping'
import { useLoading } from '../contexts/LoadingContext'
import FullPageLoader from '../components/common/FullPageLoader'
import { Mode } from '../constants/notes'
import { useNotification } from '../contexts/NotificationContext'

function Notes() {
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const { user } = useUserContext()
    const { loading, setLoading } = useLoading()
    const [mode, setMode] = useState<keyof typeof Mode>(Mode.View)
    const {setNotify} = useNotification()

    const fetchNotes = useCallback(async (savedNote?: Note) => {
        try {
            setLoading(true)
            if (!user) return
            const fetchedNotes = await getNotes(user.id)
            if (fetchedNotes) {
                const mappedNotes = fetchedNotes.map((note: any) => mapNote(note))
                const sortedNotes = mappedNotes.sort((a: Note, b: Note) => {
                    const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0
                    const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0
                    return bTime - aTime
                })
                setNotes(sortedNotes)
                // Set saved note for creating or updating a note
                if (savedNote) {
                    const updatedNote = mappedNotes.find((n: Note) => n.id === savedNote.id)
                    setSelectedNote(updatedNote || mappedNotes[0] || null)
                } else {
                    setSelectedNote(mappedNotes[0] || null)
                }
            }
        } catch (err) {
            console.error('Failed to fetch notes:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNotes()
    }, [user])

    const handleCreateNote = useCallback(() => {
        const newNote: Note = {
            title: 'Untitled',
            content: null
        }
        setNotes([newNote, ...notes])
        setSelectedNote(newNote)
        setMode(Mode.Edit)
    }, [])

    const handleSaveNote = useCallback((savedNote: any) => {
        fetchNotes(mapNote(savedNote))
        setMode(Mode.View)
        setNotify({ message: 'Note saved successfully', type: 'success', open: true })
    }, [])

    const handleDeleteNote = useCallback(() => {
        fetchNotes()
        setNotify({ message: 'Note deleted successfully', type: 'success', open: true })
    }, [])

    return (
        <PageLayout headerProps={{ title: 'Notes', total: notes.length, pageType: 'Notes' }}>
            <Box display='flex' height='100vh'>
                <NoteList
                    notes={notes}
                    selectedNote={selectedNote}
                    setSelectedNote={setSelectedNote}
                    onCreateNote={handleCreateNote}
                    setMode={setMode}
                />
                {selectedNote && (
                    <NoteView
                        note={selectedNote}
                        mode={mode}
                        setMode={setMode}
                        onSaveNote={handleSaveNote}
                        onDeleteNote={handleDeleteNote}
                    />
                )}
            </Box>
            {loading && <FullPageLoader loading={loading} />}
        </PageLayout>
    )
}

export default Notes
