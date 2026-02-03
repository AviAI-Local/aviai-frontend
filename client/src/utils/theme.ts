import { createTheme } from '@mui/material'
import type { EditorThemeClasses } from 'lexical';
import '../components/Note/editor.css'

export const theme = createTheme({
    palette: {
        primary: {
            main: '#3D64FD',
            contrastText: '#F8F9FD'
        },
        secondary: {
            main: '#FCADBD'
        },

        error: {
            main: '#F25D5A'
        },
        text: {
            primary: '#29293A',
            secondary: '#9FA7BE'
        },
    }
})


export const editorTheme: EditorThemeClasses = {
  text: {
    bold: 'editor-bold',
    italic: 'editor-italic',
    underline: 'editor-underline',
    strikethrough: 'editor-strikethrough',
    underlineStrikethrough: 'editor-underline-strikethrough',
    code: 'editor-code',
  }
}

  
