import { Box, Typography, type ButtonProps } from "@mui/material"

type CustomButtonProps = {
  title: string;
} & ButtonProps;

function OutlinedButton({ title }: CustomButtonProps) {
    return (
        <Box sx={{
            width: 160,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 1,
            borderRadius: 3,
            cursor: 'pointer',
                            transition: 'all 0.2s ease',

                border: '1px solid #9FA7BE',
                '&:hover': {
                    backgroundColor: '#3D64FD',
                    border: 'none'
                },
                '&:hover .text': {
                    color: 'white'
                }
        }}>
            <Typography className="text" sx={{
                color: '#9FA7BE',
                fontWeight: 600,
                fontSize: 16,
            }}>
                {title}
            </Typography>
        </Box>
    )
}

export default OutlinedButton