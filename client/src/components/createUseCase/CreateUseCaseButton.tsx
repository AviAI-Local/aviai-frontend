import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import PlusIcon from '../UseCase/PlusIcon'
import { Box, CircularProgress, Fade } from '@mui/material'
import FileUploader from '../common/FileUploader'
import { useRef, useState } from 'react'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import type { UseCaseFormValues } from '../../types/usecase'
import type { FormikProps, FormikValues } from 'formik'
import { useLoading } from '../../contexts/LoadingContext'
import { createUseCase } from '../../api/usecase'
import { useUseCasesContext } from '../../contexts/UseCasesContext'
import { Steps } from '../../constants/texts'
import { FileDownloadRounded } from '@mui/icons-material'
import CreateUseCaseForm from './CreateUseCaseForm'
import { useUserContext } from '../../contexts/UserContext'

function CreateUseCaseButton() {
    const [open, setOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [data, setData] = useState<UseCaseFormValues | undefined>()
    const formikRef = useRef<FormikProps<UseCaseFormValues>>(null)
    const { loading, setLoading } = useLoading()
    const { handleUpdateUseCases } = useUseCasesContext()
    const { user } = useUserContext()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setActiveStep(0)
        setData(undefined)
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = './Template.docx'
        link.download = 'Template.docx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleSubmit = async (values: FormikValues, props: any) => {
        const { setSubmitting } = props
        const summary = values.summary ?? ''
        const interviewRule = values.interviewRule ?? '  '
        const userId = user.id 
        console.log(values)
        try {
            const res = await createUseCase(
                values.name,
                summary,
                values.personalCharacteristic,
                values.attitude,
                interviewRule,
                values.characterName,
                'Female',
                values.industry,
                values.scenario,
                userId
            )
            console.log(res)
            handleUpdateUseCases()
            handleClose()
        } catch (error: any) {
            console.log(error.response.data.detail)
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }

    return (
        <>
            <PlusIcon title={'New Case'} onClick={handleClickOpen} />
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
                        Add New Use Case
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
                        gap: 6,
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 4,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        minHeight: '30vh',
                        position: 'relative'
                    }}
                >
                    {loading ? (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10,
                                borderRadius: 2
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}
                            >
                                <CustomStepIcon activeStep={activeStep} />

                                <Fade in={activeStep === 0} timeout={500} unmountOnExit>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}
                                    >
                                        <Box
                                            onClick={handleDownload}
                                            sx={{
                                                display: 'flex',
                                                width: 'fit-content',
                                                alignItems: 'center',
                                                color: '#9FA7BE',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'primary.main'
                                                }
                                            }}
                                        >
                                            <FileDownloadRounded sx={{ fontSize: 12 }} />

                                            <Typography
                                                sx={{
                                                    fontWeight: 400,
                                                    fontSize: 12
                                                }}
                                            >
                                                Download Template
                                            </Typography>
                                        </Box>
                                        <FileUploader setData={setData} setActiveStep={setActiveStep} />
                                    </Box>
                                </Fade>

                                <Fade in={activeStep === 1} timeout={500} unmountOnExit>
                                    <Box
                                        sx={{
                                            paddingX: 3
                                        }}
                                    >
                                        <CreateUseCaseForm
                                            handleSubmit={handleSubmit}
                                            formRef={formikRef}
                                            data={data}
                                        />
                                    </Box>
                                </Fade>

                                {activeStep == 1 && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Typography
                                            onClick={() => setActiveStep(activeStep - 1)}
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
                                            Back
                                        </Typography>

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
                                            Finish
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {activeStep == 0 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    <Typography
                                        onClick={() => setActiveStep(activeStep + 1)}
                                        sx={{
                                            position: 'absolute',
                                            right: 10,
                                            bottom: 0,
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
                                        Skip
                                    </Typography>
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateUseCaseButton

interface CustomStepIconProps {
    activeStep: number
}

function CustomStepIcon({ activeStep }: CustomStepIconProps) {
    return (
        <Fade key={activeStep} in={true} timeout={300}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1.5
                }}
            >
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        color: 'white'
                    }}
                >
                    {activeStep + 1}
                </Box>

                <Box>
                    <Typography variant='body1' fontWeight='bold'>
                        {Steps[activeStep].title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                        {Steps[activeStep].subtitle}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    )
}
