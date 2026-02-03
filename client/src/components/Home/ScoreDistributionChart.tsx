import { Box, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import type { A3Score } from '../../types/dashboard'

export interface ScoreDistributionChartProps {
    distribution: A3Score[]
}

function ScoreDistributionChart({ distribution }: ScoreDistributionChartProps) {
    const scores = distribution.map((d) => d.score)
    const frequencies = distribution.map((d) => d.frequency)

    return (
        <Stack
            gap={1}
            direction='column'
            height={350}
            width='60%'
            sx={{ borderRadius: 4, boxShadow: '0px 8px 12px rgba(0,0,0,0.1)', p: 2 }}
        >
            <Typography variant='subtitle1' fontWeight='bold' textAlign='center'>
                Completion rate of Cognitive Interview Phase
            </Typography>
            {distribution.length === 0 ? (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body2' color='text.secondary'>
                        No data to display
                    </Typography>
                </Box>
            ) : (
                <BarChart
                    xAxis={[
                        {
                            data: scores,
                            label: 'Score',
                            scaleType: 'band'
                        }
                    ]}
                    series={[
                        {
                            data: frequencies,
                            label: 'Number of interview sessions'
                        }
                    ]}
                    height={300}
                />
            )}
        </Stack>
    )
}

export default ScoreDistributionChart
