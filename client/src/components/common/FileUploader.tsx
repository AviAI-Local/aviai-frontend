import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { Box, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { extractDocument } from '../../api/usecase'
import { useState } from 'react'
import { useLoading } from '../../contexts/LoadingContext'
import type { UseCaseFormValues } from '../../types/usecase'
import OutlinedButton from './OutlinedButton'

type FileUploaderProps = {
    setData: React.Dispatch<React.SetStateAction<UseCaseFormValues | undefined>>
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

function FileUploader({ setData, setActiveStep }: FileUploaderProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const { loading, setLoading } = useLoading()

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/pdf': [],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
            'text/plain': [] // .txt
        },
        multiple: false,
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024, // 50MB
        onDrop: async (acceptedFiles) => {
            setLoading(true)
            const file = acceptedFiles[0]
            setUploadedFile(file)

            try {
                const res = await extractDocument(file)
                console.log(res)
                setData({
                    name: res.usecase_name,
                    personalCharacteristic: res.personal_characteristics,
                    scenario: res.scenario,
                    summary: res.usecase_summary,
                    attitude: res.attitude_in_interview,
                    characterName: res.character_name,
                    gender: res.gender,
                    industry: '',
                    interviewRule: ''
                })
                setActiveStep((prev) => prev + 1)
            } finally {
                setLoading(false)
            }
        }
    })
    return (
        <Box
            {...getRootProps()}
            sx={{
                width: '100%',
                maxWidth: '100%',
                backgroundColor: 'white',
                border: '1px dashed #9FA7BE',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
                overflowX: 'hidden',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingY: 5
            }}
        >
            <input {...getInputProps()} />
            {uploadedFile ? (
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: 18,
                        color: 'black'
                    }}
                >
                    Uploaded: {uploadedFile.name}
                </Typography>
            ) : (
                <>
                    <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: '#9FA7BE' }} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 400,
                                fontSize: 18,
                                color: 'black'
                            }}
                        >
                            Choose a file or drag & drop it here
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 400,
                                fontSize: 18,
                                color: '#9FA7BE'
                            }}
                        >
                            PDF, DOCX, and TXT format, up to 50MB
                        </Typography>
                    </Box>
                    <OutlinedButton title={'Browse File'} />
                </>
            )}
        </Box>
    )
}

export default FileUploader
