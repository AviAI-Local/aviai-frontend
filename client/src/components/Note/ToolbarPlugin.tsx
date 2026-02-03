import { ButtonGroup, Divider, FormControl, IconButton, MenuItem, Select, Stack } from '@mui/material'
import { HEADINGS, LOW_PRIORIRTY, RICH_TEXT_OPTIONS, RichTextAction } from '../../constants/notes'
import React, { useEffect, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical'
import { mergeRegister } from '@lexical/utils'
import { $createHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import { $wrapNodes } from '@lexical/selection'

function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext()
    const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
        [RichTextAction.Undo]: true,
        [RichTextAction.Redo]: true
    })
    const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>({})

    const updateToolbar = () => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
            const newSelectionMap = {
                [RichTextAction.Bold]: selection.hasFormat('bold'),
                [RichTextAction.Italics]: selection.hasFormat('italic'),
                [RichTextAction.Underline]: selection.hasFormat('underline'),
                [RichTextAction.Strikethrough]: selection.hasFormat('strikethrough'),
                [RichTextAction.Superscript]: selection.hasFormat('superscript'),
                [RichTextAction.Subscript]: selection.hasFormat('subscript'),
                [RichTextAction.Code]: selection.hasFormat('code')
            }
            setSelectionMap(newSelectionMap)
        }
    }

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar()
                })
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateToolbar()
                    return false
                },
                LOW_PRIORIRTY
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setDisableMap((prevDisableMap) => ({
                        ...prevDisableMap,
                        undo: !payload
                    }))
                    return false
                },
                LOW_PRIORIRTY
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setDisableMap((prevDisableMap) => ({
                        ...prevDisableMap,
                        redo: !payload
                    }))
                    return false
                },
                LOW_PRIORIRTY
            )
        )
    }, [editor])

    const onAction = (id: RichTextAction) => {
        switch (id) {
            case RichTextAction.Bold: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                break
            }
            case RichTextAction.Italics: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                break
            }
            case RichTextAction.Underline: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                break
            }
            case RichTextAction.Strikethrough: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                break
            }
            case RichTextAction.Superscript: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
                break
            }
            case RichTextAction.Subscript: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
                break
            }

            case RichTextAction.Code: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
                break
            }
            case RichTextAction.LeftAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                break
            }
            case RichTextAction.RightAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                break
            }
            case RichTextAction.CenterAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                break
            }
            case RichTextAction.JustifyAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                break
            }
            case RichTextAction.Undo: {
                editor.dispatchCommand(UNDO_COMMAND, undefined)
                break
            }
            case RichTextAction.Redo: {
                editor.dispatchCommand(REDO_COMMAND, undefined)
                break
            }
        }
    }

    const updateHeading = (heading: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection()

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createHeadingNode(heading))
            }
        })
    }

    return (
        <Stack direction='row' gap={1} width='full'>
            <FormControl sx={{ width: '8rem' }} size='small'>
                <Select onChange={(e) => updateHeading(e.target.value as HeadingTagType)} aria-placeholder='Heading'>
                    {HEADINGS.map((heading) => (
                        <MenuItem value={heading.value}>{heading.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <ButtonGroup variant='outlined'>
                {RICH_TEXT_OPTIONS.map(({ id, label, icon }) => {
                    if (id === RichTextAction.Divider) {
                        return <Divider key={`divider-${Math.random()}`} orientation='vertical' flexItem />
                    }

                    if (!icon) return null

                    return (
                        <IconButton
                            key={id}
                            aria-label={label}
                            onClick={() => onAction(id)}
                            disabled={disableMap[id]}
                            sx={{ color: selectionMap[id] ? 'primary.main' : '' }}
                        >
                            {React.createElement(icon, { fontSize: 'small' })}
                        </IconButton>
                    )
                })}
            </ButtonGroup>
        </Stack>
    )
}

export default ToolbarPlugin
