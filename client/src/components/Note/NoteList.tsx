import { Box, Divider, IconButton, List, ListItemButton, Stack, Typography, useTheme } from '@mui/material'
import { Add, AccessTime } from '@mui/icons-material'
import type { Note } from '../../types/common'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { Mode } from '../../constants/notes'
import { formatDate, formatTimeToHHMM } from '../../utils/format'
import { useDirtyForm } from '../../contexts/DirtyFormContext'
import ConfirmationDialog from '../common/ConfirmationDialog'
interface NoteListProps {
    notes: Note[]
    setSelectedNote: Dispatch<SetStateAction<Note | null>>
    selectedNote: Note | null
    onCreateNote: () => void
    setMode: Dispatch<SetStateAction<keyof typeof Mode>>
}

function NoteList({ notes, setSelectedNote, selectedNote, onCreateNote, setMode }: NoteListProps) {
    const theme = useTheme()
    const { isDirty, setIsDirty } = useDirtyForm()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pendingNote, setPendingNote] = useState<Note | null>(null)
    return (
        <Box width='25%' borderRight='1px solid #eee' display='flex' flexDirection='column'>
            <Box display='flex' alignItems='center' justifyContent='space-between' p={2}>
                <Typography fontSize='22px' fontWeight={500}>
                    All Notes
                </Typography>
                <IconButton size='small' onClick={onCreateNote}>
                    <Add />
                </IconButton>
            </Box>
            <Divider />
            <List disablePadding sx={{ flex: 1, overflow: 'auto' }}>
                {notes.map((note) => (
                    <Box key={note.id}>
                        <ListItemButton
                            onClick={() => {
                                if (isDirty) {
                                    setPendingNote(note)
                                    setDialogOpen(true)
                                } else {
                                    setSelectedNote(note)
                                    setMode(Mode.View)
                                }
                            }}
                            sx={{
                                backgroundColor:
                                    selectedNote?.id === note.id ? theme.palette.action.hover : 'transparent'
                            }}
                        >
                            <Stack direction='column' mb={2} mt={1}>
                                <Stack direction='row' spacing={1} mb={1.5}>
                                    <AccessTime sx={{ color: 'text.secondary' }} fontSize='small' />
                                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                                        {`${formatDate(note.timestamp)} ${formatTimeToHHMM(note.timestamp)}`}
                                    </Typography>
                                </Stack>
                                <Box fontSize='16px' fontWeight={500}>
                                    {note.title}
                                </Box>
                            </Stack>
                        </ListItemButton>
                        <Divider component='li' />
                    </Box>
                ))}
            </List>
            <ConfirmationDialog
                dialogType='Exit'
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    setIsDirty(false)
                    setDialogOpen(false)
                    if (pendingNote) {
                        setSelectedNote(pendingNote)
                        setMode(Mode.View)
                    }
                }}
            />
        </Box>
    )
}

export default NoteList
