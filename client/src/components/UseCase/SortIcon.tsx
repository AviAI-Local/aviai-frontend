import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import ButtonIcon from '../common/ButtonIcon'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import SortBoard from './SortBoard'

function SortIcon() {
    const [filter, setFilter] = useState<string | null>(null)
    const options = ['Created Date', 'Name']
    const [selected, setSelected] = useState(false)

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                position: 'relative'
            }}
        >
            <ButtonIcon selected={selected} setSelected={setSelected} icon={SwapVertIcon} />
            {selected && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '120%',
                        left: 0,
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
                    <SortBoard options={options} choice={filter} setChoice={setFilter} />
                </Box>
            )}
        </Box>
    )
}

export default SortIcon
