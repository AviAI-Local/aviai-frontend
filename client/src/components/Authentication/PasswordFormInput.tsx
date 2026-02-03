import { Box, IconButton } from '@mui/material'
import { useState, type ChangeEventHandler } from 'react'
import TextFormInput from '../common/TextFormInput'
import type { FormikErrors, FormikTouched } from 'formik'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import FormErrorMessage from '../common/FormErrorMessage'

export interface PasswordFormInputProps {
    handleChange: ChangeEventHandler
    errors: FormikErrors<{ password: string }>
    touched: FormikTouched<{ password: string }>
    size?: 'small' | 'medium'
}

function PasswordFormInput({ handleChange, errors, touched, size = 'medium' }: PasswordFormInputProps) {
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    return (
        <Box>
            <TextFormInput
                label='Password'
                variant='outlined'
                fullWidth
                size={size}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                name='password'
                sx={{
                    '& .MuiInputBase-input': {
                        paddingY: size === 'small' ? '12px' : '16px'
                    }
                }}
                endIcon={
                    <IconButton onClick={handleClickShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                }
            />
            {touched.password && errors.password ? <FormErrorMessage msg={errors.password} /> : null}
        </Box>
    )
}

export default PasswordFormInput
