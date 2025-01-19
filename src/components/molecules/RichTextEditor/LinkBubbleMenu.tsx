import { BubbleMenu, Editor } from '@tiptap/react';
import { Button, Input, Popover, Switch, theme } from 'antd';
import React, { useState } from 'react';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

interface LinkBubbleMenuProps {
  editor: Editor;
  onRemove: () => void;
}

const LinkBubbleMenu: React.FC<LinkBubbleMenuProps> = ({ editor, onRemove }) => {
  const { token } = theme.useToken();
  const [isEditing, setIsEditing] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [editPopoverOpen, setEditPopoverOpen] = useState(false);

  const handleEdit = () => {
    const attrs = editor.getAttributes('link');
    setLinkUrl(attrs.href || '');
    setOpenInNewTab(attrs.target === '_blank');
    setIsEditing(true);
    setEditPopoverOpen(true);
  };

  const handleSetLink = () => {
    if (!linkUrl || !editor) return;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: linkUrl,
        target: openInNewTab ? '_blank' : null
      })
      .run();

    setEditPopoverOpen(false);
    setIsEditing(false);
  };

  const editContent = (
    <div style={{ width: 300 }}>
      <Input
        placeholder="Enter URL"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span>Open in new tab</span>
        <Switch
          checked={openInNewTab}
          onChange={setOpenInNewTab}
        />
      </div>
      <Button
        type="primary"
        block
        onClick={handleSetLink}
      >
        Update Link
      </Button>
    </div>
  );

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive('link')}
      tippyOptions={{ duration: 100 }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadow
      }}>
        <span style={{
          color: token.colorTextSecondary,
          marginRight: 8
        }}>
          {editor.getAttributes('link').href}
        </span>
        <Popover
          content={editContent}
          title="Edit Link"
          trigger="click"
          open={editPopoverOpen}
          onOpenChange={setEditPopoverOpen}
        >
          <Button
            type="text"
            icon={<LuPencil />}
            onClick={handleEdit}
          />
        </Popover>
        <Button
          type="text"
          icon={<LuTrash2 />}
          onClick={onRemove}
        />
      </div>
    </BubbleMenu>
  );
};

export default LinkBubbleMenu;
