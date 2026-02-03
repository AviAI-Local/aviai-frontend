import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box } from '@mui/material'
import { DialogType } from '../../constants/notes'
import { useMemo } from 'react'
import ActionButton from './ActionButton'
import deleteIllustration from '../../assets/delete_illustration.png'

export interface ConfirmationDialogProps {
    open: boolean
    dialogType: keyof typeof DialogType
    onClose?: () => void
    onConfirm: () => void
    message?: string
}

interface Content {
    title: string
    message: string
    illustration?: string
    primaryAction: string
    secondaryAction: string
}

function ConfirmationDialog({ open, onClose, onConfirm, dialogType, message }: ConfirmationDialogProps) {
    const content: Content = useMemo(() => {
        switch (dialogType) {
            case DialogType.Delete:
                return {
                    title: 'Do you want to delete this item?',
                    message: message || 'This action cannot be undone.',
                    illustration: deleteIllustration,
                    primaryAction: 'Delete',
                    secondaryAction: 'Cancel'
                }
            default:
                return {
                    title: 'You have unsaved changes',
                    message: message || 'Are you sure you want to discard them?',
                    primaryAction: 'Continue',
                    secondaryAction: 'Cancel'
                }
        }
    }, [dialogType])
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 3,
                    padding: 2,
                    minWidth: 200,
                    maxWidth: 400
                }
            }}
        >
            <DialogTitle>
                {content.illustration && (
                    <Box display='flex' justifyContent='center' mb={1}>
                        <img src={content.illustration} width='50%' height='30%' />
                    </Box>
                )}
                <Typography variant='h6' fontWeight='bold'>
                    {content.title}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant='subtitle1' sx={{  color: 'gray'}}>{content.message}</Typography>
            </DialogContent>
            <DialogActions>
                <ActionButton onClick={onClose} actionType='secondary'>
                    {content.secondaryAction}
                </ActionButton>
                <ActionButton onClick={onConfirm} actionType='danger'>
                    {content.primaryAction}
                </ActionButton>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog
