import { Box } from '@mui/material'

function FormErrorMessage({ msg }: { msg: string }) {
    return (
        <Box sx={{ color: 'error.main', fontSize: '0.75rem' }}>
            {msg}
        </Box>
    )
}

export default FormErrorMessage
