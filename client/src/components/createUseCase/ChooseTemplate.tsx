import { Box, InputLabel, MenuItem, Select } from '@mui/material'
import { useEffect, useState } from 'react'
import { getPrompts } from '../../api/prompt'
import type { PromptTemplate } from '../../types/prompt'

type ChooseTemplateProps = {
    categories: string[]
    setCategories: React.Dispatch<React.SetStateAction<string[]>>
    filteredTemplates: PromptTemplate[]
    selectedTemplate: PromptTemplate | null
    setSelectedTemplate: React.Dispatch<React.SetStateAction<PromptTemplate | null>>
    selectedCategory: string
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
}

function ChooseTemplate({
    categories,
    setCategories,
    filteredTemplates,
    selectedTemplate,
    setSelectedTemplate,
    selectedCategory,
    setSelectedCategory
}: ChooseTemplateProps) {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <InputLabel sx={{ fontWeight: 'bold', color: '#29293A', mb: 1 }}>
                    Category
                </InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#C0C8DB',
                            borderRadius: '12px'
                        }
                    }}
                >
                    {categories.map((opt, index) => (
                        <MenuItem key={index} value={opt}>
                            {opt}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box>
                <InputLabel sx={{ fontWeight: 'bold', color: '#29293A', mb: 1 }}>
                    Prompt Template
                </InputLabel>
                <Select
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => {
                        const template = filteredTemplates.find((t) => t.id === e.target.value)
                        setSelectedTemplate(template || null)
                    }}
                    displayEmpty
                    renderValue={() => selectedTemplate?.template_name || 'Select a template'}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#C0C8DB',
                            borderRadius: '12px'
                        }
                    }}
                >
                    {filteredTemplates.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                            {opt.template_name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    )
}

export default ChooseTemplate