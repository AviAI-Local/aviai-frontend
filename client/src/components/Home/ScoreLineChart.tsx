import { LineChart } from '@mui/x-charts/LineChart'
import type { LineItemIdentifier } from '@mui/x-charts/models'
import { useMemo, useState } from 'react'
import type { Evaluation } from '../../types/dashboard'
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    Stack,
    Typography,
    Dialog,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { evaluationCriteria } from '../../constants/texts'
import ActionButton from '../common/ActionButton'
import { getPerformanceAnalysis } from '../../api/session'
import { downloadBase64PDF } from '../../utils/interview'
import { useUserContext } from '../../contexts/UserContext'

export interface ScoreLineChartProps {
    evaluations: Evaluation[]
}

function ScoreLineChart({ evaluations }: ScoreLineChartProps) {
    const { user } = useUserContext()
    if (!user) return 
    const [range, setRange] = useState<number | string>(5)
    const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null)

    const handleDownloadPerformanceAnalysis = async () => {
        if (!selectedEval) return
        try {
            const { pdf_base64, filename } = await getPerformanceAnalysis(selectedEval.conversation_id, user.id )
            downloadBase64PDF(pdf_base64, filename)
        } catch (err) {
            console.error('Failed to download performance analysis:', err)
        }
    }

    const filteredEvaluations = useMemo(() => {
        if (range === 'all') {
            return evaluations
        } else {
            const cutoff = new Date()
            cutoff.setDate(cutoff.getDate() - Number(range))
            return evaluations.filter((ev) => new Date(ev.created_at) >= cutoff)
        }
    }, [evaluations, range])

    const labels = filteredEvaluations.map((ev) => {
        const date = new Date(ev.created_at)
        return date.toISOString().split('T')[0]
    })

    const values = filteredEvaluations.map((ev) => ev.total_score)

    return (
        <Stack
            gap={1}
            direction='column'
            width='40%'
            height={350}
            sx={{ borderRadius: 4, boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', p: 1 }}
        >
            <Typography variant='subtitle1' fontWeight='bold' textAlign='center'>
                Total evaluation scores over time
            </Typography>
            {evaluations.length === 0 ? (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body2' color='text.secondary'>
                        No data to display
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box display='flex' flexDirection='row' justifyContent='flex-end'>
                        <FormControl size='small' sx={{ mb: 1, width: 'fit-content' }}>
                            <Select
                                value={range}
                                label=''
                                onChange={(e) => setRange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                sx={{ borderRadius: '8px', height: '36px', fontSize: '14px' }}
                            >
                                <MenuItem value={5}>5 days</MenuItem>
                                <MenuItem value={10}>10 days</MenuItem>
                                <MenuItem value={30}>30 days</MenuItem>
                                <MenuItem value='all'>All time</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <LineChart
                        xAxis={[{ scaleType: 'band', data: labels }]}
                        onMarkClick={(_, d: LineItemIdentifier | null) => {
                            if (d?.dataIndex != null) {
                                setSelectedEval(filteredEvaluations[d.dataIndex])
                            }
                        }}
                        series={[
                            {
                                data: values,
                                label: 'Total Score'
                            }
                        ]}
                        height={250}
                    />
                </>
            )}

            <Dialog
                open={!!selectedEval}
                onClose={() => setSelectedEval(null)}
                maxWidth='sm'
                fullWidth
                sx={{
                    '& .MuiDialog-paper': { borderRadius: 4, padding: 2 }
                }}
            >
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h6' fontWeight='bold'>
                        Evaluation Details
                    </Typography>
                    <Close onClick={() => setSelectedEval(null)} sx={{ cursor: 'pointer' }} />
                </Box>

                <DialogContent>
                    {selectedEval && (
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Criteria</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align='right'>
                                        Score
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(selectedEval)
                                    .filter(([key]) => key.endsWith('_score') && !key.startsWith('total'))
                                    .map(([key, value]) => {
                                        const code = key.replace('_score', '')
                                        const label = evaluationCriteria.find((c) => c.code === code)?.label || code

                                        return (
                                            <TableRow
                                                key={key}
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: '#DCE6FF'
                                                    }
                                                }}
                                            >
                                                <TableCell>{label}</TableCell>
                                                <TableCell align='right'>{value as number}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                <TableRow sx={{ backgroundColor: '#DCE6FF' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                    <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                                        {selectedEval.total_score}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    )}
                    <Box sx={{ marginTop: 2 }} textAlign='center'>
                        <ActionButton actionType='primary' onClick={handleDownloadPerformanceAnalysis}>
                            Download performance analysis
                        </ActionButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Stack>
    )
}

export default ScoreLineChart
