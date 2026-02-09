import { Box, InputLabel, MenuItem, Select, type SelectProps } from '@mui/material'
import { useField } from 'formik'
import type { DropdownOption } from '../../types/common'

type DropdownFormInputProps = Omit<SelectProps, 'name'> & {
    name: string
    label: string
    options: DropdownOption[]
}

function DropdownFormInput({ name, label, options, sx, fullWidth, ...props }: DropdownFormInputProps) {
    const [field, meta, helpers] = useField(name)

    return (
        <Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
            <InputLabel htmlFor={name} sx={{ fontWeight: 'bold', color: '#29293A', mb: 1 }}>
                {label}
            </InputLabel>
            <Select
                {...field}
                {...props}
                id={name}
                fullWidth={fullWidth}
                value={field.value || ''}
                onChange={(e) => helpers.setValue(e.target.value)}
                sx={{
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
                    },
                    '& .MuiInputBase-input': {
                        paddingY: '12px'
                    }
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {meta.touched && meta.error ? (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{meta.error}</Box>
            ) : null}
        </Box>
    )
}

export default DropdownFormInput
