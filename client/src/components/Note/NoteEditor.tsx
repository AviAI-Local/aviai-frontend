// components/Note/NoteEditor.tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useMemo } from 'react'
import {  type EditorState } from 'lexical'
import EditorPlugin from './EditorPlugin'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './ToolbarPlugin'
import './editor.css'
import { editorTheme } from '../../utils/theme'
import type { LexicalEditorState } from '../../types/common'
import { ListNode, ListItemNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

interface NoteEditorProps {
    content: LexicalEditorState | null
    onChange?: (newContent: EditorState) => void
}

export default function NoteEditor({ content, onChange }: NoteEditorProps) {
    const initialConfig = useMemo(
        () => ({
            namespace: `NoteEditor_${Date.now()}`,
            editorState: null,
            theme: editorTheme,
            onError: (error: Error) => console.error(error),
            nodes: [HeadingNode, CodeHighlightNode, CodeNode, ListNode, ListItemNode]
        }),
        []
    )

    const handleChange = (editorState: EditorState) => {
        onChange?.(editorState)
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <ToolbarPlugin />
            <EditorPlugin jsonContent={content} />
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        style={{
                            height: '80%',
                            padding: 8,
                            overflow: 'auto',
                            outline: 'none'
                        }}
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <AutoFocusPlugin />
            <HistoryPlugin />
            <ListPlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    editorState.read(() => {
                        handleChange(editorState)
                    })
                }}
            />
        </LexicalComposer>
    )
}
