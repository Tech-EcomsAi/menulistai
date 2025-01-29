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
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const handleUpdateValue = (id: string, newValue: string) => {
        const modelResponse = { ...file.modelResponse };

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
            if (id.includes('-attr-')) {
                // Handle item attribute updates
                const parts = id.split('-');
                const itemIdx = parseInt(parts[2]);
                const attrIdx = parseInt(parts[4]);
                const isPrice = parts[5] === 'price';
                const lang = parts[5] !== 'price' ? parts[5] : '';

                modelResponse.data = {
                    ...modelResponse.data,
                    items: modelResponse.data.items.map((item: any, idx: number) => {
                        if (idx === Number(itemIdx)) {
                            return {
                                ...item,
                                attributes: item.attributes.map((attr: any, attrId: number) => {
                                    if (attrId === Number(attrIdx)) {
                                        if (isPrice) {
                                            return {
                                                ...attr,
                                                price: newValue
                                            };
                                        } else {
                                            return {
                                                ...attr,
                                                name: {
                                                    ...attr.name,
                                                    [lang]: newValue
                                                }
                                            };
                                        }
                                    }
                                    return attr;
                                })
                            };
                        }
                        return item;
                    })
                };
            } else if (id.includes('-price')) {
                // Handle item price updates
                const [_, categoryIdx, itemIdx, __] = id.split('-');
                modelResponse.data = {
                    ...modelResponse.data,
                    items: modelResponse.data.items.map((item: any, idx: number) => {
                        if (idx === Number(itemIdx)) {
                            return {
                                ...item,
                                price: newValue
                            };
                        }
                        return item;
                    })
                };
            } else {
                // Handle item name updates
                const [_, categoryIdx, itemIdx, lang] = id.split('-');
                modelResponse.data = {
                    ...modelResponse.data,
                    items: modelResponse.data.items.map((item: any, idx: number) => {
                        if (idx === Number(itemIdx)) {
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
            }
        }

        setProjectData({
            ...file,
            modelResponse
        });
    };

    const renderEditableContent = (content: string, id: string, lang: string) => {
        const isActive = activeInput === id;

        return (
            <Input
                value={content}
                onChange={(e) => handleUpdateValue(id, e.target.value)}
                onFocus={() => setActiveInput(id)}
                onBlur={() => setActiveInput(null)}
                style={{
                    height: 32,
                    width: '100%',
                    cursor: 'text',
                    background: isActive ? token.colorBgContainer : token.colorFillAlter,
                    borderColor: isActive ? token.colorPrimary : token.colorBorder
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
                                                {selectedLanguages.size > 1 && <Tag style={{ minWidth: 50, textAlign: 'center' }}>{lang}</Tag>}
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
                                                                {selectedLanguages.size > 1 && <Tag style={{ minWidth: 50, textAlign: 'center' }}>{lang}</Tag>}
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
                                                    <Flex vertical gap={8} style={{ width: 250, maxWidth: 250, minWidth: 250 }}>
                                                        {item.attributes.map((attr, attrIdx) => (
                                                            <Card
                                                                key={attrIdx}
                                                                size="small"
                                                                bordered
                                                                style={{ background: token.colorFillAlter }}
                                                            >
                                                                <Flex vertical gap={4} style={{ width: '100%' }}>
                                                                    {Array.from(selectedLanguages).map(langWithCode => {
                                                                        const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                                                        const attrName = attr.name?.[lang] || '';
                                                                        console.log('Attribute data:', { attr, lang, attrName });
                                                                        return (
                                                                            <Flex key={lang} align="center" gap={8}>
                                                                                {selectedLanguages.size > 1 && (
                                                                                    <Tag style={{ minWidth: 50, textAlign: 'center' }}>{lang}</Tag>
                                                                                )}
                                                                                <div style={{ flex: 1 }}>
                                                                                    {renderEditableContent(attrName, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-${lang}`, lang)}
                                                                                </div>
                                                                            </Flex>
                                                                        );
                                                                    })}
                                                                    <Flex align="center" gap={8}>
                                                                        <Tag style={{ minWidth: 50, textAlign: 'center' }}>Price</Tag>
                                                                        <div style={{ flex: 1 }}>
                                                                            {renderEditableContent(attr.price, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-price`, '')}
                                                                        </div>
                                                                    </Flex>
                                                                </Flex>
                                                            </Card>
                                                        ))}
                                                    </Flex>
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
