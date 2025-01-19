import ColorStyle from '@molecules/styleElement/color';
import { Button, Divider, Space, theme, Tooltip } from 'antd';
import React from 'react';
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCheckSquare,
  LuCode,
  LuItalic,
  LuList,
  LuListOrdered,
  LuMinus,
  LuRedo,
  LuStrikethrough,
  LuUnderline,
  LuUndo
} from 'react-icons/lu';
import LinkMenu from './LinkMenu';
import { MenuBarProps } from './types';

type Level = 1 | 2 | 3;
// https://tiptap.dev/docs/editor/extensions/overview?filter=free
const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const { token } = theme.useToken();
  if (!editor) {
    return null;
  }

  const getButtonProps = (active: boolean) => {
    const props: any = {
      shape: 'circle',
      type: active ? 'primary' : 'text',
      ghost: active
    };
    return props;
  };

  return (
    <Space wrap split={<Divider type="vertical" style={{ margin: 0, borderColor: token.colorBorder, height: 20 }} />}>

      <Space>
        <Tooltip title="Paragraph">
          <Button {...getButtonProps(editor.isActive('paragraph'))} onClick={() => editor.chain().focus().setParagraph().run()}>
            P
          </Button>
        </Tooltip>
        {[1, 2, 3].map((level: Level) => (
          <Tooltip key={level} title={`Heading ${level}`}>
            <Button
              {...getButtonProps(editor.isActive('heading', { level }))}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            >
              H{level}
            </Button>
          </Tooltip>
        ))}
      </Space>

      <Space>
        <ColorStyle
          hidePresets={false}
          showTransperancy={false}
          pickerSize="middle"
          trigger="hover"
          value={editor.getAttributes('textStyle').color || '#000000'}
          onChange={(color: string) => editor.chain().focus().setColor(color).run()}
          showText={false}
        />
        <Tooltip title="Bold">
          <Button
            {...getButtonProps(editor.isActive('bold'))}
            icon={<LuBold />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            {...getButtonProps(editor.isActive('italic'))}
            icon={<LuItalic />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip title="Underline">
          <Button
            {...getButtonProps(editor.isActive('underline'))}
            icon={<LuUnderline />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </Tooltip>
        <Tooltip title="Code">
          <Button
            {...getButtonProps(editor.isActive('code'))}
            icon={<LuCode />}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
        </Tooltip>
        <Tooltip title="Strike">
          <Button
            {...getButtonProps(editor.isActive('strike'))}
            icon={<LuStrikethrough />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </Tooltip>
        <LinkMenu editor={editor} />
      </Space>

      <Space>
        <Tooltip title="Bullet List">
          <Button
            {...getButtonProps(editor.isActive('bulletList'))}
            icon={<LuList />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Tooltip title="Ordered List">
          <Button
            {...getButtonProps(editor.isActive('orderedList'))}
            icon={<LuListOrdered />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
        <Tooltip title="Task List">
          <Button
            {...getButtonProps(editor.isActive('taskList'))}
            icon={<LuCheckSquare />}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          />
        </Tooltip>
      </Space>

      <Space>
        <Tooltip title="Align Left">
          <Button
            {...getButtonProps(editor.isActive({ textAlign: 'left' }))}
            icon={<LuAlignLeft />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
        </Tooltip>
        <Tooltip title="Align Center">
          <Button
            {...getButtonProps(editor.isActive({ textAlign: 'center' }))}
            icon={<LuAlignCenter />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
        </Tooltip>
        <Tooltip title="Align Right">
          <Button
            {...getButtonProps(editor.isActive({ textAlign: 'right' }))}
            icon={<LuAlignRight />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
        </Tooltip>
        <Tooltip title="Justify">
          <Button
            {...getButtonProps(editor.isActive({ textAlign: 'justify' }))}
            icon={<LuAlignJustify />}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          />
        </Tooltip>
      </Space>

      <Space>
        <Tooltip title="Horizontal Rule">
          <Button
            {...getButtonProps(editor.isActive('horizontalRule'))}
            icon={<LuMinus />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </Tooltip>
      </Space>

      <Space>
        <Tooltip title="Undo">
          <Button
            {...getButtonProps(editor.can().undo())}
            icon={<LuUndo />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            {...getButtonProps(editor.can().redo())}
            icon={<LuRedo />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </Tooltip>
      </Space>

    </Space>
  );
};

export default MenuBar;
