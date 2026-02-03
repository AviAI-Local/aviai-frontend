import { useCallback, useEffect, useState } from 'react'
import ScoreLineChart from '../components/Home/ScoreLineChart'
import PageLayout from '../components/layout/PageLayout'
import { type Verdict, type Evaluation, type EmotionRegulation, type OpenRate, type A3Score } from '../types/dashboard'
import { fetchStats } from '../api/home'
import { useUserContext } from '../contexts/UserContext'
import { useLoading } from '../contexts/LoadingContext'
import FullPageLoader from '../components/common/FullPageLoader'
import { Box } from '@mui/material'
import VerdictPie from '../components/Home/VerdictPie'
import EmotionPie from '../components/Home/EmotionPie'
import OpenRatePie from '../components/Home/OpenRatePie'
import ScoreDistributionChart from '../components/Home/ScoreDistributionChart'

function Home() {
    const { user } = useUserContext()
    const { loading, setLoading } = useLoading()
    if (!user) return
    const [scores, setScores] = useState<Evaluation[]>([])
    const [verdicts, setVerdicts] = useState<Verdict>({ pass: 0, fail: 0, borderline: 0 })
    const [emotionRegulations, setEmotionRegulations] = useState<EmotionRegulation>({ pass: 0, fair: 0, poor: 0 })
    const [openRates, setOpenRates] = useState<OpenRate>({ pass: 0, fair: 0, poor: 0 })
    const [a3Scores, setA3Scores] = useState<A3Score[]>([])

    const fetchScores = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchStats(user.id, 'all')
            if (response) {
                setScores(response.evaluations)
            }
        } catch (err) {
            console.error('Failed to fetch scores:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchVerdicts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchStats(user.id, 'verdict')
            if (response) {
                setVerdicts(response.verdict_statistics)
            }
        } catch (err) {
            console.error('Failed to fetch verdicts:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchEmotionRegulations = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchStats(user.id, 'emotion_regulation')
            if (response) {
                setEmotionRegulations(response.emotion_regulation_statistics)
            }
        } catch (err) {
            console.error('Failed to fetch emotion regulations:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchOpenRates = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchStats(user.id, 'open_rate')
            if (response) {
                setOpenRates(response.open_rate_statistics)
            }
        } catch (err) {
            console.error('Failed to fetch open rates:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchA3Scores = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchStats(user.id, 'a3_scores')
            if (response) {
                setA3Scores(response.a3_score_distribution)
            }
        } catch (err) {
            console.error('Failed to fetch A3 scores:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchScores()
        fetchVerdicts()
        fetchEmotionRegulations()
        fetchOpenRates()
        fetchA3Scores()
    }, [])

    return (
        <PageLayout headerProps={{ title: 'Dashboard' }}>
            <Box sx={{ p: 1 }}>
                <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-evenly'
                    alignItems='flex-end'
                    flexWrap='wrap'
                    paddingLeft={1}
                    marginBottom={2}
                >
                    <ScoreLineChart evaluations={scores} />
                    <VerdictPie verdicts={verdicts} />
                    <EmotionPie emotions={emotionRegulations} />
                </Box>
                <Box
                    display='flex'
                    flexDirection='row'
                    justifyContent='space-evenly'
                    alignItems='center'
                    flexWrap='wrap'
                    paddingLeft={1}
                >
                    <OpenRatePie rate={openRates} />
                    <ScoreDistributionChart distribution={a3Scores} />
                </Box>
            </Box>

            {loading && <FullPageLoader loading={loading} />}
        </PageLayout>
    )
}

export default Home
