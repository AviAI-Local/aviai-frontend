import { Box } from '@mui/material'
import type { FormikErrors, FormikTouched } from 'formik'
import TextFormInput from '../common/TextFormInput'
import type { ChangeEventHandler } from 'react'
import FormErrorMessage from '../common/FormErrorMessage'

export interface EmailFormInputProps {
    handleChange: ChangeEventHandler
    errors: FormikErrors<{ email: string }>
    touched: FormikTouched<{ email: string }>
    size?: 'small' | 'medium'
}

function EmailFormInput({ handleChange, errors, touched, size = 'medium' }: EmailFormInputProps) {
    return (
        <Box>
            <TextFormInput
                label='Email'
                type='text'
                name='email'
                fullWidth
                size={size}
                placeholder='s12345678@rmit.edu.vn'
                onChange={handleChange}
                sx={{
                    '& .MuiInputBase-input': {
                        paddingY: size === 'small' ? '12px' : '16px'
                    }
                }}
            />
            {touched.email && errors.email ? <FormErrorMessage msg={errors.email} /> : null}
        </Box>
    )
}

export default EmailFormInput
