import { TextField, InputAdornment, type TextFieldProps, Box, IconButton, FormControl } from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { Send } from '@mui/icons-material'

type MessageFormInputProps = TextFieldProps & {
  handleSubmit: (
    values: { message: string },
    formikHelpers: FormikHelpers<{ message: string }>
  ) => void | Promise<void>
}


function MessageFormInput({ handleSubmit, ...props }: MessageFormInputProps) {
    return (
        <Formik initialValues={{ message: '' }} onSubmit={handleSubmit}>
            {({ handleSubmit, handleChange, values }) => (
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%'
                        }}
                    >
                        <FormControl sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    // {...field}
                                    name='message'
                                    type='text'
                                    placeholder='Type your message here ...'
                                    onChange={handleChange}
                                    value={values.message || ''}
                                    sx={{
                                        width: '100%',
                                        '& .MuiInputBase-root': {
                                            height: 30,
                                            fontSize: 12,
                                            borderRadius: 50,
                                            paddingRight: 0,
                                            paddingX: 1,
                                            backgroundColor: '#F8F9FD',
                                            '& fieldset': {
                                                border: 'none'
                                            }
                                        },
                                        '& .MuiInputBase-input': {
                                            // paddingY: 0.5,
                                            paddingX: 1
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontSize: 12
                                        }
                                    }}
                                    size='small'
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        size='small'
                                                        type='submit'
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: 'transparent'
                                                            }
                                                        }}
                                                    >
                                                        <Send sx={{ width: 16, color: '#3D64FD' }} />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                    {...props}
                                />
                            </Box>
                        </FormControl>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default MessageFormInput
