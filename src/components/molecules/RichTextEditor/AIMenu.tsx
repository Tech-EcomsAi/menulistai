import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { RobotOutlined, PictureOutlined } from '@ant-design/icons';
import { AIMenuProps } from './types';

const AIMenu: React.FC<AIMenuProps> = ({ editor, onAIWrite, onAIImage }) => {
  if (!editor) {
    return null;
  }

  return (
    <Space.Compact block>
      <Tooltip title="AI Writer">
        <Button
          icon={<RobotOutlined />}
          onClick={onAIWrite}
        >
          AI Writer
        </Button>
      </Tooltip>

      <Tooltip title="AI Image">
        <Button
          icon={<PictureOutlined />}
          onClick={onAIImage}
        >
          AI Image
        </Button>
      </Tooltip>
    </Space.Compact>
  );
};

export default AIMenu;
