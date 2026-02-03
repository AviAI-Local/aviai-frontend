import { Stack } from '@mui/material'
import ButtonIcon from '../common/ButtonIcon'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import CTAButton from '../common/CTAButton'
import React, { type Dispatch, type SetStateAction } from 'react'
import { Mode } from '../../constants/notes'

interface ActionSectionProps {
    onClickInterview: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => Promise<void>
    mode: keyof typeof Mode
    setMode: Dispatch<SetStateAction<keyof typeof Mode>>
   setDialogOpen : Dispatch<SetStateAction<boolean>>
}

function ActionSection({ onClickInterview, mode, setMode, setDialogOpen }: ActionSectionProps) {
    if (mode === Mode.Edit) {
        return
    }
    return (
        <Stack direction='column' spacing={2}>
            <Stack direction='row' spacing={1} alignSelf='flex-end'>
                <ButtonIcon
                    icon={EditOutlined}
                    sx={{ boxShadow: 'none', border: '1px solid #3D64FD' }}
                    onClick={() => setMode(Mode.Edit)}
                />
                <ButtonIcon
                    icon={DeleteOutline}
                    sx={{ boxShadow: 'none', border: '1px solid #F25D5A' }}
                    actionType='danger'
                    onClick={() => setDialogOpen(true)}
                />
            </Stack>
            <CTAButton title='Take an interview' onClick={onClickInterview} />
        </Stack>
    )
}

export default ActionSection
