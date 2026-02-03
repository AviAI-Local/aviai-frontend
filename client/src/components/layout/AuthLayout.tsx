import { Box } from '@mui/material'
import gradientLine from '../../assets/gradient_line.svg'
import { Outlet } from 'react-router-dom'
import loginIllustration from '../../assets/login_illustration.svg';

function AuthLayout() {
    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden',   background: '#F8F9FD'}}>
            <Box
                component="img"
                src={gradientLine}
                alt="background gradient"
                sx={{
                    position: 'absolute',
                    top: 150,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
               <Outlet />
               <Box sx={{ width: 0.5, alignContent:'center'}} >
                <img width='100%'  src={loginIllustration}  />
            </Box>
            </Box>
        </Box>
    )
}

export default AuthLayout
