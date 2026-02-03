import { Box, Chip, Typography } from '@mui/material'
import { getColorForChip } from '../../utils/format'
export interface KeyValuePairProps {
    label: string
    value: string
    variant: 'primary' | 'normal' | 'chip'
}
function KeyValuePair({ label, value, variant }: KeyValuePairProps) {
    return (
        <Box>
            <Typography variant='caption' color='textSecondary' gutterBottom>
                {label}
            </Typography>
            {variant === 'chip' ? (
                <Box>
                    <Chip
                        label={value}
                        size='small'
                        sx={{ ...getColorForChip(value), marginRight: 1, width: 'fit-content', paddingX: 0.5 }}
                    />
                </Box>
            ) : (
                <Box
                    fontSize={variant === 'primary' ? '18px' : '16px'}
                    fontWeight={variant === 'primary' ? 500 : 400}
                    lineHeight='125%'
                    textAlign='justify'
                >
                    {value}
                </Box>
            )}
        </Box>
    )
}

export default KeyValuePair
