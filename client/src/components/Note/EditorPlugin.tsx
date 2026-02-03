import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import type { LexicalEditorState } from '../../types/common';

export interface EditorPluginProps {
  jsonContent: LexicalEditorState | null;
}

export default function EditorPlugin({ jsonContent }: EditorPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [lastLoadedContent, setLastLoadedContent] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    editor.update(() => {
      const root = $getRoot();

      if (jsonContent) {
        const serialized = typeof jsonContent === 'string' ? jsonContent : JSON.stringify(jsonContent);

        // Only update if content is different
        if (serialized !== lastLoadedContent) {
          const editorState = editor.parseEditorState(serialized);
          editor.setEditorState(editorState);
          setLastLoadedContent(serialized);
        }
      } else if (root.getChildrenSize() === 0) {
        // Only create template if root is empty
        const addSection = (label: string, headingTag: 'h1' | 'h2' | 'h3' | 'h4' = 'h4') => {
          const headingNode = $createHeadingNode(headingTag);
          headingNode.append($createTextNode(label));
          root.append(headingNode);
        };

        addSection('I. Aircraft make/ model');
        root.append($createParagraphNode());

        addSection('II. Date');
        root.append($createParagraphNode());
        root.append($createParagraphNode());

        addSection('III. Weather Conditions at the Time of Incident');
        root.append($createParagraphNode());

        addSection('IV. Details of Observed events');
        root.append($createParagraphNode());
      }
    });
  }, [editor, jsonContent, lastLoadedContent]);

  return null
}
