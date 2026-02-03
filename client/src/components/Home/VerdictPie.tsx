import { Box, Stack, Typography } from '@mui/material'
import type { Verdict } from '../../types/dashboard'
import { PieChart } from '@mui/x-charts'

export interface VerdictPieProps {
    verdicts: Verdict
}
function VerdictPie({ verdicts }: VerdictPieProps) {
    const total = verdicts.pass + verdicts.fail + verdicts.borderline
    return (
        <Stack
            gap={1}
            direction='column'
            height={350}
            width='25%'
            sx={{ borderRadius: 4, boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', p: 1 }}
        >
            <Typography variant='subtitle1' fontWeight='bold' textAlign='center'>
                Interview Outcome Distribution
            </Typography>
            {total === 0 ? (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body2' color='text.secondary'>
                        No data to display
                    </Typography>
                </Box>
            ) : (
            <PieChart
                series={[
                    {
                        arcLabel: (item) => `${Math.round((item.value / total) * 100)}%`,
                        arcLabelMinAngle: 35,
                        arcLabelRadius: '60%',
                        data: [
                            { value: verdicts.pass, label: 'Pass' },
                            { value: verdicts.fail, label: 'Fail' },
                            { value: verdicts.borderline, label: 'Borderline' }
                        ]
                    }
                ]}
                width={250}
                height={250}
            />)}
        </Stack>
    )
}

export default VerdictPie
