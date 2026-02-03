import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { Form, Formik, type FormikValues } from 'formik'
import { login } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Logo from '../Icons/Logo'
import { useLoading } from '../../contexts/LoadingContext'
import FullPageLoader from '../common/FullPageLoader'
import { useUserContext } from '../../contexts/UserContext'
import EmailFormInput from './EmailFormInput'
import PasswordFormInput from './PasswordFormInput'

function LoginForm({ onSwitchMode }: { onSwitchMode?: () => void }) {
    const { refetchUser } = useUserContext()

    const { loading, setLoading } = useLoading()
    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Field is required')
            .email('Enter valid email')
            .matches(/^[\w.%+-]+@rmit\.edu\.vn$/, 'Enter your student email'),
        password: Yup.string().required('Field is required')
    })

    const handleSubmit = async (values: FormikValues, props: any) => {
        const { setSubmitting, setErrors } = props
        setLoading(true)
        try {
            await login(values.email, values.password)
            await refetchUser()
            navigate('/usecases')
        } catch (error: any) {
            if (error.response?.status === 400 || error.response?.status === 401) {
                const message = error.response.data.detail
                if (message.includes('email')) {
                    setErrors({ email: message })
                } else if (message.includes('password') || message.includes('Incorrect')) {
                    setErrors({ password: message })
                }
            } else {
                console.error('Failed to log in:', error)
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
                paddingY: 4,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Stack spacing={5}>
                <Stack spacing={4}>
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
                            Login
                        </Typography>
                        <Typography variant='body1' align='center' color='text.secondary'>
                            Today is a new day. It's your day. You shape it. Sign in to start interview with an AI bot.
                        </Typography>
                    </Stack>
                </Stack>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ handleChange, errors, touched }) => (
                        <Form style={{ width: '100%' }}>
                            <Stack spacing={2}>
                                <EmailFormInput handleChange={handleChange} errors={errors} touched={touched} />
                                <PasswordFormInput handleChange={handleChange} errors={errors} touched={touched} />

                                {/* <Link href='#' underline='none' textAlign='end' sx={{ fontSize: '14px' }}>
                                    Forgot password?
                                </Link> */}
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
                                    Sign in
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
                <Typography variant='body2' align='center' color='text.primary'>
                    Don't you have an account?{' '}
                    <Link sx={{ cursor: 'pointer' }} underline='none' onClick={onSwitchMode}>
                        Sign up
                    </Link>
                </Typography>
            </Stack>
            <FullPageLoader loading={loading} />
        </Box>
    )
}

export default LoginForm
