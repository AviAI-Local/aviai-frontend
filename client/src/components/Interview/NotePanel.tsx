import { Box, TextField } from '@mui/material'
import PanelLayout from '../layout/PanelLayout'
import ActionButton from '../common/ActionButton'

export interface NotePanelProps {
    noteText: string
    setNoteText: (text: string) => void
}

function NotePanel({ noteText, setNoteText }: NotePanelProps) {
    const handleCancel = () => setNoteText('')

    return (
        <PanelLayout title='Note'>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <TextField
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    multiline
                    fullWidth
                    placeholder='Write your notes here...'
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root': {
                            height: '100%',
                            alignItems: 'flex-start',
                            backgroundColor: '#F8F9FD',
                            fontSize: 14
                        },
                        '& fieldset': { border: 'none' }
                    }}
                    slotProps={{
                        input: { style: { height: '100%', overflow: 'auto' } }
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1, borderTop: '1px solid #eee' }}>
                    <ActionButton actionType='secondary' size='small' onClick={handleCancel}>
                        Cancel
                    </ActionButton>
                    <ActionButton actionType='primary' size='small' onClick={() => {}}>
                        Save
                    </ActionButton>
                </Box>
            </Box>
        </PanelLayout>
    )
}

export default NotePanel
