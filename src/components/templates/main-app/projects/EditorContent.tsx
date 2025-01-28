import { Card, Collapse, Empty, Flex, Input, Space, Typography, theme } from "antd";
import { useState } from "react";
import { ProjectFileType } from "./type";

const { Text } = Typography;
const { Panel } = Collapse;

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
                addonBefore={
                    selectedLanguages.size > 1 && (
                        <Text style={{ minWidth: 30 }}>{lang.toUpperCase()}</Text>
                    )
                }
                value={isEditing ? editValues[id] : content}
                onChange={(e) => handleUpdateValue(id, e.target.value)}
                onBlur={() => handleBlur(id)}
                onClick={() => !isEditing && handleStartEdit(id, content)}
                autoFocus={isEditing}
                variant={isEditing ? "outlined" : "outlined"}
                readOnly={!isEditing}
                style={{
                    width: '100%',
                    cursor: isEditing ? 'text' : 'pointer'
                }}
            />
        );
    };

    return (
        <Card
            style={{
                width: '100%',
                background: token.colorBgContainer
            }}
        >
            {file.modelResponse ? (
                <Collapse defaultActiveKey={['0']} style={{ width: '100%' }}>
                    {file.modelResponse.data.categories.map((category, categoryIdx) => {
                        const categoryItems = file.modelResponse.data.items.filter(item => item.category === category.id);
                        return (
                            <Panel
                                header={
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text strong>Category {categoryIdx + 1}</Text>
                                        {Array.from(selectedLanguages).map(langWithCode => {
                                            const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                            const name = category.name?.[lang] || '';
                                            return (
                                                <Flex key={lang} align="center" gap={8}>
                                                    {renderEditableContent(name, `category-${categoryIdx}-${lang}`, lang)}
                                                </Flex>
                                            );
                                        })}
                                    </Space>
                                }
                                key={categoryIdx}
                            >
                                <Space direction="vertical" style={{ width: '100%', paddingLeft: 24 }}>
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
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                {Array.from(selectedLanguages).map(langWithCode => {
                                                    const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                                    const name = item.name?.[lang] || '';
                                                    return (
                                                        <Flex key={lang} align="center" gap={8}>
                                                            {renderEditableContent(name, `item-${categoryIdx}-${itemIdx}-${lang}`, lang)}
                                                        </Flex>
                                                    );
                                                })}
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            </Panel>
                        );
                    })}
                </Collapse>
            ) : (
                <Empty description="No model response available" />
            )}
        </Card>
    );
}

export default EditorContent;
