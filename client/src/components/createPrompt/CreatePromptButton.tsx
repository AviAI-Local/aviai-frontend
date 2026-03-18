import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import PlusIcon from '../UseCase/PlusIcon'
import { Box } from '@mui/material'
import { useRef, useState } from 'react'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import type { FormikProps, FormikValues } from 'formik'
import { useLoading } from '../../contexts/LoadingContext'
import { useUserContext } from '../../contexts/UserContext'
import CreatePromptForm from './CreatePromptForm'
import type { PromptFormValues } from '../../types/prompt'
import { createPrompt } from '../../api/prompt'
import { usePromptContext } from '../../contexts/PromptContext'
import { useApiNotification } from '../../contexts/ApiNotificationContext'

function CreatePromptButton() {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState<PromptFormValues | undefined>()
    const formikRef = useRef<FormikProps<PromptFormValues>>(null)
    const { setLoading } = useLoading()
    const { user } = useUserContext()
    const { handleUpdatePrompts } = usePromptContext()
    const { addNotification } = useApiNotification()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    const handleClickOpen = () => {
        setOpen(true) 
    }

    const handleClose = () => {
        setOpen(false)
        setData(undefined)
    }

    const handleSubmit = async (values: FormikValues, props: any) => {
        const { setSubmitting } = props
        setLoading(true)
        const userId = user.id
        console.log('Prompt values:', values)
        try {
            await createPrompt(
                values.template_name,
                values.category,
                values.content,
                userId
            )
            addNotification('Create Prompt', 200)
            handleUpdatePrompts()
            handleClose()
        } catch (error: any) {
            const status = error?.response?.status ?? 500
            const message = status === 500 ? 'Prompt already exists' : undefined
            addNotification('Create Prompt', status, message)
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }

    return (
        <>
            <PlusIcon title={'New Prompt'} onClick={handleClickOpen} />
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 4,
                            width: 750,
                            overflow: 'hidden',
                            backgroundColor: 'primary.contrastText'
                        }
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: 'white'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: 28
                        }}
                    >
                        Add New Prompt
                    </Typography>
                    <HighlightOffOutlinedIcon
                        aria-label='close'
                        onClick={handleClose}
                        sx={{
                            color: 'primary.main',
                            cursor: 'pointer'
                        }}
                    >
                        <CloseIcon />
                    </HighlightOffOutlinedIcon>
                </DialogTitle>

                <DialogContent
                    sx={{
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginY: 2,
                        paddingX: 4,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        minHeight: '30vh'
                    }}
                >
                    <Box sx={{ paddingX: 3 }}>
                        <CreatePromptForm
                            handleSubmit={handleSubmit}
                            formRef={formikRef}
                            data={data}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingX: 3 }}>
                        <Typography
                            onClick={() => formikRef.current?.submitForm()}
                            sx={{
                                fontWeight: 400,
                                fontSize: 14,
                                textDecoration: 'underline',
                                color: '#9FA7BE',
                                cursor: 'pointer',
                                '&:hover': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            Save
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreatePromptButton
