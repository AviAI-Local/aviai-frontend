import { Box, Stack, Typography } from '@mui/material'
import type { OpenRate } from '../../types/dashboard'
import { PieChart } from '@mui/x-charts'

export interface OpenRatePieProps {
    rate: OpenRate
}
function OpenRatePie({ rate }: OpenRatePieProps) {
    const total = rate.pass + rate.fair + rate.poor
    return (
        <Stack
            gap={1}
            direction='column'
            height={350}
            width='30%'
            sx={{ borderRadius: 4, boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', p: 1 }}
        >
            <Typography variant='subtitle1' fontWeight='bold' textAlign='center'>
                Open Rates Distribution
            </Typography>
            {total === 0 ? (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body2' color='text.secondary'>
                        No data to display
                    </Typography>
                </Box>
            ) : (
                <PieChart
                    colors={['#FCADBD', '#E5C219', '#DCF2E5']}
                    series={[
                        {
                            arcLabel: (item) => `${Math.round((item.value / total) * 100)}%`,
                            arcLabelMinAngle: 35,
                            arcLabelRadius: '60%',
                            innerRadius: 30,
                            data: [
                                { value: rate.pass, label: 'Pass' },
                                { value: rate.fair, label: 'Fair' },
                                { value: rate.poor, label: 'Poor' }
                            ]
                        }
                    ]}
                    width={250}
                    height={250}
                />
            )}
        </Stack>
    )
}

export default OpenRatePie
