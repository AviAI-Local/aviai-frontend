import { Stack } from '@mui/material'
import KeyValuePair from './KeyValuePair'
import type { UseCaseData } from '../../types/usecase'
import modelFemaleImg from '../../assets/model_female.svg'

export interface DetailsSectionProps {
    useCase: UseCaseData
}

function DetailsSection({ useCase }: DetailsSectionProps) {
    return (
        <Stack direction='row' spacing={5} pt={2} px={2}>
            <Stack direction='column' spacing={4} width='60%'>
                <Stack direction='column' spacing={3}>
                    <Stack direction='row' spacing={20}>
                        <KeyValuePair label='Category' value={useCase.category} variant='chip' />
                    </Stack>

                    <KeyValuePair
                        label='Personal Characteristics'
                        value={useCase.personalCharacteristic}
                        variant='normal'
                    />
                    <KeyValuePair
                        label='Scenario Context'
                        value={useCase.scenario && useCase.scenario.length > 0 ? useCase.scenario : '-'}
                        variant='normal'
                    />
                    <KeyValuePair label='Attitude' value={useCase.attitude.length > 0 ? useCase.attitude : '-'} variant='normal' />
                </Stack>
            </Stack>

            <img src={modelFemaleImg} height='90%' style={{ maxWidth: '400px', minWidth: '350px' }} />
        </Stack>
    )
}

export default DetailsSection
