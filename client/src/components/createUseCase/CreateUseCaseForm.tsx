import { Box, Stack } from '@mui/material'
import { Form, Formik, type FormikHelpers, type FormikProps } from 'formik'
import TextFormInput from '../common/TextFormInput'
import Textarea from '../common/Textarea'
import type { RefObject } from 'react'
import type { UseCaseFormValues } from '../../types/usecase'
import * as Yup from 'yup'
import FormErrorMessage from '../common/FormErrorMessage'

type CreateUseCaseFormProps = {
    data: UseCaseFormValues | undefined
    handleSubmit: (values: UseCaseFormValues, formikHelpers: FormikHelpers<UseCaseFormValues>) => void
    formRef?: RefObject<FormikProps<UseCaseFormValues> | null>
}

function CreateUseCaseForm({ handleSubmit, formRef, data }: CreateUseCaseFormProps) {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Field is required'),
        personalCharacteristic: Yup.string().required('Field is required'),
        scenario: Yup.string().required('Field is required'),
        attitude: Yup.string().required('Field is required'),
    })

    return (
        <Box>
            <Formik
                innerRef={formRef}
                initialValues={{
                    name: data?.name || '',
                    personalCharacteristic: data?.personalCharacteristic || '',
                    scenario: data?.scenario || '',
                    attitude: data?.attitude || '',
                    interviewRule: data?.interviewRule || ''
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
                                    label={'Scenario Name'}
                                    name='name'
                                    fullWidth
                                    size='small'
                                    placeholder='Bird Strike Incident During Landing'
                                    type='text'
                                    onChange={handleChange}
                                />
                                {touched.name && errors.name ? <FormErrorMessage msg={errors.name} /> : null}
                            </Box>

                            <Box>
                                <Textarea
                                    label={'Personal Characteristics'}
                                    name={'personalCharacteristic'}
                                    onChange={handleChange}
                                />
                                {touched.personalCharacteristic && errors.personalCharacteristic ? (
                                    <FormErrorMessage msg={errors.personalCharacteristic} />
                                ) : null}
                            </Box>

                            <Box>
                                <Textarea label={'Scenario Context'} name={'scenario'} onChange={handleChange} />
                                {touched.scenario && errors.scenario ? (
                                    <FormErrorMessage msg={errors.scenario} />
                                ) : null}
                            </Box>

                            <Box>
                                <Textarea label={'Attitude'} name={'attitude'} onChange={handleChange} />
                                {touched.attitude && errors.attitude ? (
                                    <FormErrorMessage msg={errors.attitude} />
                                ) : null}
                            </Box>

                            <Box>
                                <Textarea label={'Rule In Interview'} name={'interviewRule'} onChange={handleChange} />
                                {touched.interviewRule && errors.interviewRule ? (
                                    <FormErrorMessage msg={errors.interviewRule} />
                                ) : null}
                            </Box>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default CreateUseCaseForm
