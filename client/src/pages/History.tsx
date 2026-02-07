import { useEffect, useState } from 'react'
import HistoryTable from '../components/History/HistoryTable'
import PageLayout from '../components/layout/PageLayout'
import { getUserSessions } from '../api/session'
import { useUserContext } from '../contexts/UserContext'
import { useUseCasesContext } from '../contexts/UseCasesContext'
import type { Session } from '../types/session'
import { useLoading } from '../contexts/LoadingContext'
import FullPageLoader from '../components/common/FullPageLoader'

function History() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [usecaseMap, setUsecaseMap] = useState<Record<string, string>>({})
    const { useCases } = useUseCasesContext()
    const { user: { id = '' } = {} } = useUserContext()
    const { loading, setLoading } = useLoading()

   useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('Tab is visible, reloading...')
                window.location.reload()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const sessionData = await getUserSessions()
                // console.log(sessionData)

                const sortedSessions = sessionData.sort((a, b) => {
                    const dateA = new Date(a.createdAt ?? 0).getTime()
                    const dateB = new Date(b.createdAt ?? 0).getTime()
                    return dateB - dateA
                })

                const map: Record<string, string> = {}
                useCases.forEach((uc) => {
                    map[uc.id] = uc.name
                })

                setUsecaseMap(map)
                console.log(usecaseMap)
                setSessions(sortedSessions)
            } catch (err) {
                console.error('Error fetching history', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [useCases])

    return (
        <PageLayout headerProps={{ title: 'History', total: sessions.length, pageType: 'Histories' }}>
            <HistoryTable sessions={sessions} useCaseMap={usecaseMap} />
            {loading && <FullPageLoader loading={loading} />}
        </PageLayout>
    )
}

export default History
