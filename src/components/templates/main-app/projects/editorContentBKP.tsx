import { Button, Card, Collapse, Empty, Flex, Input, Modal, Space, Tag, Typography, theme } from "antd";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
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

    const handleAddAttribute = (categoryId: number, itemId: number) => {
        const modelResponse = { ...file.modelResponse };
        const item = modelResponse.data.items.find(item => item.category === categoryId && item.id === itemId);

        if (!item) return;

        if (!item.attributes) {
            item.attributes = [];
        }

        // Create a new attribute with default values for all languages
        const newAttribute = {
            id: item.attributes.length + 1,
            name: Object.fromEntries(
                Array.from(selectedLanguages).map(langWithCode => {
                    const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                    return [lang, ''];
                })
            ),
            price: ''
        };

        item.attributes.push(newAttribute);

        setProjectData({
            ...file,
            modelResponse
        });
    };

    const handleAddItem = (categoryIdx: number) => {
        const modelResponse = { ...file.modelResponse };

        // Create a new item with default values for all languages
        const newItem = {
            id: modelResponse.data.items.length + 1,
            name: Object.fromEntries(
                Array.from(selectedLanguages).map(langWithCode => {
                    const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                    return [lang, ''];
                })
            ),
            category: categoryIdx,
            price: '',
            attributes: []
        };

        modelResponse.data.items.push(newItem);

        setProjectData({
            ...file,
            modelResponse
        });
    };

    const handleDeleteAttribute = (categoryId: number, itemIdx: number, attrIdx: number) => {
        Modal.confirm({
            title: 'Delete Attribute',
            content: `Are you sure you want to delete Attribute ${attrIdx + 1}?`,
            okText: 'Delete',
            okButtonProps: { danger: true },
            onOk: () => {
                const modelResponse = { ...file.modelResponse };
                const item = modelResponse.data.items.find(item => item.category === categoryId && item.id === itemIdx);

                if (item?.attributes) {
                    item.attributes = item.attributes.filter((_, index) => index !== attrIdx);
                }

                setProjectData({
                    ...file,
                    modelResponse
                });
            }
        });
    };

    const handleDeleteItem = (categoryId: number, itemIdx: number) => {
        Modal.confirm({
            title: 'Delete Item',
            content: `Are you sure you want to delete Item ${itemIdx + 1}?`,
            okText: 'Delete',
            okButtonProps: { danger: true },
            onOk: () => {
                const modelResponse = { ...file.modelResponse };
                modelResponse.data.items = modelResponse.data.items.filter((item, index) =>
                    !(item.category === categoryId && index === itemIdx)
                );
                setProjectData({
                    ...file,
                    modelResponse
                });
            }
        });
    };

    const handleDeleteCategory = (categoryId: number) => {
        Modal.confirm({
            title: 'Delete Category',
            content: 'Are you sure you want to delete this category and all its items?',
            okText: 'Delete',
            okButtonProps: { danger: true },
            onOk: () => {
                const modelResponse = { ...file.modelResponse };
                // Remove the category
                modelResponse.data.categories = modelResponse.data.categories.filter(cat => cat.id !== categoryId);
                // Remove all items belonging to this category
                modelResponse.data.items = modelResponse.data.items.filter(item => item.category !== categoryId);

                setProjectData({
                    ...file,
                    modelResponse
                });
            }
        });
    };

    const renderEditableContent = (content: string, id: string, lang: string) => {
        const isActive = activeInput === id;

        const getPlaceholder = (id: string) => {
            if (id.includes('category')) return `Category`;
            if (id.includes('item') && id.includes('attr')) return `Attribute`;
            if (id.includes('item') && id.includes('price')) return `Price`;
            if (id.includes('item')) return `Item`;
            return '';
        };

        return (
            <Input
                value={content}
                placeholder={getPlaceholder(id)}
                onChange={(e) => handleUpdateValue(id, e.target.value)}
                onFocus={(e) => {
                    setActiveInput(id);
                    e.stopPropagation();
                }}
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

    const handleAddCategory = () => {
        const modelResponse = { ...file.modelResponse };

        const newCategory = {
            id: modelResponse.data.categories.length + 1,
            name: Object.fromEntries(
                Array.from(selectedLanguages).map(langWithCode => {
                    const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                    return [lang, ''];
                })
            )
        };

        modelResponse.data.categories.push(newCategory);

        setProjectData({
            ...file,
            modelResponse
        });
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
                <Flex vertical gap={10}>
                    <Collapse
                        defaultActiveKey={['0']}
                        style={{ width: '100%' }}
                        items={file.modelResponse.data.categories.map((category, categoryIdx) => {
                            const categoryItems = file.modelResponse.data.items.filter(item => item.category === category.id);
                            return {
                                key: categoryIdx,
                                label: (
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Flex justify="flex-start" gap={4} align="center">
                                            <Text strong>Category {categoryIdx + 1}</Text>
                                            <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<LuTrash2 />}
                                                onClick={() => handleDeleteCategory(category.id)}
                                            />
                                        </Flex>
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
                                                <Flex vertical={Boolean(item.attributes?.length)} style={{ width: '100%' }} gap={12} justify="flex-start" align="flex-start">
                                                    <Flex justify="flex-start" align="center" gap={4}>
                                                        <Typography.Text type="secondary" style={{ minWidth: "max-content" }}>Item {itemIdx + 1}</Typography.Text>
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            danger
                                                            icon={<LuTrash2 />}
                                                            onClick={() => handleDeleteItem(category.id, itemIdx)}
                                                        />
                                                    </Flex>
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
                                                    {Boolean(item.attributes?.length) ? (
                                                        <Flex gap={8} wrap style={item.attributes.length > 1 ? { width: "auto", maxWidth: "max-content", minWidth: 250 } : { width: 250, maxWidth: 250, minWidth: 250 }}>
                                                            {item.attributes.map((attr, attrIdx) => (
                                                                <Card
                                                                    key={attrIdx}
                                                                    size="small"
                                                                    bordered
                                                                    style={{ background: token.colorFillAlter }}
                                                                >
                                                                    <Flex vertical={selectedLanguages.size > 1} gap={4} style={{ width: '100%' }}>
                                                                        <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
                                                                            <Typography.Text type="secondary" style={{ minWidth: "max-content" }}>Attribute {attrIdx + 1}</Typography.Text>
                                                                            <Button
                                                                                type="text"
                                                                                size="small"
                                                                                danger
                                                                                icon={<LuTrash2 />}
                                                                                onClick={() => handleDeleteAttribute(category.id, item.id, attrIdx)}
                                                                            />
                                                                        </Flex>
                                                                        {Array.from(selectedLanguages).map(langWithCode => {
                                                                            const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                                                            const attrName = attr.name?.[lang] || '';
                                                                            return (
                                                                                <Flex key={lang} align="center" gap={8}>
                                                                                    {selectedLanguages.size > 1 && (
                                                                                        <Tag style={{ minWidth: 50, textAlign: 'center' }}>{lang}</Tag>
                                                                                    )}
                                                                                    <div style={{ flex: 1, width: 150, maxWidth: 150, minWidth: 150 }}>
                                                                                        {renderEditableContent(attrName, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-${lang}`, lang)}
                                                                                    </div>
                                                                                </Flex>
                                                                            );
                                                                        })}
                                                                        <Flex align="center" gap={8}>
                                                                            {selectedLanguages.size > 1 && <Tag style={{ minWidth: 50, textAlign: 'center' }}>Price</Tag>}
                                                                            <div style={{ flex: 1, width: 150, maxWidth: 150, minWidth: 150 }}>
                                                                                {renderEditableContent(attr.price, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-price`, '')}
                                                                            </div>
                                                                        </Flex>
                                                                    </Flex>
                                                                </Card>
                                                            ))}
                                                            <Button
                                                                type="dashed"
                                                                icon={<LuPlus />}
                                                                onClick={() => handleAddAttribute(category.id, item.id)}
                                                                style={{ width: "max-content", height: 'auto', minHeight: 32 }}
                                                            >
                                                                Add Attribute
                                                            </Button>
                                                        </Flex>
                                                    ) : (
                                                        <Flex style={{ width: '100%' }} gap={8}>
                                                            <Flex style={{ minWidth: 100, width: 100 }}>
                                                                {renderEditableContent(item.price || '', `item-${categoryIdx}-${itemIdx}-price`, '')}
                                                            </Flex>
                                                            <Button
                                                                type="dashed"
                                                                icon={<LuPlus />}
                                                                onClick={() => handleAddAttribute(category.id, item.id)}
                                                                style={{ width: "max-content", height: 'auto', minHeight: 32 }}
                                                            >
                                                                Add Attribute
                                                            </Button>
                                                        </Flex>
                                                    )}
                                                </Flex>
                                            </Card>
                                        ))}
                                        <Button
                                            type="dashed"
                                            icon={<LuPlus />}
                                            onClick={() => handleAddItem(category.id)}
                                            style={{ width: '100%', marginTop: 8 }}
                                        >
                                            Add Item
                                        </Button>
                                    </Space>
                                )
                            };
                        })}
                    />
                    <Button
                        type="dashed"
                        icon={<LuPlus />}
                        onClick={handleAddCategory}
                        style={{ width: '100%' }}
                    >
                        Add Category
                    </Button>
                </Flex>
            ) : (
                <Empty description="No model response available" />
            )}
        </Card>
    );
}

export default EditorContent;
