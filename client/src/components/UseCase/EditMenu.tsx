import { Box, Divider, Typography } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LinkIcon from '@mui/icons-material/Link'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { Role } from '../../types/common'

type EditMenuProps = {
    role: Role
    handleOpen?: () => void
    handleCopyLink?: () => void
}

type RowEditMenuProps = {
    title: string
    icon: SvgIconComponent
    onClick?: () => void
}

function EditMenu({ role, handleOpen, handleCopyLink }: EditMenuProps) {
    return (
        <Box
            sx={{
                backgroundColor: 'white',
                width: 200,
                borderRadius: 3,
                paddingY: 1,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                color: '#9FA7BE'
            }}
        >
            <RowEditBoard title={'Open Card'} icon={OpenInNewIcon} onClick={handleOpen} />
            {/* {role === Role.Admin && <RowEditBoard title={'Duplicate'} icon={ContentCopyIcon} />} */}
            <RowEditBoard title={'Copy Card Link'} icon={LinkIcon} onClick={handleCopyLink} />

            {/* {role === Role.Admin && <Divider sx={{ my: 1, borderColor: '#9FA7BE', opacity: 0.5 }} />} */}
            {/* {role === Role.Admin && <RowEditBoard title={'Archive'} icon={Inventory2OutlinedIcon} />} */}
            {/* {role === Role.Admin && <RowEditBoard title={'Delete'} icon={DeleteOutlineOutlinedIcon} />} */}
        </Box>
    )
}

function RowEditBoard({ title, icon: Icon, onClick }: RowEditMenuProps) {
    return (
        <Box
            onClick={(e) => {
                e.stopPropagation()
                onClick?.()
            }}
            sx={{
                paddingX: 1,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                borderRadius: 1.5,
                mx: 1,
                padding: 1,
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                    backgroundColor: '#3D64FD',
                    color: 'white'
                }
            }}
        >
            <Icon />
            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: 14
                }}
            >
                {title}
            </Typography>
        </Box>
    )
}

export default EditMenu
