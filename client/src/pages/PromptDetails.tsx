import { Box, Divider, Stack, Typography } from '@mui/material'
import PageLayout from '../components/layout/PageLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoading } from '../contexts/LoadingContext'
import { useCallback, useEffect, useState } from 'react'
import type { UseCaseData } from '../types/usecase'
import { getUseCase } from '../api/usecase'
import FullPageLoader from '../components/common/FullPageLoader'
import { formatDate } from '../utils/format'
import ActionSection from '../components/UseCaseDetails/ActionSection'
import { useSession } from '../contexts/SessionContext'
import { createNewSession } from '../api/session'
import { useUserContext } from '../contexts/UserContext'
import DetailsSection from '../components/UseCaseDetails/DetailsSection'
import EditForm from '../components/UseCaseDetails/EditForm'
import { Mode } from '../constants/notes'
import ConfirmationDialog from '../components/common/ConfirmationDialog'
import { useUseCasesContext } from '../contexts/UseCasesContext'
import { useNotification } from '../contexts/NotificationContext'
import { PromptTemplate } from '../types/prompt'
import { deletePrompt, getPromptById } from '../api/prompt'
import DetailsPart from '../components/PromptDetail.tsx/DetailsPart'
import UpdateForm from '../components/PromptDetail.tsx/UpdateForm'
import ButtonIcon from '../components/common/ButtonIcon'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { usePromptContext } from '../contexts/PromptContext'

function PromptDetails() {
    const { id } = useParams()
    const { user } = useUserContext()
    const { loading, setLoading } = useLoading()
    const { handleUpdateUseCases } = useUseCasesContext()
    const [useCase, setCurrentUseCase] = useState<UseCaseData>()
    const [prompt, setPrompt] = useState<PromptTemplate>()
    const [mode, setMode] = useState<keyof typeof Mode>(Mode.View)
    const { setNotify } = useNotification()
    const { handleUpdatePrompts } = usePromptContext()
    const [dialogOpen, setDialogOpen] = useState(false)
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        try {
            if (id) {
                setLoading(true)
                const data = await getPromptById(id)
                setPrompt(data)
            }
        } catch (error) {
            console.error('Failed to fetch use case:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSaveUseCase = useCallback(() => {
        fetchData()
        setMode(Mode.View)
        setNotify({ message: 'Prompt saved successfully', type: 'success', open: true })
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            const deletedPrompt = await deletePrompt(id)
            if (!deletedPrompt) throw new Error('Prompt not found')
            handleUpdatePrompts()
            navigate('/prompts')
            setNotify({ message: 'Prompt deleted successfully', type: 'success', open: true })
        } catch (err) {
            setNotify({ message: 'Failed to delete prompt', type: 'error', open: true })
            console.error('Failed to delete prompt', err)
        } finally {
            setDialogOpen(false)
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [id])

    if (!prompt) {
        return <FullPageLoader loading={true} />
    }

    return (
        <PageLayout headerProps={{ title: 'Prompt Details' }}>
            <Stack pt={2} px={2}>
                <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
                    <Stack>
                        <Typography variant='h3' fontSize='28px'>
                            {prompt.template_name}
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                            {formatDate(prompt.createdAt)}
                        </Typography>
                    </Stack>

                    {prompt && (
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
                    onClick={() => setDialogOpen(true)}
                />
            </Stack>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />
            </Stack>
            {mode === Mode.View ? (
                <DetailsPart prompt={prompt}/>
            ) : (
                <UpdateForm prompt={prompt} setMode={setMode} onUpdatePrompt={handleSaveUseCase} />
            )}

            <FullPageLoader loading={loading} />
            <ConfirmationDialog
                dialogType='Delete'
                open={dialogOpen}
                message='All the data related to this use case will be lost.'
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </PageLayout>
    )
}

export default PromptDetails
