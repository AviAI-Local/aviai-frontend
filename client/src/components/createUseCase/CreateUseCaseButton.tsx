import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import PlusIcon from '../UseCase/PlusIcon'
import { Box, Fade } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useApiNotification } from '../../contexts/ApiNotificationContext'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import type { UseCaseFormValues } from '../../types/usecase'
import type { FormikProps, FormikValues } from 'formik'
import { useLoading } from '../../contexts/LoadingContext'
import { createUseCase } from '../../api/usecase'
import { useUseCasesContext } from '../../contexts/UseCasesContext'
import { Steps } from '../../constants/texts'
import CreateUseCaseForm from './CreateUseCaseForm'
import { useUserContext } from '../../contexts/UserContext'
import type { PromptTemplate } from '../../types/prompt'
import ChooseTemplate from './ChooseTemplate'
import FileUploader from '../common/FileUploader'
import { FileDownloadRounded } from '@mui/icons-material'
import { usePromptContext } from '../../contexts/PromptContext'

function CreateUseCaseButton() {
    const [open, setOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [data, setData] = useState<UseCaseFormValues | undefined>()
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [filteredTemplates, setFilteredTemplates] = useState<PromptTemplate[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
    const formikRef = useRef<FormikProps<UseCaseFormValues>>(null)
    const { addNotification } = useApiNotification()
    const { setLoading } = useLoading()
    const { handleUpdateUseCases } = useUseCasesContext()
    const { prompts } = usePromptContext()
    const { user } = useUserContext()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    useEffect(() => {
        if (open) {
            const uniqueCategories = [...new Set(prompts.map((t) => t.category))]
            setCategories(uniqueCategories)
            if (uniqueCategories.length > 0) {
                setSelectedCategory(uniqueCategories[0])
            }
        }
    }, [open])

    useEffect(() => {
        const filtered = prompts.filter((t) => t.category === selectedCategory)
        setFilteredTemplates(filtered)
        if (filtered.length > 0) {
            setSelectedTemplate(filtered[0])
        } else {
            setSelectedTemplate(null)
        }
    }, [selectedCategory, prompts])

    useEffect(() => {
        console.log("Template: ", selectedTemplate)
    }, [selectedTemplate])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setActiveStep(0)
        setData(undefined)
        setSelectedCategory('')
        setSelectedTemplate(null)
    }

    const handleNextStep = async () => {
        if (activeStep === 0 && selectedTemplate) {
            setActiveStep(1)

            const template = filteredTemplates.find((t) => t.id === selectedTemplate.id)
            if (template) {
                setSelectedTemplate(template)
            }
        } else if (activeStep === 1) {
            setActiveStep(2)
        }
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
        const userId = user.id
        setLoading(true)

        try {
            const res = await createUseCase(
                values.name,
                selectedTemplate?.category ?? '',
                values.scenario,
                selectedTemplate?.id ?? '',
                values.personalCharacteristic,
                values.attitude,
                values.interviewRule,
                userId
            )
            console.log(res)
            addNotification('Create Scenario', 200)
            handleUpdateUseCases()
            handleClose()
        } catch (error: any) {
            addNotification('Create Scenario', error?.response?.status ?? 500)
            console.log(error.response?.data?.detail)
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }

    return (
        <>
            <PlusIcon title={'New Scenario'} onClick={handleClickOpen} />
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
                        Add New Scenario
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

                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            <CustomStepIcon activeStep={activeStep} />


                            <Fade
                                in={activeStep === 0}
                                timeout={{ enter: 400, exit: 200 }}
                                easing={{ enter: 'ease-out', exit: 'ease-in' }}
                                unmountOnExit
                            >
                                <Box sx={{ paddingX: 3 }}>
                                    <ChooseTemplate
                                        categories={categories}
                                        setCategories={setCategories}
                                        filteredTemplates={filteredTemplates}
                                        setSelectedCategory={setSelectedCategory}
                                        selectedCategory={selectedCategory}
                                        setSelectedTemplate={setSelectedTemplate}
                                        selectedTemplate={selectedTemplate}
                                    />
                                </Box>
                            </Fade>

                            <Fade
                                in={activeStep === 1}
                                timeout={{ enter: 400, exit: 200 }}
                                easing={{ enter: 'ease-out', exit: 'ease-in' }}
                                unmountOnExit
                            >
                                <Box>
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

                            <Fade
                                in={activeStep === 2}
                                timeout={{ enter: 400, exit: 200 }}
                                easing={{ enter: 'ease-out', exit: 'ease-in' }}
                                unmountOnExit
                            >
                                <Box sx={{ paddingX: 3 }}>
                                    <CreateUseCaseForm
                                        handleSubmit={handleSubmit}
                                        formRef={formikRef}
                                        data={data}
                                    />
                                </Box>
                            </Fade>


                            <Box sx={{ display: 'flex', justifyContent: activeStep > 0 ? 'space-between' : 'flex-end', paddingX: 3 }}>
                                {activeStep > 0 ?
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
                                    : null
                                }

                                <Typography
                                    onClick={() => activeStep === 2 ? formikRef.current?.submitForm() : handleNextStep()}
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
                                    {activeStep === 2 ? "Finish" : "Next"}
                                </Typography>
                            </Box>
                        </Box>
                    </>
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
    const stepIndex = activeStep === 2 ? 2 : activeStep

    return (
        <Fade
            key={activeStep}
            in={true}
            timeout={{ enter: 350, exit: 150 }}
            easing={{ enter: 'ease-out', exit: 'ease-in' }}
        >
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
                    {stepIndex + 1}
                </Box>

                <Box>
                    <Typography variant='body1' fontWeight='bold'>
                        {Steps[stepIndex]?.title}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                        {Steps[stepIndex]?.subtitle}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    )
}
