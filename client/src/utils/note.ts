// utils/noteTemplates.ts
import type { NoteFormValues } from '../components/Interview/NotePanel'
import type { LexicalEditorState } from '../types/common'

export const TEMPLATE_EDITOR_STATE: LexicalEditorState = {
    root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
            {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: null,
                children: [
                    {
                        type: 'text',
                        text: 'I. Aircraft make/model',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1
                    }
                ]
            },
            {
                type: 'paragraph',
                children: [
                    { type: 'text', text: 'II. Date', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }
                ]
            },
            {
                type: 'paragraph',
                children: [
                    { type: 'text', text: 'Dawn ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: '☐ ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: 'Day ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: '☐ ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: 'Dusk ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: '☐ ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: 'Night ', format: 0, detail: 0, mode: 'normal', style: '', version: 1 },
                    { type: 'text', text: '☐', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }
                ]
            },
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: 'III. Weather Conditions at the Time of Inciden',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1
                    }
                ]
            },
            {
                type: 'paragraph',
                children: [
                    {
                        type: 'text',
                        text: 'IV. Details of Observed events',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1
                    }
                ]
            }
        ]
    }
}

export const EMPTY_EDITOR_STATE: LexicalEditorState = {
    root: {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1
    }
}

export function convertNoteToLexical(values: NoteFormValues) {
    const makeTextNode = (text: string) => ({
        type: 'text',
        text,
        format: 0,
        detail: 0,
        mode: 'normal',
        style: '',
        version: 1
    })

    const makeParagraphNode = (text: string) => ({
        type: 'paragraph',
        children: [makeTextNode(text)],
        direction: null,
        format: '',
        indent: 0,
        version: 1
    })

    const makeHeadingNode = (text: string, tag: 'h1' | 'h2' | 'h3' = 'h3') => ({
        type: 'heading',
        tag,
        children: [makeTextNode(text)],
        direction: null,
        format: '',
        indent: 0,
        version: 1
    })

    const children = []

    children.push(makeHeadingNode('I. Aircraft make/model', 'h3'))
    children.push(makeParagraphNode(values.aircraft))

    children.push(makeHeadingNode('II. Date', 'h3'))
    children.push(makeParagraphNode(values.date))

    children.push(makeHeadingNode('III. Weather Conditions at the Time of Incident', 'h3'))
    children.push(makeParagraphNode(values.weather))

    children.push(makeHeadingNode('IV. Details of Observed events', 'h3'))
    children.push(makeParagraphNode(values.details))

    return {
        root: {
            type: 'root',
            children,
            direction: null,
            format: '',
            indent: 0,
            version: 1
        }
    }
}
