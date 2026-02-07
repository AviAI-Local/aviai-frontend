import {
    Checkbox,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useCallback, useState } from 'react'
import HistoryActionMenu from './HistoryActionMenu'
import type { Session } from '../../types/session'
import { formatDate, formatTimeToHHMM } from '../../utils/format'
import { getSessionDuration } from '../../utils/interview'

const tableColumns = ['USE CASE NAME', 'INTERVIEW ID', 'DATE', 'TIME', 'DURATION']

export interface HistoryTableProps {
    sessions: Session[]
    useCaseMap: Record<string, string>
}

export default function HistoryTable({ sessions, useCaseMap }: HistoryTableProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(event.currentTarget)
        setMenuRowIndex(index)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuRowIndex(null)
    }

    const renderTableHeaders = useCallback(
        () => tableColumns.map((name, index) => <TableCell key={index} sx={{ color: '#9FA7BE', fontSize: '12px' }}>{name}</TableCell>),
        []
    )

    return (
        <TableContainer>
            <Table>
                <TableHead sx={{ fontWeight: '500' }}>
                    <TableRow>
                        <TableCell padding='checkbox'>
                            <Checkbox />
                        </TableCell>
                        {renderTableHeaders()}
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody sx={{ fontWeight: '400' }}>
                    {sessions.map((session, index) => {
                        const recording = session.recording ?? null
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
                                        backgroundColor: '#F5F8FF'
                                    }
                                }}
                            >
                                <TableCell padding='checkbox'>
                                    <Checkbox />
                                </TableCell>
                                <TableCell sx={{ fontSize: '16px' }}>{session.scenarioName}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{session.id}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {session.createdAt ? formatDate(session.createdAt) : '-'}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    {session.createdAt ? formatTimeToHHMM(session.createdAt) : '-'}
                                </TableCell>

                                <TableCell sx={{ color: 'text.secondary' }}>{getSessionDuration(session)}</TableCell>
                                <TableCell align='right'>
                                    {!session.conversationHistory ? (
                                        <CircularProgress size={20} />
                                    ) : session.conversationHistory.content.length > 0 ? (
                                        <>
                                            <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            {menuRowIndex === index && (
                                                <HistoryActionMenu
                                                    anchorEl={anchorEl}
                                                    handleMenuClose={handleMenuClose}
                                                    conversationHistoryId={session.conversationHistory.id}
                                                    recording={recording}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
