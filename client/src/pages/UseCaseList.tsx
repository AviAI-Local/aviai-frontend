import { Box, Divider, Typography } from '@mui/material'
import PageLayout from '../components/layout/PageLayout'
import BoardLayout from '../components/layout/BoardLayout'
import FilterIcon from '../components/UseCase/FilterIcon'
import SortIcon from '../components/UseCase/SortIcon'
import UseCaseCard from '../components/UseCase/UseCaseCard'
import { useUseCasesContext } from '../contexts/UseCasesContext'
import { useUserContext } from '../contexts/UserContext'
import CreateUseCaseButton from '../components/createUseCase/CreateUseCaseButton'
import { useEffect } from 'react'

function UseCaseList() {
    const { useCases } = useUseCasesContext()
    const { user } = useUserContext()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    return (
        <PageLayout headerProps={{ title: 'Use Cases', pageType: 'Use Cases', total: useCases.length }} noScroll={true}>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                }}
                pt={2}
                px={2}
            >
                <Box display='flex' gap={2} alignItems='center'>
                    <Typography variant='h5'>{user.role == 'Student' ? 'Student' : 'Admin'} Board</Typography>
                    <Divider
                        orientation='vertical'
                        variant='middle'
                        sx={{
                            color: '#9FA7BE',
                            height: '1rem',
                            borderRightWidth: 1
                        }}
                    />

                    {user.role === 'Admin' && <CreateUseCaseButton />}
                    {/* <FilterIcon /> */}
                    <SortIcon />
                </Box>

                <BoardLayout>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            padding: 3
                        }}
                    >
                        {useCases && useCases.map((useCase) => <UseCaseCard key={useCase.id} data={useCase} />)}
                    </Box>
                </BoardLayout>
            </Box>
        </PageLayout>
    )
}

export default UseCaseList
