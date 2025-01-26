import { Card, Empty, Flex, Typography, theme } from "antd";
import { ProjectFileType } from "./type";

const { Text } = Typography;

interface EditorContentProps {
    file: ProjectFileType;
}

export function EditorContent({ file }: EditorContentProps) {
    const { token } = theme.useToken();

    const renderEditableContent = (content: string) => (
        <div
            contentEditable
            suppressContentEditableWarning
            style={{
                padding: '8px 12px',
                border: `1px solid ${token.colorBorder}`,
                borderRadius: token.borderRadius,
                marginBottom: 8,
                minHeight: 32,
                background: token.colorBgContainer
            }}
        >
            {content}
        </div>
    );

    return (
        <Card
            style={{ height: 'max-content', background: token.colorBgLayout }}
            size="small"
            bordered={false}
            styles={{ body: { padding: "0 10px" } }}
        >
            {file.modelResponse ? (
                <Flex vertical gap={24}>
                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>CATEGORIES</Text>
                        {file.modelResponse.data.categories.map((category, idx) => (
                            <div key={idx} style={{ marginTop: 4 }}>
                                {renderEditableContent(Object.entries(category.name).map(([lang, name]) =>
                                    `${name} (${lang})`
                                ).join(' | '))}
                            </div>
                        ))}
                    </div>

                    <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>ITEMS</Text>
                        {file.modelResponse.data.items.map((item, idx) => (
                            <div key={idx} style={{ marginTop: 4 }}>
                                {renderEditableContent(Object.entries(item.name).map(([lang, name]) =>
                                    `${name} (${lang})`
                                ).join(' | '))}
                            </div>
                        ))}
                    </div>
                </Flex>
            ) : (
                <Empty description="No model response available" />
            )}
        </Card>
    );
}

export default EditorContent;
