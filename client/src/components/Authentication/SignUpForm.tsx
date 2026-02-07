import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { Form, Formik, type FormikValues } from 'formik'
import { signup } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Logo from '../Icons/Logo'
import { useLoading } from '../../contexts/LoadingContext'
import FullPageLoader from '../common/FullPageLoader'
import { useUserContext } from '../../contexts/UserContext'
import EmailFormInput from './EmailFormInput'
import PasswordFormInput from './PasswordFormInput'
import TextFormInput from '../common/TextFormInput'
import DropdownFormInput from '../common/DropdownFormInput'
import { majorOptions } from '../../constants/texts'
import FormErrorMessage from '../common/FormErrorMessage'

function SignUpForm({ onSwitchMode }: { onSwitchMode?: () => void }) {
    const { refetchUser } = useUserContext()
    const { loading, setLoading } = useLoading()
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Field is required')
            .email('Enter valid email')
            .matches(/^[\w.%+-]+@rmit\.edu\.vn$/, 'Enter your student email'),
        password: Yup.string().required('Field is required').min(6, 'Password must be at least 6 characters long'),
        name: Yup.string().required('Field is required').max(50, 'Name must be at most 50 characters long'),
        major: Yup.string().required('Field is required')
    })

    const handleSubmit = async (values: FormikValues, props: any) => {
        const { setSubmitting, setErrors } = props
        setLoading(true)
        try {
            await signup(values.email, values.password, values.name, values.major)
            await refetchUser()
            navigate('/scenarios')
        } catch (error: any) {
            if (error.response?.status === 400) {
                const message = error.response.data.detail
                if (message.includes('email') || message.toLowerCase().includes('account')) {
                    setErrors({ email: message })
                } else if (message.includes('password')) {
                    setErrors({ password: message })
                }
            } else {
                console.error('Failed to sign up:', error)
            }
        } finally {
            setSubmitting(false)
            setLoading(false)
        }
    }

    return (
        <Box
            borderRadius={8}
            sx={{
                backgroundColor: 'white',
                width: '25%',
                margin: 'auto',
                paddingX: 5,
                paddingY: 2,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                height: '95%'
            }}
        >
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <Box
                        display='flex'
                        justifyContent='center'
                        sx={{
                            height: 'auto',
                            '& svg:nth-of-type(1)': {
                                width: '3.5rem',
                                height: 'auto'
                            },
                            '& svg:nth-of-type(2)': {
                                width: '2rem',
                                height: 'auto'
                            }
                        }}
                    >
                        <Logo />
                    </Box>
                    <Stack>
                        <Typography variant='h4' fontWeight='bold' align='center' gutterBottom>
                            Sign Up
                        </Typography>
                        <Typography variant='body1' align='center' color='text.secondary'>
                            Already have an account?{' '}
                            <Link sx={{ cursor: 'pointer' }} underline='none' onClick={onSwitchMode}>
                                Login
                            </Link>
                        </Typography>
                    </Stack>
                </Stack>

                <Formik
                    initialValues={{ email: '', password: '', name: '', major: '' }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ handleChange, errors, touched }) => (
                        <Form style={{ width: '100%' }}>
                            <Stack spacing={2}>
                                <EmailFormInput
                                    handleChange={handleChange}
                                    errors={errors}
                                    touched={touched}
                                    size='small'
                                />
                                <PasswordFormInput
                                    handleChange={handleChange}
                                    errors={errors}
                                    touched={touched}
                                    size='small'
                                />
                                <Box>
                                    <TextFormInput
                                        label='Name'
                                        variant='outlined'
                                        fullWidth
                                        size='small'
                                        onChange={handleChange}
                                        type='text'
                                        name='name'
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                paddingY: '12px'
                                            }
                                        }}
                                    />
                                    {touched.name && errors.name ? <FormErrorMessage msg={errors.name} /> : null}
                                </Box>
                                <Box>
                                    <DropdownFormInput
                                        options={majorOptions}
                                        name='major'
                                        label='Major'
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                minWidth: '100px'
                                            }
                                        }}
                                    />
                                </Box>

                                <Button
                                    fullWidth
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: 'primary.main',
                                        borderRadius: 3,
                                        textTransform: 'none'
                                    }}
                                    variant='contained'
                                    size='large'
                                    type='submit'
                                >
                                    Sign up
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Stack>
            <FullPageLoader loading={loading} />
        </Box>
    )
}

export default SignUpForm
