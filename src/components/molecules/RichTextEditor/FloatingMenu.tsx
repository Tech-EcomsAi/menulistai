import React from 'react';
import { FloatingMenu as TiptapFloatingMenu } from '@tiptap/react';
import { Space, Button } from 'antd';
import {
  OrderedListOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { FloatingMenuProps } from './types';

const FloatingMenu: React.FC<FloatingMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <TiptapFloatingMenu
      className="floating-menu"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <Space direction="vertical" style={{ padding: '8px' }}>
        <Button
          type="text"
          block
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </Button>
        <Button
          type="text"
          block
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered List
        </Button>
        <Button
          type="text"
          block
          icon={<CheckSquareOutlined />}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          Task List
        </Button>
      </Space>
    </TiptapFloatingMenu>
  );
};

export default FloatingMenu;
