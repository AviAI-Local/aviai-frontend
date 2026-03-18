import { Box } from '@mui/material'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import TextFormInput from '../common/TextFormInput'
import DropdownFormInput from '../common/DropdownFormInput'
import ActionButton from '../common/ActionButton'
import { useUserContext } from '../../contexts/UserContext'
import { updateAccountFields } from '../../api/auth'
import { majorOptions } from '../../constants/texts'
import { useState } from 'react'
import { useApiNotification } from '../../contexts/ApiNotificationContext'

interface ProfileFormData {
    firstName: string
    lastName: string
    email: string
    role: string
    major: string
}

interface ProfileFormProps {
    initialData: ProfileFormData
    onSave: () => void
    onCancel: () => void
}


const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    major: Yup.string().required('Major is required')
})

function ProfileForm({ initialData, onSave, onCancel }: ProfileFormProps) {
    const { user, refetchUser } = useUserContext()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addNotification } = useApiNotification()

    const handleSubmit = async (values: ProfileFormData) => {
        if (!user) return

        setIsSubmitting(true)
        try {
            await updateAccountFields(user.id, {
                user_name: `${values.firstName} ${values.lastName}`.trim(),
                major: values.major
            })
            addNotification('Save Profile', 200)
            await refetchUser()
            onSave()
        } catch (error: any) {
            addNotification('Save Profile', error?.response?.status ?? 500)
            console.error('Failed to update profile:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Row 1: First Name and Last Name */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <TextFormInput
                                    name="firstName"
                                    label="First Name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    size='small'
                                    sx={{
                                            '& .MuiInputBase-input': {
                                                paddingY: '12px'
                                            }
                                        }}
                                    onBlur={handleBlur}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextFormInput
                                    name="lastName"
                                    label="Last Name"
                                    size='small'
                                    sx={{
                                            '& .MuiInputBase-input': {
                                                paddingY: '12px'
                                            }
                                        }}
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                />
                            </Box>
                        </Box>

                        {/* Row 2: Email, Role, and Major */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 2.1 }}>
                                <TextFormInput
                                    name="email"
                                    label="Email"
                                    value={values.email}
                                    disabled
                                    size='small'
                                    sx={{
                                            '& .MuiInputBase-input': {
                                                paddingY: '12px'
                                            }
                                        }}
                                    helperText="Email cannot be changed"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextFormInput
                                    name="role"
                                    label="Role"
                                    size='small'
                                    sx={{
                                            '& .MuiInputBase-input': {
                                                paddingY: '12px'
                                            }
                                        }}
                                    value={values.role}
                                    disabled
                                    helperText="Role cannot be changed"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <DropdownFormInput
                                    fullWidth
                                    name="major"
                                    label="Major"
                                    options={majorOptions}
                                />
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <ActionButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                actionType="primary"
                            >
                                Save Changes
                            </ActionButton>
                            <ActionButton
                                type="button"
                                variant="outlined"
                                actionType="secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </ActionButton>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    )
}

export default ProfileForm
