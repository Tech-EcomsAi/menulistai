import { Editor } from '@tiptap/core';

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface MenuBarProps {
    editor: Editor | null;
}

export interface BubbleMenuProps {
    editor: Editor | null;
}

export interface FloatingMenuProps {
    editor: Editor | null;
}

export interface AIMenuProps {
    editor: Editor | null;
    onAIWrite?: () => void;
    onAIImage?: () => void;
}
