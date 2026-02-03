import { useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ButtonIcon from '../common/ButtonIcon'
import { useUseCasesContext } from '../../contexts/UseCasesContext'

function SearchBar() {
    // TODO: Handle search query and results display 
    const [query, setQuery] = useState('')
    const { searchUseCase } = useUseCasesContext()

    const handleSearch = async () => {
        await searchUseCase(query)
        setQuery('')
    }

    

    return (
        <Box>
            <TextField
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            border: 'none'
                        },
                        '&:hover fieldset': {
                            border: 'none'
                        },
                        '&.Mui-focused fieldset': {
                            border: 'none'
                        }
                    },
                    width: '100%',
                    maxWidth: 350,
                    backgroundColor: 'white',
                    borderRadius: 3,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    border: 'none'
                }}
                size='small'
                placeholder='Search…'
                variant='outlined'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch()
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position='end'>
                                <ButtonIcon
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: 'primary.main'
                                        },
                                        '&:hover svg': {
                                            color: 'primary.main'
                                        },
                                        '& svg': {
                                            transition: 'color 0.2s ease'
                                        }
                                    }}
                                    icon={SearchIcon}
                                    selected={true}
                                    onClick={handleSearch}
                                />
                            </InputAdornment>
                        )
                    }
                }}
            />
        </Box>
    )
}

export default SearchBar
