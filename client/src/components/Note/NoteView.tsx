import { Box, Divider, Stack, Typography, TextField } from '@mui/material'
import type { Note } from '../../types/common'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import EditorPlugin from './EditorPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ButtonIcon from '../common/ButtonIcon'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { useCallback, type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import NoteEditor from './NoteEditor'
import { formatDate, formatTimeToHHMM } from '../../utils/format'
import { Mode } from '../../constants/notes'
import { Formik, Form, Field, type FormikValues } from 'formik'
import * as Yup from 'yup'
import type { EditorState } from 'lexical'
import { createNote, deleteNote, updateNote } from '../../api/note'
import { useLoading } from '../../contexts/LoadingContext'
import { EMPTY_EDITOR_STATE } from '../../utils/note'
import FullPageLoader from '../common/FullPageLoader'
import { editorTheme } from '../../utils/theme'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { ListNode, ListItemNode } from '@lexical/list'
import { useUserContext } from '../../contexts/UserContext'
import ConfirmationDialog from '../common/ConfirmationDialog'
import { useNotification } from '../../contexts/NotificationContext'
import { useDirtyForm } from '../../contexts/DirtyFormContext'
import ActionButton from '../common/ActionButton'
import { useApiNotification } from '../../contexts/ApiNotificationContext'

interface NoteViewProps {
    note: Note
    mode: keyof typeof Mode
    setMode: Dispatch<SetStateAction<keyof typeof Mode>>
    onSaveNote: (note: Note) => void
    onDeleteNote: (noteId: string) => void
    onCancelNote: () => void
}

const NoteSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required')
})

function NoteView({ note, mode, setMode, onSaveNote, onDeleteNote, onCancelNote }: NoteViewProps) {
    const isEdit = mode === Mode.Edit
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const { loading, setLoading } = useLoading()
    const { user } = useUserContext()
    const { setNotify } = useNotification()
    const { isDirty, setIsDirty } = useDirtyForm()
    const { addNotification } = useApiNotification()
    if (!user) {
        throw new Error('User not found in context')
    }
    const editorConfig = {
        namespace: `NoteViewer_${Date.now()}`,
        onError(error: Error) {
            console.error('Lexical Error:', error)
        },
        editable: false,
        editorState: null,
        theme: editorTheme,
        nodes: [HeadingNode, CodeHighlightNode, CodeNode, ListNode, ListItemNode]
    }

    const handleConfirmDelete = useCallback(async () => {
        if (!note.id) return
        try {
            setLoading(true)
            await deleteNote(note.id)
            addNotification('Delete Note', 200)
            onDeleteNote(note.id)
        } catch (err: any) {
            const status = err?.response?.status ?? 500
            addNotification('Delete Note', status)
            setNotify({ message: 'Failed to delete note', type: 'error', open: true })
            console.error('Failed to delete note', err)
        } finally {
            setDeleteDialogOpen(false)
            setLoading(false)
        }
    }, [note.id])

    useEffect(() => {
        if (!note.id) {
            setMode(Mode.Edit)
        }
    }, [note])

    const handleSubmit = useCallback(
        async (values: FormikValues) => {
            try {
                setLoading(true)
                const contentToUpdate =
                    typeof values.content === 'string'
                        ? JSON.parse(values.content)
                        : (values.content || EMPTY_EDITOR_STATE)
                console.log(contentToUpdate)
                if (note.id) {
                    const updatedNote = await updateNote(note.id, values.title, contentToUpdate)
                    onSaveNote(updatedNote)
                } else {
                    const createdNote = await createNote(values.title, contentToUpdate, user.id)
                    onSaveNote(createdNote)
                }

                setMode(Mode.View)
            } catch (err) {
                setNotify({ message: 'Failed to save note', type: 'error', open: true })
                console.error('Failed to update note', err)
            } finally {
                setIsDirty(false)
                setLoading(false)
            }
        },
        [note.id, setMode]
    )

    return (
        <Box flex={1} overflow='auto'>
            {/* ===== VIEW MODE ===== */}
            {!isEdit && (
                <>
                    <Box px={4} py={2}>
                        <Box width='full' display='flex' justifyContent='space-between'>
                            <Box fontSize='28px' fontWeight='500' mb={1}>
                                {note.title}
                            </Box>
                            <Stack direction='row' spacing={1} alignSelf='flex-end'>
                                <ButtonIcon
                                    icon={EditOutlined}
                                    sx={{ boxShadow: 'none', border: '1px solid #3D64FD' }}
                                    onClick={() => setMode(Mode.Edit)}
                                />
                                <ButtonIcon
                                    icon={DeleteOutline}
                                    sx={{ boxShadow: 'none', border: '1px solid #F25D5A' }}
                                    actionType='danger'
                                    onClick={() => setDeleteDialogOpen(true)}
                                />
                            </Stack>
                        </Box>

                        <Typography variant='body2' color='text.secondary' gutterBottom>
                            {`${formatDate(note.timestamp)} ${formatTimeToHHMM(note.timestamp)}`}
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box px={4}>
                        <LexicalComposer initialConfig={editorConfig}>
                            <EditorPlugin jsonContent={note.content} />
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        className='editor-readonly'
                                        style={{ outline: 'none', fontSize: '16px' }}
                                    />
                                }
                                placeholder={null}
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <HistoryPlugin />
                        </LexicalComposer>
                    </Box>
                </>
            )}

            {/* ===== EDIT MODE ===== */}
            {isEdit && (
                <Formik
                    initialValues={{
                        title: note?.title || '',
                        content: note?.content
                    }}
                    validationSchema={NoteSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, dirty }) => {
                        useEffect(() => {
                            setIsDirty(dirty)
                        }, [dirty, setIsDirty])

                        return (
                            <Form style={{ height: '100%' }}>
                                <Box px={4} py={2}>
                                    <Box width='full' display='flex' justifyContent='space-between'>
                                        <Box fontSize='28px' fontWeight='500' mb={1}>
                                            <Field
                                                as={TextField}
                                                name='title'
                                                variant='outlined'
                                                size='small'
                                                fullWidth
                                            />
                                        </Box>
                                    </Box>

                                    <Typography variant='body2' color='text.secondary' gutterBottom>
                                        {`${formatDate(note.timestamp)} ${formatTimeToHHMM(note.timestamp)}`}
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box px={4}>
                                    <NoteEditor
                                        content={note.id ? note.content : null}
                                        onChange={(newContent: EditorState) => {
                                            const jsonContent = JSON.stringify(newContent)
                                            setFieldValue('content', jsonContent)
                                        }}
                                    />
                                </Box>
                                <Box px={4} py={2} display='flex' justifyContent='flex-end' gap={2}>
                                    <ActionButton
                                        actionType='secondary'
                                        onClick={() => {
                                            if (isDirty) {
                                                setCancelDialogOpen(true)
                                            } else {
                                                onCancelNote()
                                            }
                                        }}
                                    >
                                        Cancel
                                    </ActionButton>
                                    <ActionButton type='submit' actionType='primary'>
                                        Save
                                    </ActionButton>
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
            )}
            {loading && <FullPageLoader loading={loading} />}
            <ConfirmationDialog
                dialogType='Delete'
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
            <ConfirmationDialog
                dialogType='Exit'
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                onConfirm={() => {
                    setIsDirty(false)
                    setCancelDialogOpen(false)
                    onCancelNote()
                }}
            />
        </Box>
    )
}

export default NoteView
