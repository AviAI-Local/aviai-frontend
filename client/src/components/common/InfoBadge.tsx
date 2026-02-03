import { AccessTime, RadioButtonCheckedOutlined } from '@mui/icons-material'
import { Chip, type ChipProps } from '@mui/material'
import { lightBlue, red } from '@mui/material/colors'

interface InfoBadgeProps extends Omit<ChipProps, 'label' | 'icon'> {
    text: string
    isRecording?: boolean
    isTimer?: boolean
}

// For display information only, not status
function InfoBadge({ text, isRecording = false, isTimer = false, ...props }: InfoBadgeProps) {
    return (
        <Chip
            label={text}
            icon={
                isRecording ? (
                    <RadioButtonCheckedOutlined color='error' />
                ) : isTimer ? (
                    <AccessTime fontSize='small' />
                ) : undefined
            }
            sx={{ background: 'transparent', fontWeight: 'bold', border: '2px solid #EDA8E2' }}
            {...props}
        />
    )
}

export default InfoBadge
