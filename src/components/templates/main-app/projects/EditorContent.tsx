import { Card, Collapse, Empty, Flex, Input, Space, Tag, Typography, theme } from "antd";
import { useState } from "react";
import { ProjectFileType } from "./type";

const { Text } = Typography;

interface EditorContentProps {
    file: ProjectFileType;
    setProjectData: any;
    selectedLanguages: Set<string>;
}

export function EditorContent({ file, setProjectData, selectedLanguages }: EditorContentProps) {
    const { token } = theme.useToken();
    const [editStates, setEditStates] = useState<Record<string, boolean>>({});
    const [editValues, setEditValues] = useState<Record<string, string>>({});

    const handleStartEdit = (id: string, initialValue: string) => {
        setEditStates(prev => ({ ...prev, [id]: true }));
        setEditValues(prev => ({ ...prev, [id]: initialValue }));
    };

    const handleBlur = (id: string) => {
        setEditStates(prev => ({ ...prev, [id]: false }));
        // TODO: Implement save logic here with editValues[id]
    };

    const handleUpdateValue = (id: string, newValue: string) => {
        // Update local edit values state
        setEditValues(prev => ({ ...prev, [id]: newValue }));

        // Update project data
        setProjectData((prevProject: any) => ({
            ...prevProject,
            files: prevProject.files.map((f: any) => {
                if (f.uid === file.uid) {
                    const modelResponse = { ...f.modelResponse };

                    if (id.startsWith('category-')) {
                        // Handle category name updates
                        const [_, categoryIdx, lang] = id.split('-');
                        modelResponse.data = {
                            ...modelResponse.data,
                            categories: modelResponse.data.categories.map((cat: any, idx: number) => {
                                if (idx === parseInt(categoryIdx)) {
                                    return {
                                        ...cat,
                                        name: {
                                            ...cat.name,
                                            [lang]: newValue
                                        }
                                    };
                                }
                                return cat;
                            })
                        };
                    } else if (id.startsWith('item-')) {
                        // Handle item name updates
                        const [_, categoryIdx, itemIdx, lang] = id.split('-');
                        modelResponse.data = {
                            ...modelResponse.data,
                            items: modelResponse.data.items.map((item: any, idx: number) => {
                                if (idx === parseInt(itemIdx)) {
                                    return {
                                        ...item,
                                        name: {
                                            ...item.name,
                                            [lang]: newValue
                                        }
                                    };
                                }
                                return item;
                            })
                        };
                    } else if (id.startsWith('item-') && id.includes('-attr-')) {
                        // Handle item attribute price updates
                        const [_, categoryIdx, itemIdx, __, attrIdx] = id.split('-');
                        modelResponse.data = {
                            ...modelResponse.data,
                            items: modelResponse.data.items.map((item: any, idx: number) => {
                                if (idx === parseInt(itemIdx)) {
                                    return {
                                        ...item,
                                        attributes: item.attributes.map((attr: any, attrId: number) => {
                                            if (attrId === parseInt(attrIdx)) {
                                                return {
                                                    ...attr,
                                                    price: newValue
                                                };
                                            }
                                            return attr;
                                        })
                                    };
                                }
                                return item;
                            })
                        };
                    } else if (id.startsWith('item-') && id.includes('-price')) {
                        // Handle item price updates
                        const [_, categoryIdx, itemIdx, __] = id.split('-');
                        modelResponse.data = {
                            ...modelResponse.data,
                            items: modelResponse.data.items.map((item: any, idx: number) => {
                                if (idx === parseInt(itemIdx)) {
                                    return {
                                        ...item,
                                        price: newValue
                                    };
                                }
                                return item;
                            })
                        };
                    } else {
                        // Handle item value updates
                        modelResponse.data = {
                            ...modelResponse.data,
                            items: modelResponse.data.items.map((item: any) =>
                                item.id === id ? { ...item, value: newValue } : item
                            )
                        };
                    }

                    return {
                        ...f,
                        modelResponse
                    };
                }
                return f;
            })
        }));
    };

    const renderEditableContent = (content: string, id: string, lang: string) => {
        const isEditing = editStates[id] || false;

        return (
            <Input
                value={isEditing ? editValues[id] : content}
                onChange={(e) => handleUpdateValue(id, e.target.value)}
                onBlur={() => handleBlur(id)}
                onClick={() => !isEditing && handleStartEdit(id, content)}
                autoFocus={isEditing}
                variant={isEditing ? "outlined" : "outlined"}
                readOnly={!isEditing}
                style={{
                    height: 32,
                    width: '100%',
                    cursor: isEditing ? 'text' : 'pointer'
                }}
            />
        );
    };

    return (
        <Card
            styles={{ body: { padding: 0 } }}
            style={{
                width: '100%',
                background: token.colorBgContainer
            }}
        >
            {file.modelResponse ? (
                <Collapse
                    defaultActiveKey={['0']}
                    style={{ width: '100%' }}
                    items={file.modelResponse.data.categories.map((category, categoryIdx) => {
                        const categoryItems = file.modelResponse.data.items.filter(item => item.category === category.id);
                        return {
                            key: categoryIdx,
                            label: (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text strong>Category {categoryIdx + 1}</Text>
                                    {Array.from(selectedLanguages).map(langWithCode => {
                                        const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                        const name = category.name?.[lang] || '';
                                        return (
                                            <Flex key={lang} align="center" gap={8}>
                                                {selectedLanguages.size > 1 && <Tag>{lang}</Tag>}
                                                {renderEditableContent(name, `category-${categoryIdx}-${lang}`, lang)}
                                            </Flex>
                                        );
                                    })}
                                </Space>
                            ),
                            children: (
                                <Space direction="vertical" style={{ width: '100%', paddingLeft: 18 }}>
                                    {categoryItems.map((item, itemIdx) => (
                                        <Card
                                            hoverable={false}
                                            bordered={selectedLanguages.size > 1}
                                            key={itemIdx}
                                            style={{ width: '100%', boxShadow: "" }}
                                            styles={{
                                                body: {
                                                    padding: selectedLanguages.size > 1 ? token.paddingSM : 0
                                                }
                                            }}
                                        >
                                            <Flex style={{ width: '100%' }} gap={12} justify="space-between">
                                                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                                    {Array.from(selectedLanguages).map(langWithCode => {
                                                        const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                                        const name = item.name?.[lang] || '';
                                                        return (
                                                            <Flex key={lang} align="center" gap={8}>
                                                                {selectedLanguages.size > 1 && <Tag>{lang}</Tag>}
                                                                <Flex gap={12} style={{ flex: 1 }} align="center">
                                                                    <Flex flex={1}>
                                                                        {renderEditableContent(name, `item-${categoryIdx}-${itemIdx}-${lang}`, lang)}
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>
                                                        );
                                                    })}
                                                </Space>
                                                {item.attributes ? (
                                                    <Space size={8} direction="vertical">
                                                        {item.attributes.map((attr, attrIdx) => (
                                                            <Flex key={attrIdx} align="center" gap={8} justify="flex-end">
                                                                <Text type="secondary" style={{ fontSize: 13, minWidth: "max-content" }}>{attr.name}</Text>
                                                                <Flex style={{ minWidth: 100, width: 100 }}>
                                                                    {renderEditableContent(attr.price, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}`, '')}
                                                                </Flex>
                                                            </Flex>
                                                        ))}
                                                    </Space>
                                                ) : (
                                                    <Flex style={{ minWidth: 100, width: 100 }}>
                                                        {renderEditableContent(item.price || '', `item-${categoryIdx}-${itemIdx}-price`, '')}
                                                    </Flex>
                                                )}
                                            </Flex>
                                        </Card>
                                    ))}
                                </Space>
                            )
                        };
                    })}
                />
            ) : (
                <Empty description="No model response available" />
            )}
        </Card>
    );
}

export default EditorContent;
