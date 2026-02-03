import {
    Code,
    FormatAlignCenter,
    FormatAlignJustify,
    FormatAlignLeft,
    FormatAlignRight,
    FormatBold,
    FormatItalic,
    FormatStrikethrough,
    FormatUnderlined,
    Redo,
    Subscript,
    Superscript,
    Undo
} from '@mui/icons-material'

export enum RichTextAction {
    Bold = 'bold',
    Italics = 'italics',
    Underline = 'underline',
    Strikethrough = 'strikethrough',
    Superscript = 'superscript',
    Subscript = 'subscript',
    Code = 'code',
    LeftAlign = 'leftAlign',
    CenterAlign = 'centerAlign',
    RightAlign = 'rightAlign',
    JustifyAlign = 'justifyAlign',
    Divider = 'divider',
    Undo = 'undo',
    Redo = 'redo'
}

export const RICH_TEXT_OPTIONS = [
    { id: RichTextAction.Bold, icon: FormatBold, label: 'Bold' },
    { id: RichTextAction.Italics, icon: FormatItalic, label: 'Italics' },
    { id: RichTextAction.Underline, icon: FormatUnderlined, label: 'Underline' },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.Strikethrough,
        icon: FormatStrikethrough,
        label: 'Strikethrough'
    },
    {
        id: RichTextAction.Superscript,
        icon: Superscript,
        label: 'Superscript'
    },
    {
        id: RichTextAction.Subscript,
        icon: Subscript,
        label: 'Subscript'
    },
    {
        id: RichTextAction.Code,
        icon: Code,
        label: 'Code'
    },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.LeftAlign,
        icon: FormatAlignLeft,
        label: 'Align Left'
    },
    {
        id: RichTextAction.CenterAlign,
        icon: FormatAlignCenter,
        label: 'Align Center'
    },
    {
        id: RichTextAction.RightAlign,
        icon: FormatAlignRight,
        label: 'Align Right'
    },
    {
        id: RichTextAction.JustifyAlign,
        icon: FormatAlignJustify,
        label: 'Align Justify'
    },

    { id: RichTextAction.Divider },
    {
        id: RichTextAction.Undo,
        icon: Undo,
        label: 'Undo'
    },
    {
        id: RichTextAction.Redo,
        icon: Redo,
        label: 'Redo'
    }
]

export const LOW_PRIORIRTY = 1
export const HEADINGS = [
    {
        label: 'Heading 1',
        value: 'h1'
    },
    {
        label: 'Heading 2',
        value: 'h2'
    },
    {
        label: 'Heading 3',
        value: 'h3'
    },
    {
        label: 'Heading 4',
        value: 'h4'
    },
    {
        label: 'Heading 5',
        value: 'h5'
    },
    {
        label: 'Heading 6',
        value: 'h6'
    }
]

export const Mode = {
    Edit: 'Edit',
    View: 'View'
} as const

export const DialogType = {
    Exit: 'Exit',
    Delete: 'Delete'
} as const
