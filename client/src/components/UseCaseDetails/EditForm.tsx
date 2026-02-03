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

export interface EditFormProps {
    useCase: UseCaseData
    setMode: Dispatch<SetStateAction<keyof typeof Mode>>
    onUpdateUseCase: (useCase: UseCaseData) => void
}

function EditForm({ useCase, setMode, onUpdateUseCase }: EditFormProps) {
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
                const editedUseCase = { ...useCase, ...values }

                await updateUseCase(editedUseCase)
                onUpdateUseCase(editedUseCase)

                setMode(Mode.View)
            } catch (err) {
                setNotify({ message: 'Failed to save use case', type: 'error', open: true })
                console.error('Failed to update use case', err)
            } finally {
                setIsDirty(false)
                setLoading(false)
            }
        },
        [setMode]
    )
    return (
        <Stack direction='column' spacing={4} px={2} py={1}>
            <Formik enableReinitialize initialValues={useCase} onSubmit={handleSubmit}>
                {({ dirty, resetForm }) => {
                    useEffect(() => {
                        setIsDirty(dirty)
                    }, [dirty, setIsDirty])

                    return (
                        <Form>
                            <Stack direction='column' spacing={4}>
                                <Stack direction='row' spacing={10}>
                                    <TextFormInput label='Character Name' name='characterName' size='small' />
                                    <DropdownFormInput
                                        options={[
                                            { label: 'Male', value: 'male' },
                                            { label: 'Female', value: 'female' }
                                        ]}
                                        name='gender'
                                        label='Gender'
                                    />

                                    <DropdownFormInput options={majorOptions} name='industry' label='Industry' />
                                </Stack>
                                <Stack maxWidth='80%'>
                                    <Textarea label='Personal characteristics' name='personalCharacteristic' />
                                    <Textarea label='Scenario Context' name='scenario' />
                                    <Textarea label='Attitude' name='attitude' />
                                </Stack>
                                <Box maxWidth='80%' display='flex' justifyContent='end' gap={2}>
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

export default EditForm
