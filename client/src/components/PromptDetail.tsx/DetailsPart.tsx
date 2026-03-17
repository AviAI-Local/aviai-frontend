import { Box, Stack, Typography } from '@mui/material'
import type { UseCaseData } from '../../types/usecase'
import modelFemaleImg from '../../assets/model_female.svg'
import { PromptTemplate } from '../../types/prompt'
import KeyValuePair from '../UseCaseDetails/KeyValuePair'

export interface DetailsPartProps {
    prompt: PromptTemplate
}

function DetailsPart({ prompt }: DetailsPartProps) {
    return (
        <Stack direction='row' spacing={5} pt={2} px={2}>
                <Stack direction='column' spacing={3}>
                    <Stack direction='row' spacing={20}>
                        <KeyValuePair label='Category' value={prompt.category} variant='chip' />
                    </Stack>

<Box>
            <Typography variant='caption' color='textSecondary' gutterBottom>
                Content
            </Typography>
                <Box
                    fontSize={'16px'}
                    fontWeight={400}
                    lineHeight='125%'
                    textAlign='justify'
                    sx={{ whiteSpace: 'pre-wrap' }}
                >
                    {prompt.content}
                </Box>
            
        </Box>
                </Stack>

        </Stack>
    )
}

export default DetailsPart
