import { Box, InputLabel, styled, TextareaAutosize } from '@mui/material'
import { useField } from 'formik'

type TextareaProps = {
    label: string
    name: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const StyledTextarea = styled(TextareaAutosize)({
    width: '100%',
    fontFamily: 'inherit',
    fontSize: '1rem',
    borderRadius: 8,
    border: '1px solid #C0C8DB',
    padding: '8px 12px',
    resize: 'vertical',
    boxSizing: 'border-box',
    '&::placeholder': {
        color: '#9FA7BE',
        opacity: 1
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#C0C8DB',
        borderRadius: '12px',
        borderWidth: '1px'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: '1px'
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: '1px'
    }
})

function Textarea({ label, name, ...props }: TextareaProps) {
    const [field] = useField(name)

    return (
        <Box>
            <InputLabel htmlFor={name} sx={{ fontWeight: 'bold', color: '#29293A', mb: 1 }}>
                {label}
            </InputLabel>

            <StyledTextarea id={name} {...field} {...props} name={name} minRows={5} maxRows={10}/>
        </Box>
    )
}

export default Textarea
