import { Box, Stack } from '@mui/material'
import { Form, Formik, type FormikHelpers, type FormikProps } from 'formik'
import TextFormInput from '../common/TextFormInput'
import Textarea from '../common/Textarea'
import type { RefObject } from 'react'
import * as Yup from 'yup'
import FormErrorMessage from '../common/FormErrorMessage'
import type { PromptFormValues } from '../../types/prompt'
import DropdownFormInput from '../common/DropdownFormInput'

const categoryOptions = [
    { label: 'Aviation', value: 'Aviation' },
    { label: 'Hospital', value: 'Hospital' }
]

type CreatePromptFormProps = {
    data: PromptFormValues | undefined
    handleSubmit: (values: PromptFormValues, formikHelpers: FormikHelpers<PromptFormValues>) => void
    formRef?: RefObject<FormikProps<PromptFormValues> | null>
}

function CreatePromptForm({ handleSubmit, formRef, data }: CreatePromptFormProps) {
    const validationSchema = Yup.object().shape({
        template_name: Yup.string().required('Field is required'),
        category: Yup.string().required('Field is required'),
        content: Yup.string().required('Field is required')
    })

    return (
        <Box>
            <Formik
                innerRef={formRef}
                initialValues={{
                    template_name: data?.template_name || '',
                    category: data?.category || 'aviation',
                    content: data?.content || ''
                }}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={true}
                validationSchema={validationSchema}
            >
                {({ handleChange, errors, touched }) => (
                    <Form style={{ width: '100%' }}>
                        <Stack sx={{ display: 'flex', gap: 1 }}>
                            <Box>
                                <TextFormInput
                                    label={'Name'}
                                    name='template_name'
                                    fullWidth
                                    size='small'
                                    placeholder='Enter template name'
                                    type='text'
                                    onChange={handleChange}
                                />
                                {touched.template_name && errors.template_name ? (
                                    <FormErrorMessage msg={errors.template_name} />
                                ) : null}
                            </Box>

                            <Box>
                                <DropdownFormInput
                                    label={'Category'}
                                    name='category'
                                    options={categoryOptions}
                                    fullWidth
                                />
                            </Box>

                            <Box>
                                <Textarea
                                    label={'Content'}
                                    name={'content'}
                                    onChange={handleChange}
                                />
                                {touched.content && errors.content ? (
                                    <FormErrorMessage msg={errors.content} />
                                ) : null}
                            </Box>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default CreatePromptForm
