import { Box, Chip, Divider, IconButton, Typography } from '@mui/material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { useEffect, useState } from 'react'
import EditMenu from './EditMenu'
import { Role } from '../../types/common'
import { capitalize, formatDate, getColorForChip } from '../../utils/format'
import type { UseCaseData } from '../../types/usecase'
import { useNavigate } from 'react-router-dom'
import { createNewSession } from '../../api/session'
import { useSession } from '../../contexts/SessionContext'
import CTAButton from '../common/CTAButton'
import { useUserContext } from '../../contexts/UserContext'
import { useApiNotification } from '../../contexts/ApiNotificationContext'

type UseCaseCardProps = {
    data: UseCaseData
}

function UseCaseCard({ data }: UseCaseCardProps) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { addNotification } = useApiNotification()
    const { setSession, setUsecase } = useSession()
    const { user } = useUserContext()

    if (!user) {
        throw new Error('User is not authenticated')
    }

    const onClick = async (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setLoading(true)
        try {
            const res = await createNewSession(data.id, user.id)
            addNotification('Create Session', 200)
            setSession({
                id: res.session_id,
                conversationHistory: res.conversation_history,
                scenarioId: data.id,
                scenarioName: res.scenario_name
            })
            navigate(`/interview/${res.session_id}`)
            setUsecase(data)
        } catch (err: any) {
            addNotification('Create Session', err?.response?.status ?? 500)
        } finally {
            setLoading(false)
        }
    }

    const handleOpen = () => {
        window.open(`http://localhost:3000/scenarios/${data.id}`, '_blank', 'noopener,noreferrer')
        setOpen(false)
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`http://localhost:3000/scenarios/${data.id}`)
    }

    useEffect(() => {
        const handleClick = () => {
            setOpen(false)
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [])

    useEffect(() => {
        console.log("card: ", data)
    })

    return (
        <Box
            onClick={() => {
                if (user.role === 'Admin') {
                    navigate(`/scenarios/${data.id}`)
                }
            }}
            sx={{
                backgroundColor: 'white',
                width: 200,
                borderRadius: 3,
                paddingY: 2,
                paddingX: 2,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                gap: 1,
                cursor: 'pointer'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#9FA7BE'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center'
                    }}
                >
                    <AccessTimeOutlinedIcon sx={{ width: 18 }} />
                    <Typography
                        sx={{
                            fontWeight: 500,
                            fontSize: 12
                        }}
                    >
                        {formatDate(data.createdAt)}
                    </Typography>
                </Box>

                {user.role == 'Admin' && (
                    <Box sx={{ position: 'relative' }}>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation() // Prevents triggering Box's onClick
                                setOpen(!open)
                            }}
                        >
                            <MoreHorizOutlinedIcon
                                sx={{
                                    color: open ? '#3D64FD' : '#C0C8DB',
                                    '&:hover': {
                                        color: '#3D64FD'
                                    }
                                }}
                            />
                        </IconButton>

                        {open && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '70%',
                                    left: 40,
                                    zIndex: 10,
                                    animation: 'fadeInUp 0.3s ease-out',
                                    '@keyframes fadeInUp': {
                                        from: {
                                            opacity: 0,
                                            transform: 'translateY(10px)'
                                        },
                                        to: {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    }
                                }}
                            >
                                <EditMenu role={Role.Admin} handleOpen={handleOpen} handleCopyLink={handleCopyLink} />
                            </Box>
                        )}
                    </Box>
                )}
            </Box>

            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: 20,
                    height: 60,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {data.name}
            </Typography>

            {/* <Typography
                sx={{
                    fontWeight: 400,
                    fontSize: 16
                }}
            >
                {data.characterName}, {capitalize(data.gender)}
            </Typography> */}

            <Typography
                sx={{
                    fontWeight: 400,
                    fontSize: 10,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                { data.scenario }
            </Typography>

            <Divider />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1
                    }}
                >
                    <Chip
                        label={data.category}
                        sx={{
                            ...getColorForChip(data.category),
                            width: 'fit-content',
                            paddingX: 0.5
                        }}
                    />
                </Box>

                <CTAButton title={'Take An Interview'} onClick={onClick} loading={loading} />
            </Box>
        </Box>
    )
}

export default UseCaseCard
