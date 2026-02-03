import {
    CommentOutlined,
    CommentsDisabledOutlined,
    Edit,
    EditOff,
    FiberManualRecordOutlined,
    MicOff,
    MicOutlined,
    RadioButtonCheckedOutlined,
    VideocamOffOutlined,
    VideocamOutlined
} from '@mui/icons-material'

export const meetingControls = {
    camera: {
        label: 'Camera',
        enabled: <VideocamOutlined sx={{ color: 'white' }} />,
        disabled: <VideocamOffOutlined sx={{ color: 'white' }} />
    },
    record: {
        label: 'Record',
        enabled: <FiberManualRecordOutlined sx={{ color: 'white' }} />,
        disabled: <RadioButtonCheckedOutlined sx={{ color: 'white' }} />
    },
    chat: {
        label: 'Chat',
        enabled: <CommentOutlined sx={{ color: 'white' }} />,
        disabled: <CommentsDisabledOutlined sx={{ color: 'white' }} />
    },
    mic: {
        label: 'Mic',
        enabled: <MicOutlined sx={{ color: 'white' }} />,
        disabled: <MicOff sx={{ color: 'white' }} />
    },
    note: { label: 'Note', enabled: <Edit sx={{ color: 'white' }} />, disabled: <EditOff sx={{ color: 'white' }} /> }
} as const
