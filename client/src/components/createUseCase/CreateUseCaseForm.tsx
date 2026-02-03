import { Box, Stack } from '@mui/material'
import { Form, Formik, type FormikHelpers, type FormikProps } from 'formik'
import TextFormInput from '../common/TextFormInput'
import Textarea from '../common/Textarea'
import type { RefObject } from 'react'
import type { UseCaseFormValues } from '../../types/usecase'
import { capitalize } from '../../utils/format'
import * as Yup from 'yup'
import FormErrorMessage from '../common/FormErrorMessage'

type CreateFUseCaseFormProps = {
    data: UseCaseFormValues | undefined
    handleSubmit: (values: UseCaseFormValues, formikHelpers: FormikHelpers<UseCaseFormValues>) => void
    formRef?: RefObject<FormikProps<UseCaseFormValues> | null>
}

function CreateUseCaseForm({ handleSubmit, formRef, data }: CreateFUseCaseFormProps) {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Field is required'),
        characterName: Yup.string().required('Field is required'),
        gender: Yup.string().required('Field is required'),
        personalCharacteristic: Yup.string().required('Field is required'),
        scenario: Yup.string().required('Field is required'),
        attitude: Yup.string().required('Field is required'),
        industry: Yup.string().required('Field is required')
    })

    return (
        <Box>
            <Formik
                innerRef={formRef}
                initialValues={{
                    name: data?.name || '',
                    characterName: data?.characterName || '',
                    gender: data?.gender ? capitalize(data.gender) : '',
                    personalCharacteristic: data?.personalCharacteristic || '',
                    scenario: data?.scenario || '',
                    attitude: data?.attitude || '',
                    summary: data?.summary || '',
                    industry: data?.industry || '',
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
                                    label={'Use Case Name'}
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
                                <TextFormInput
                                    label={'Industry'}
                                    name='industry'
                                    fullWidth
                                    size='small'
                                    placeholder='Technology'
                                    type='text'
                                    onChange={handleChange}
                                />
                                {touched.industry && errors.industry ? (
                                    <FormErrorMessage msg={errors.industry} />
                                ) : null}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2
                                }}
                            >
                                <Box sx={{ flex: 2 }}>
                                    <TextFormInput
                                        label='Character Name'
                                        name='characterName'
                                        size='small'
                                        placeholder='Linh'
                                        type='text'
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    {touched.characterName && errors.characterName ? (
                                        <FormErrorMessage msg={errors.characterName} />
                                    ) : null}
                                </Box>

                                <Box>
                                    <TextFormInput
                                        label='Character Gender'
                                        name='gender'
                                        size='small'
                                        placeholder='Female'
                                        type='text'
                                        onChange={handleChange}
                                    />
                                    {touched.gender && errors.gender ? <FormErrorMessage msg={errors.gender} /> : null}
                                </Box>
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
                                <Textarea label={'Summary'} name={'summary'} onChange={handleChange} />
                                {touched.summary && errors.summary ? <FormErrorMessage msg={errors.summary} /> : null}
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
