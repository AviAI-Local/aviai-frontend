import { Form, Formik, type FormikValues } from 'formik'
import type { UseCaseData } from '../../types/usecase'
import Textarea from '../common/Textarea'
import { Box, Stack } from '@mui/material'
import TextFormInput from '../common/TextFormInput'
import DropdownFormInput from '../common/DropdownFormInput'
import { majorOptions } from '../../constants/texts'
import { useCallback, type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { Mode } from '../../constants/notes'
import { useLoading } from '../../contexts/LoadingContext'
import { updateUseCase } from '../../api/usecase'
import ActionButton from '../common/ActionButton'
import { useNotification } from '../../contexts/NotificationContext'
import ConfirmationDialog from '../common/ConfirmationDialog'
import { useDirtyForm } from '../../contexts/DirtyFormContext'
import { PromptTemplate } from '../../types/prompt'
import { updatePrompt } from '../../api/prompt'

export interface UpdateFormProps {
    prompt: PromptTemplate
    setMode: Dispatch<SetStateAction<keyof typeof Mode>>
    onUpdatePrompt: (prompt: PromptTemplate) => void
}

function UpdateForm({ prompt, setMode, onUpdatePrompt }: UpdateFormProps) {
    const { setLoading } = useLoading()
    const { setNotify } = useNotification()
    const [dialogOpen, setDialogOpen] = useState(false)
    const { setIsDirty } = useDirtyForm()

    const handleConfirmDiscard = useCallback((resetForm: () => void) => {
        setIsDirty(false)
        resetForm()
        setDialogOpen(false)
        setMode(Mode.View)
        
    }, [])

    const handleSubmit = useCallback(
        async (values: FormikValues) => {
            try {
                setLoading(true)
                const editedPrompt = { ...prompt, ...values }

                console.log(editedPrompt)

                // await updateUseCase(editedPrompt)
                await updatePrompt(editedPrompt)
                onUpdatePrompt(editedPrompt)

                setMode(Mode.View)
            } catch (err) {
                setNotify({ message: 'Failed to save prompt', type: 'error', open: true })
                console.error('Failed to update prompt', err)
            } finally {
                setIsDirty(false)
                setLoading(false)
            }
        },
        [setMode]
    )
    return (
        <Stack direction='column' spacing={4} px={2} py={1}>
            <Formik enableReinitialize initialValues={prompt} onSubmit={handleSubmit}>
                {({ dirty, resetForm }) => {
                    useEffect(() => {
                        setIsDirty(dirty)
                    }, [dirty, setIsDirty])

                    return (
                        <Form>
                            <Stack direction='column' spacing={4}>
                                <Stack maxWidth='100%'>
                                    <Textarea label='Content' name='content' rows={50} />
                                </Stack>
                                <Box maxWidth='100%' display='flex' justifyContent='end' gap={2}>
                                    <ActionButton
                                        onClick={() => {
                                            if (dirty) {
                                                setDialogOpen(true)
                                            } else {
                                                setMode(Mode.View)
                                            }
                                        }}
                                        actionType='secondary'
                                    >
                                        Cancel
                                    </ActionButton>
                                    <ActionButton type='submit' actionType='primary'>
                                        Save
                                    </ActionButton>
                                </Box>
                            </Stack>
                            <ConfirmationDialog
                                dialogType='Exit'
                                open={dialogOpen}
                                onClose={() => setDialogOpen(false)}
                                onConfirm={() => handleConfirmDiscard(resetForm)}
                            />
                        </Form>
                    )
                }}
            </Formik>
        </Stack>
    )
}

export default UpdateForm
