import { Box, IconButton } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

function PreviousNextButton() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #9FA7BE',
                borderRadius: 2,
                overflow: 'hidden',
                height: 23,
                width: 'fit-content',
                backgroundColor: 'white'
            }}
        >
            <IconButton
                size='small'
                sx={{
                    borderRadius: 0,
                    width: 23,
                    height: 23,
                    '&:hover': {
                        backgroundColor: '#3D64FD'
                    },
                    '&:hover svg': {
                        color: 'white'
                    }
                }}
            >
                <KeyboardArrowLeftIcon sx={{ color: '#AFB8CF'}}/>
            </IconButton>

            <Box
                sx={{
                    width: '1px',
                    height: 23,
                    backgroundColor: '#9FA7BE'
                }}
            />

            <IconButton
                size='small'
                sx={{
                    borderRadius: 0,
                    width: 23,
                    height: 23,
                    '&:hover': {
                        backgroundColor: '#3D64FD'
                    },
                    '&:hover svg': {
                        color: 'white'
                    }
                }}
            >
                <KeyboardArrowRightIcon sx={{ color: '#AFB8CF'}}/>
            </IconButton>
        </Box>
    )
}

export default PreviousNextButton
