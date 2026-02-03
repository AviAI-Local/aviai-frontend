import { Box, Typography } from '@mui/material'
import { formatDate, formatTimeToHHMM } from '../../utils/format'
import type { UseCaseData } from '../../types/usecase'

function InterviewHeader({ data }: {data: UseCaseData}) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                cursor: 'pointer',
                paddingY: 1,
                height: 80
            }}
        >
            <Box
                sx={{
                    dislay: 'flex',
                    flexDirection: 'column', 
                    paddingX: 3
                }}
            >
                <Typography variant='h5'>{data.name}</Typography>

                <Typography
                    sx={{
                        color: '#9FA7BE',
                        fontWeight: 500,
                        fontSize: 16
                    }}
                >
                    {formatDate(data.createdAt)} | {formatTimeToHHMM(data.createdAt)}
                </Typography>
            </Box>
        </Box>
    )
}

export default InterviewHeader
