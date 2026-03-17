import {
    Backdrop,
    Checkbox,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Session } from '../../types/session'
import { formatDate, formatTimeToHHMM } from '../../utils/format'
import { getSessionDuration } from '../../utils/interview'
import { PromptTemplate } from '../../types/prompt'

const tableColumns = ['NAME', 'CATEGORY', 'DATE', 'TIME']

export interface PromptTableProps {
    sessions: Session[]
    promptMap: PromptTemplate[]
}

export default function PromptTable({ sessions, promptMap }: PromptTableProps) {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const renderTableHeaders = useCallback(
        () => tableColumns.map((name, index) => <TableCell key={index} sx={{ color: '#9FA7BE', fontSize: '12px' }}>{name}</TableCell>),
        []
    )

    useEffect(() => {
        console.log(promptMap)
    }, [])

    return (
        <>
        <TableContainer>
            <Table>
                <TableHead sx={{ fontWeight: '500' }}>
                    <TableRow>
                        {renderTableHeaders()}
                    </TableRow>
                </TableHead>
                <TableBody sx={{ fontWeight: '400' }}>
                    {promptMap.map((prompt, index) => {
                        return (
                            <TableRow
                                key={index}
                                hover
                                sx={{
                                    height: 70,
                                    borderLeft: '3px solid transparent',
                                    borderRight: '3px solid transparent',
                                    '&:hover': {
                                        borderLeft: '3px solid #2962F6',
                                        backgroundColor: '#F5F8FF',
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={() => navigate(`/prompts/${prompt.id}`)}
                            >
                                <TableCell sx={{ fontSize: '16px' }}>{prompt.template_name}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{prompt.category}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {prompt.createdAt ? formatDate(prompt.createdAt) : '-'}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {prompt.createdAt ? formatTimeToHHMM(prompt.createdAt) : '-'}
                                </TableCell>

                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}
