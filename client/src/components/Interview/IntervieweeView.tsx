import { Box, Chip, Container } from '@mui/material'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Model } from '../model/Avatar'
import { formatTime } from '../../utils/format'
import { useMeetingContext } from '../../contexts/MeetingContext'
import { RadioButtonCheckedOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { fetchBackground } from '../../api/background'
import type { UnsplashPhoto } from '../../types/meeting'
import defaultBackground from '../../assets/meeting-placeholder.jpg'

function IntervieweeView() {
    const { elapsedTime, isRecord } = useMeetingContext()
    const [background, setBackground] = useState<UnsplashPhoto | null>(null)
    useEffect(() => {
        const loadBackground = async () => {
            try {
                const photo = await fetchBackground()
                setBackground(photo)
            } catch (error) {
                console.error('Error fetching background: ', error)
            }
        }
        loadBackground()
    }, [])

    return (
        <Container maxWidth='xl'>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '75vh',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '3px solid #C0C8DB'
                }}
            >
                <img
                    src={background ? background.urls.regular : defaultBackground}
                    alt={background ? background.alth_description : 'background'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: 0.7
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                    }}
                >
                    <Chip
                        label={formatTime(elapsedTime)}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: '#FFFFFF80',
                            '& .MuiChip-icon': {
                                color: '#F25D5A'
                            }
                        }}
                        icon={isRecord ? <RadioButtonCheckedOutlined /> : undefined}
                    />

                    <Chip
                        label={'Avi Bot'}
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: 10,
                            backgroundColor: '#FFFFFF80',
                            width: 100,
                            zIndex: 1
                        }}
                    />

                    <Canvas camera={{ position: [0, 2, 5], fov: 5 }}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[3, 5, 2]} />
                        <Model />
                        <OrbitControls enableZoom={false} enablePan={false} target={[0, 1.5, 0]} />
                    </Canvas>
                </Box>
            </Box>
        </Container>
    )
}

export default IntervieweeView
