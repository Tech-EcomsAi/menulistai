import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card, Space, theme } from 'antd';
import React from 'react';
import BubbleMenu from './BubbleMenu';
import MenuBar from './MenuBar';
import { SlashCommandsExtension } from './SlashCommandsMenu';
import './styles.css';
import { RichTextEditorProps } from './types';

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
}) => {

  const { token } = theme.useToken();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        strike: false,  // Disable strike in StarterKit since we're adding it separately
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Strike,  // Keep our separate Strike extension
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Typography,
      Placeholder.configure({
        placeholder,
      }),
      SlashCommandsExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor',
        style: `border: 1px solid ${token.colorBorder}; border-radius: ${token.borderRadius}px; padding: 16px;`,
      },
    },
    immediatelyRender: false,
  });

  const handleAIWrite = () => {
    // Implement AI writing functionality
    console.log('AI Write clicked');
  };

  const handleAIImage = () => {
    // Implement AI image generation functionality
    console.log('AI Image clicked');
  };

  return (
    <Card className="rich-text-editor" size='small'>
      <Space direction="vertical" size="middle">
        <MenuBar editor={editor} />
        {editor && <BubbleMenu editor={editor} />}
        {/* {editor && <AIMenu editor={editor} onAIWrite={handleAIWrite} onAIImage={handleAIImage} />} */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <EditorContent editor={editor} />
        </div>
      </Space>
    </Card>
  );
};

export default RichTextEditor;
