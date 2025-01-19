import { Editor } from '@tiptap/react';
import { Button, Input, Popover, Switch, Tooltip, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { LuLink, LuTrash2 } from 'react-icons/lu';
import LinkBubbleMenu from './LinkBubbleMenu';

interface LinkMenuProps {
  editor: Editor;
}

const LinkMenu: React.FC<LinkMenuProps> = ({ editor }) => {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const { token } = theme.useToken();

  const resetLinkStates = () => {
    setLinkUrl('');
    setOpenInNewTab(false);
    setLinkPopoverOpen(false);
  };

  // Update link states when selection changes
  useEffect(() => {
    if (editor?.isActive('link')) {
      const attrs = editor.getAttributes('link');
      setLinkUrl(attrs.href || '');
      setOpenInNewTab(attrs.target === '_blank');
    }
  }, [editor?.state?.selection]);

  const handleRemoveLink = () => {
    if (editor?.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      resetLinkStates();
    }
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

    resetLinkStates();
  };

  const handleLinkButtonClick = () => {
    if (editor?.isActive('link')) {
      const attrs = editor.getAttributes('link');
      setLinkUrl(attrs.href || '');
      setOpenInNewTab(attrs.target === '_blank');
    } else {
      setLinkUrl('');
      setOpenInNewTab(false);
    }
    setLinkPopoverOpen(true);
  };

  const linkContent = (
    <div style={{ width: 300 }}>
      {editor?.isActive('link') ? (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
            marginBottom: 8
          }}>
            <span style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {linkUrl}
            </span>
            <Button
              type="text"
              icon={<LuTrash2 />}
              onClick={handleRemoveLink}
            />
          </div>
        </div>
      ) : (
        <>
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
            Set Link
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <LinkBubbleMenu
        editor={editor}
        onRemove={handleRemoveLink}
      />
      <Tooltip title="Link">
        <Popover
          content={linkContent}
          title="Insert Link"
          trigger="click"
          open={linkPopoverOpen}
          onOpenChange={setLinkPopoverOpen}
        >
          <Button
            shape="circle"
            type={editor.isActive('link') ? 'primary' : 'text'}
            ghost={editor.isActive('link')}
            icon={<LuLink />}
            onClick={handleLinkButtonClick}
          />
        </Popover>
      </Tooltip>
    </>
  );
};

export default LinkMenu;
