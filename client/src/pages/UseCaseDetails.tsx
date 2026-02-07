import { Box, Divider, Stack, Typography } from '@mui/material'
import PageLayout from '../components/layout/PageLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useLoading } from '../contexts/LoadingContext'
import { useCallback, useEffect, useState } from 'react'
import type { UseCaseData } from '../types/usecase'
import { deleteUseCase, getUseCase } from '../api/usecase'
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

function UseCaseDetails() {
    const { id } = useParams()
    const { user } = useUserContext()
    const { loading, setLoading } = useLoading()
    const { handleUpdateUseCases } = useUseCasesContext()
    const [useCase, setCurrentUseCase] = useState<UseCaseData>()
    const { setSession, setUsecase } = useSession()
    const [mode, setMode] = useState<keyof typeof Mode>(Mode.View)
    const { setNotify } = useNotification()
    const [dialogOpen, setDialogOpen] = useState(false)
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        try {
            if (id) {
                setLoading(true)
                const data = await getUseCase(id)
                setCurrentUseCase(data)
            }
        } catch (error) {
            console.error('Failed to fetch use case:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleClickInterview = async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if (!id || !user?.id || !useCase) return

        const res = await createNewSession(id, user.id)

        setSession({
            id: res.session_id,
            conversionHistory: res.conversation_history,
            usecaseId: id
        })

        setUsecase(useCase)
        navigate(`/interview/${res.session_id}`)
    }

    const handleSaveUseCase = useCallback(() => {
        fetchData()
        setMode(Mode.View)
        setNotify({ message: 'Use case saved successfully', type: 'success', open: true })
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            const deletedUseCase = await deleteUseCase(id)
            if (!deletedUseCase) throw new Error('Use case not found')
            handleUpdateUseCases()
            navigate('/scenarios')
            setNotify({ message: 'Use case deleted successfully', type: 'success', open: true })
        } catch (err) {
            setNotify({ message: 'Failed to delete use case', type: 'error', open: true })
            console.error('Failed to delete use case', err)
        } finally {
            setDialogOpen(false)
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [id])

    if (!useCase) {
        return <FullPageLoader loading={true} />
    }

    return (
        <PageLayout headerProps={{ title: 'Use Case Details' }}>
            <Stack pt={2} px={2}>
                <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
                    <Stack>
                        <Typography variant='h3' fontSize='28px'>
                            {useCase?.name}
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                            {formatDate(useCase.createdAt)}
                        </Typography>
                    </Stack>
                    {useCase && (
                        <ActionSection
                            onClickInterview={handleClickInterview}
                            mode={mode}
                            setMode={setMode}
                            setDialogOpen={setDialogOpen}
                        />
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />
            </Stack>
            {mode === Mode.View ? (
                <DetailsSection useCase={useCase} />
            ) : (
                <EditForm useCase={useCase} setMode={setMode} onUpdateUseCase={handleSaveUseCase} />
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

export default UseCaseDetails
