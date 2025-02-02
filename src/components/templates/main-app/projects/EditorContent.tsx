import { Button, Card, Collapse, Empty, Flex, Input, Popconfirm, Space, Tag, Tooltip, Typography, theme } from "antd";
import { useState } from "react";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { ProjectFileType } from "./type";

const { Text } = Typography;

interface EditorContentProps {
    file: ProjectFileType;
    setProjectData: any;
    selectedLanguages: string[];
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
                selectedLanguages.map(langWithCode => {
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

    const handleDeleteAttribute = (categoryId: number, itemId: number, attrIdx: number) => {
        const modelResponse = { ...file.modelResponse };
        const item = modelResponse.data.items.find(item => item.category === categoryId && item.id === itemId);

        if (item?.attributes) {
            item.attributes = item.attributes.filter((_, index) => index !== attrIdx);
        }

        setProjectData({
            ...file,
            modelResponse
        });
    };

    const handleDeleteCategory = (categoryId: number) => {
        const modelResponse = { ...file.modelResponse };
        // Remove the category
        modelResponse.data.categories = modelResponse.data.categories.filter(cat => cat.id !== categoryId);
        // Remove all items belonging to this category
        modelResponse.data.items = modelResponse.data.items.filter(item => item.category !== categoryId);

        setProjectData({
            ...file,
            modelResponse
        });
    };

    const handleDeleteItem = (categoryId: number, itemIdx: number) => {
        const modelResponse = { ...file.modelResponse };
        modelResponse.data.items = modelResponse.data.items.filter((item, index) =>
            !(item.category === categoryId && index === itemIdx)
        );
        setProjectData({
            ...file,
            modelResponse
        });
    };

    const renderEditableContent = (content: string, id: string, lang: string) => {
        const isActive = activeInput === id;

        const getPlaceholder = (id: string) => {
            if (id.includes('category')) return `Category Name`;
            if (id.includes('item') && id.includes('attr') && id.includes('price')) return `A. Price`;
            if (id.includes('item') && id.includes('attr')) return `Attribute`;
            if (id.includes('item') && id.includes('price')) return `Price`;
            if (id.includes('item')) return `Item Name`;
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
                selectedLanguages.map(langWithCode => {
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

    const LanguageTag = ({ lang }: { lang: string }) => {
        return (
            <Tag color={token.colorPrimary}
                style={{
                    minWidth: 50,
                    textAlign: 'center',
                    lineHeight: "26px",
                    fontSize: 13,
                    borderRadius: 13,
                    background: token.colorPrimaryBg,
                    border: `1px solid ${token.colorPrimaryBorder}`,
                    color: token.colorPrimary,
                }}>{lang}</Tag>
        )
    }

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
                                            <Tooltip title="Delete category">
                                                <Popconfirm
                                                    title="Delete Category"
                                                    description="Are you sure you want to delete this category and all its items?"
                                                    okText="Delete"
                                                    cancelText="Cancel"
                                                    okButtonProps={{ danger: true }}
                                                    onConfirm={() => handleDeleteCategory(category.id)}
                                                >
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        danger
                                                        icon={<LuTrash2 />}
                                                    />
                                                </Popconfirm>
                                            </Tooltip>
                                        </Flex>
                                        {selectedLanguages.map(langWithCode => {
                                            const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                            const name = category.name?.[lang] || '';
                                            return (
                                                <Flex key={langWithCode} align="center" gap={8}>
                                                    {selectedLanguages.length > 1 && <LanguageTag lang={lang} />}
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
                                                size="small"
                                                bordered
                                                hoverable={false}
                                                key={itemIdx}
                                                style={{ width: '100%', boxShadow: "", background: token.colorFillAlter }}
                                            >
                                                <Flex vertical={Boolean(item.attributes?.length)} style={{ width: '100%' }} gap={12} justify="flex-start" align="flex-start">
                                                    <Flex justify="flex-start" align="flex-start" gap={4}>
                                                        <Typography.Text type="secondary" style={{ minWidth: "max-content" }}>Item {itemIdx + 1}</Typography.Text>
                                                        <Tooltip title="Delete item">
                                                            <Popconfirm
                                                                title="Delete Item"
                                                                description={`Are you sure you want to delete Item ${itemIdx + 1}?`}
                                                                okText="Delete"
                                                                cancelText="Cancel"
                                                                okButtonProps={{ danger: true }}
                                                                onConfirm={() => handleDeleteItem(category.id, itemIdx)}
                                                            >
                                                                <Button
                                                                    type="text"
                                                                    size="small"
                                                                    danger
                                                                    icon={<LuTrash2 />}
                                                                />
                                                            </Popconfirm>
                                                        </Tooltip>
                                                    </Flex>
                                                    <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                                        {selectedLanguages.map(langWithCode => {
                                                            const lang = langWithCode.split(' ')[1].replace(/[()]/g, '');
                                                            const name = item.name?.[lang] || '';
                                                            return Boolean(item.attributes?.length) ? (
                                                                <Card
                                                                    key={langWithCode}
                                                                    size="small"
                                                                    bordered
                                                                    style={{ background: token.colorFillAlter }}
                                                                >
                                                                    <Flex key={langWithCode} align="flex-start" gap={8}>
                                                                        {selectedLanguages.length > 1 && <LanguageTag lang={lang} />}
                                                                        <Flex gap={12} style={{ flex: 1 }} align="flex-start" justify="space-between">
                                                                            <Flex flex={1} style={{ width: "100%" }}>
                                                                                {renderEditableContent(name, `item-${categoryIdx}-${itemIdx}-${lang}`, lang)}
                                                                            </Flex>
                                                                            <Flex vertical gap={4}>
                                                                                <Flex gap={8} vertical style={{ width: "auto", maxWidth: "max-content" }}>
                                                                                    {item.attributes.map((attr, attrIdx) => (
                                                                                        <Flex key={attrIdx} gap={4} style={{ width: '100%' }}>
                                                                                            <div style={{ flex: 1, width: 100, maxWidth: 100, minWidth: 100 }}>
                                                                                                {renderEditableContent(attr.name?.[lang] || '', `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-${lang}`, lang)}
                                                                                            </div>
                                                                                            <Flex align="center" gap={4}>
                                                                                                <div style={{ flex: 1, width: 80, maxWidth: 80, minWidth: 80 }}>
                                                                                                    {renderEditableContent(attr.price, `item-${categoryIdx}-${itemIdx}-attr-${attrIdx}-price`, '')}
                                                                                                </div>
                                                                                                <Tooltip title="Delete attribute">
                                                                                                    <Popconfirm
                                                                                                        title="Delete Attribute"
                                                                                                        description={`Are you sure you want to delete Attribute ${attrIdx + 1}?`}
                                                                                                        okText="Delete"
                                                                                                        cancelText="Cancel"
                                                                                                        okButtonProps={{ danger: true }}
                                                                                                        onConfirm={() => handleDeleteAttribute(category.id, item.id, attrIdx)}
                                                                                                    >
                                                                                                        <Button
                                                                                                            type="text"
                                                                                                            size="small"
                                                                                                            danger
                                                                                                            icon={<LuX />}
                                                                                                        />
                                                                                                    </Popconfirm>
                                                                                                </Tooltip>
                                                                                            </Flex>
                                                                                        </Flex>
                                                                                    ))}
                                                                                </Flex>
                                                                            </Flex>
                                                                        </Flex>
                                                                    </Flex>
                                                                </Card>
                                                            ) : (
                                                                <Flex key={langWithCode} align="flex-start" gap={8}>
                                                                    {selectedLanguages.length > 1 && <LanguageTag lang={lang} />}
                                                                    <Flex gap={12} style={{ flex: 1 }} align="flex-start" justify="space-between">
                                                                        <Flex flex={1} style={{ width: "100%" }}>
                                                                            {renderEditableContent(name, `item-${categoryIdx}-${itemIdx}-${lang}`, lang)}
                                                                        </Flex>
                                                                        <Flex style={{ width: 80 }}>
                                                                            {renderEditableContent(item.price || '', `item-${categoryIdx}-${itemIdx}-price`, '')}
                                                                        </Flex>
                                                                    </Flex>
                                                                </Flex>
                                                            );
                                                        })}
                                                    </Space>
                                                    <Flex justify="flex-end" style={{ width: 'auto', maxWidth: 'max-content', minWidth: Boolean(item.attributes?.length) ? "100%" : 'min-content' }}>
                                                        <Button
                                                            block
                                                            type="dashed"
                                                            icon={<LuPlus />}
                                                            onClick={() => handleAddAttribute(category.id, item.id)}
                                                            style={{ width: "max-content", height: 'auto', minHeight: 32 }}
                                                        > Attribute
                                                        </Button>
                                                    </Flex>
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
