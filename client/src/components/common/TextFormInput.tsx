import { type ReactNode } from 'react'
import { TextField, InputAdornment, type TextFieldProps, InputLabel, Box } from '@mui/material'
import { useField } from 'formik'

type TextFormInputProps = TextFieldProps & {
    startIcon?: ReactNode
    endIcon?: ReactNode
    label?: string
    name: string
}

function TextFormInput({ startIcon, endIcon, label, name, sx, ...props }: TextFormInputProps) {
    const [field] = useField(name)
    return (
        <Box sx={{ ...sx }}>
            <InputLabel htmlFor={name} sx={{ fontWeight: 'bold', color: '#29293A' }}>
                {label}
            </InputLabel>
            <TextField
                {...field}
                fullWidth
                sx={{
                    paddingY: 1,
                    '& input::placeholder': {
                        color: '#9FA7BE',
                        opacity: 1
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C0C8DB',
                        borderRadius: '12px',
                        borderWidth: '1px'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '1px'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: '1px'
                    }
                }}
                variant='outlined'
                slotProps={{
                    input: {
                        startAdornment: startIcon ? (
                            <InputAdornment position='start'>{startIcon}</InputAdornment>
                        ) : undefined,
                        endAdornment: endIcon ? <InputAdornment position='end'>{endIcon}</InputAdornment> : undefined
                    }
                }}
                {...props}
            />
        </Box>
    )
}

export default TextFormInput
