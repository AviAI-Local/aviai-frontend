import { Box } from '@mui/material'
import { Formik, Form } from 'formik'
import PanelLayout from '../layout/PanelLayout'
import Textarea from '../common/Textarea'
import { useEffect } from 'react'

export interface NoteFormValues {
    aircraft: string
    date: string
    weather: string
    details: string
}

export interface NotePanelProps {
    noteValues: NoteFormValues
    setNoteValues: React.Dispatch<React.SetStateAction<NoteFormValues>>
}

function NotePanel({ noteValues, setNoteValues }: NotePanelProps) {
    return (
        <PanelLayout title='Note'>
            <Box
            padding={1}
            height='100%'
                sx={{
                    backgroundColor: '#F8F9FD',
                    '& label': {
                        fontSize: '0.875rem',

                        color: '#555'
                    }
                }}
            >
                <Formik enableReinitialize initialValues={noteValues} onSubmit={() => {}}>
                    {({ values }) => {
                        // Auto-save whenever values change
                        useEffect(() => {
                            setNoteValues(values)
                        }, [values])

                        return (
                            <Form>
                                <Textarea label='Aircraft make/model' name='aircraft' />
                                <Textarea label='Date' name='date' />
                                <Textarea label='Weather Conditions' name='weather' />
                                <Textarea label='Details of Observed events' name='details' />
                            </Form>
                        )
                    }}
                </Formik>
            </Box>
        </PanelLayout>
    )
}

export default NotePanel
