import ColorStyle from '@molecules/styleElement/color';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import { Button, Card, Space } from 'antd';
import React from 'react';
import {
  LuBold,
  LuCode,
  LuItalic,
  LuStrikethrough,
  LuUnderline,
  LuX
} from 'react-icons/lu';
import { BubbleMenuProps } from './types';

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <TiptapBubbleMenu
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <Card styles={{ body: { padding: "3px" } }}>
        <Space>
          <Button
            shape='circle'
            type={editor.isActive('bold') ? 'primary' : 'text'}
            ghost={editor.isActive('bold')}
            icon={<LuBold />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <Button
            shape='circle'
            type={editor.isActive('italic') ? 'primary' : 'text'}
            ghost={editor.isActive('italic')}
            icon={<LuItalic />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <Button
            shape='circle'
            type={editor.isActive('underline') ? 'primary' : 'text'}
            ghost={editor.isActive('underline')}
            icon={<LuUnderline />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <Button
            shape='circle'
            type={editor.isActive('code') ? 'primary' : 'text'}
            ghost={editor.isActive('code')}
            icon={<LuCode />}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <Button
            shape='circle'
            type={editor.isActive('strike') ? 'primary' : 'text'}
            ghost={editor.isActive('strike')}
            icon={<LuStrikethrough />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
          <ColorStyle
            hidePresets={false}
            showTransperancy={false}
            pickerSize="middle"
            trigger="hover"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(color: string) => editor.chain().focus().setColor(color).run()}
            showText={false}
          />
          <Button
            shape='circle'
            icon={<LuX />}
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          />
        </Space>
      </Card>
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;
