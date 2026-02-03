import { Box } from '@mui/material'
import { useState } from 'react'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ButtonIcon from '../common/ButtonIcon'
import FilterBoard from './FilterBoard'
import { useUseCasesContext } from '../../contexts/UseCasesContext'

function FilterIcon() {
    const [filter, setFilter] = useState<string | null>(null)
    const options = ['Name', 'Date']
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
            <ButtonIcon
                selected={selected}
                setSelected={setSelected}
                // number={filter.length}
                icon={FilterAltOutlinedIcon}
            />
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
                    <FilterBoard options={options} filter={filter} setFilter={setFilter} />
                </Box>
            )}
        </Box>
    )
}

export default FilterIcon
