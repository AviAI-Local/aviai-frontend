import { Box, Stack, Typography } from '@mui/material'
import type { EmotionRegulation } from '../../types/dashboard'
import { PieChart } from '@mui/x-charts'

export interface EmotionPieProps {
    emotions: EmotionRegulation
}
function EmotionPie({ emotions }: EmotionPieProps) {
    const total = emotions.pass + emotions.fair + emotions.poor
    return (
        <Stack
            gap={1}
            direction='column'
            height={350}
            width='25%'
            sx={{ borderRadius: 4, boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', p: 1 }}
        >
            <Typography variant='subtitle1'  fontWeight='bold' textAlign='center'>
                Emotion Regulation Distribution
            </Typography>
            {total === 0 ? (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body2' color='text.secondary'>
                        No data to display
                    </Typography>
                </Box>
            ) : (
            <PieChart
                colors={['#33a02c', '#F25D5A', '#FDEA3D']}
                series={[
                    {
                        arcLabel: (item) => `${Math.round((item.value / total) * 100)}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '60%',
                        innerRadius: 30,
                        data: [
                            { value: emotions.pass, label: 'Pass' },
                            { value: emotions.fair, label: 'Fair' },
                            { value: emotions.poor, label: 'Poor' }
                        ]
                    }
                ]}
                width={200}
                height={200}
            />)}
        </Stack>
    )
}

export default EmotionPie
