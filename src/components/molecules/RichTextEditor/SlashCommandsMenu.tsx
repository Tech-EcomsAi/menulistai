import {
  CheckSquareOutlined,
  MenuOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RobotOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import { Card, Flex, List, Typography, theme } from 'antd';
import './SlashCommandsMenu.css';

const { Text } = Typography;

const SlashCommandsList = ({
  items,
  command,
}: {
  items: any[];
  command: (item: any) => void;
}) => {
  const { token } = theme.useToken();

  const styles = {
    card: {
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadow,
    },
    listItem: {
      padding: '8px 14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    icon: {
      width: 24,
      height: 24,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headingIcon: {
      fontSize: 12,
      fontWeight: 600,
    },
    label: {
      padding: '6px 14px 4px',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '0.7px',
      background: token.colorFillTertiary,
    }
  };

  return (
    <Card size="small" styles={{ body: { padding: 0 } }} style={styles.card} >
      <List
        size="small"
        dataSource={items}
        renderItem={(item) => {
          if (item.type === 'label') {
            return (
              <List.Item style={styles.label}>
                <Text type="secondary">{item.title}</Text>
              </List.Item>
            );
          }

          const getIcon = () => {
            if (!item.icon) {
              if (item.title.toLowerCase().includes('heading')) {
                const level = item.title.slice(-1);
                return <Text style={styles.headingIcon}>H{level}</Text>;
              }
              return <MenuOutlined />;
            }
            return item.icon;
          };

          return (
            <List.Item
              onClick={() => command(item)}
              style={styles.listItem}
              className="slash-command-item"
            >
              <Flex align="center" gap={12}>
                <div style={styles.icon}>
                  {getIcon()}
                </div>
                <Text>{item.title}</Text>
              </Flex>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

interface SlashCommandsRef {
  upHandler: () => boolean;
  downHandler: () => boolean;
  enterHandler: () => boolean;
}

const getSuggestionItems = () => {
  return [
    {
      title: 'AI Writer',
      description: 'Use AI to help you write',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        console.log('AI Writer clicked');
      },
      icon: <RobotOutlined />,
    },
    {
      title: 'AI Image',
      description: 'Generate an image using AI',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        console.log('AI Image clicked');
      },
      icon: <PictureOutlined />,
    },
    {
      title: 'FORMAT',
      type: 'label',
    },
    {
      title: 'Heading 1',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
      },
    },
    {
      title: 'Heading 3',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
      },
    },
    {
      title: 'Bullet List',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
      icon: <UnorderedListOutlined />,
    },
    {
      title: 'Numbered List',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
      icon: <OrderedListOutlined />,
    },
    {
      title: 'Task List',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
      icon: <CheckSquareOutlined />,
    },
  ];
};

export const SlashCommandsExtension = Extension.create({
  name: 'slash-commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          const commandProps = {
            editor,
            range,
          };
          return props.command(commandProps);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: getSuggestionItems,
        render: () => {
          let component: ReactRenderer<SlashCommandsRef>;
          let popup: HTMLDivElement | null = null;

          return {
            onStart: (props) => {
              popup = document.createElement('div');
              popup.className = 'slash-commands-menu';
              document.body.appendChild(popup);

              component = new ReactRenderer(SlashCommandsList, {
                props: {
                  items: props.items,
                  command: (item: any) => {
                    props.command(item);
                    popup?.remove();
                  },
                },
                editor: props.editor,
              });

              popup.appendChild(component.element);

              // Position the popup
              const rect = props.clientRect();
              if (rect) {
                popup.style.position = 'absolute';
                popup.style.zIndex = '1000';
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.bottom + 5}px`;
              }
            },

            onUpdate(props) {
              const rect = props.clientRect();
              if (popup && rect) {
                popup.style.left = `${rect.left}px`;
                popup.style.top = `${rect.bottom + 5}px`;
              }
              component.updateProps(props);
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                if (popup) {
                  document.body.removeChild(popup);
                  popup = null;
                }
                return true;
              }

              if (!props.event.shiftKey) {
                if (props.event.key === 'ArrowUp') {
                  const prev = component.ref?.upHandler();
                  return prev || true;
                }

                if (props.event.key === 'ArrowDown') {
                  const next = component.ref?.downHandler();
                  return next || true;
                }

                if (props.event.key === 'Enter') {
                  const enter = component.ref?.enterHandler();
                  return enter || true;
                }
              }
              return false;
            },

            onExit() {
              if (popup) {
                document.body.removeChild(popup);
                popup = null;
              }
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
