import { LOGO_SMALL } from "@constant/common";
import { Button, Card, Flex, Select, theme, Typography } from "antd";
import { useState } from "react";
import { LuArrowLeft, LuEye, LuMonitor, LuShare, LuSmartphone } from "react-icons/lu";
import { Project } from "./type";

interface OutputViewProps {
    currentView: number;
    setCurrentView: (view: number) => void;
    projectData: Project;
}

function B2CView({
    currentView,
    setCurrentView,
    projectData
}: OutputViewProps) {
    const { token } = theme.useToken();
    const [activeDeviceType, setActiveDeviceType] = useState<'desktop' | 'mobile'>('desktop');
    const [activeLanguage, setActiveLanguage] = useState(projectData.languages[0]);

    const renderItemWithAttributes = (item: any, lang: string) => {
        return (
            <Flex vertical gap={8}>
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                    <div style={{ fontWeight: 500 }}>{item.name?.[lang]}</div>
                    {!item.attributes?.length && <div>{item.price}</div>}
                </Flex>
                {item.attributes?.length > 0 && (
                    <Flex vertical gap={4} style={{ paddingLeft: 16 }}>
                        {item.attributes.map((attr: any, idx: number) => (
                            <Flex key={idx} justify="space-between" align="center" style={{ width: '100%' }}>
                                <div>{attr.name?.[lang]}</div>
                                <div>{attr.price}</div>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        );
    };

    const renderCategory = (category: any, lang: string, file: any) => {
        const items = file.modelResponse?.data.items.filter(item => item.category === category.id) || [];

        return (
            <Flex vertical gap={16} style={{ width: '100%' }}>
                <div style={{
                    fontSize: activeDeviceType === 'desktop' ? 20 : 18,
                    fontWeight: 600,
                    borderBottom: `1px solid ${token.colorBorder}`,
                    paddingBottom: 8
                }}>
                    {category.name?.[lang]}
                </div>
                <Flex vertical gap={12}>
                    {items.map((item, idx) => (
                        <div key={idx} style={{
                            padding: 12,
                            background: token.colorFillTertiary,
                            borderRadius: token.borderRadius
                        }}>
                            {renderItemWithAttributes(item, lang)}
                        </div>
                    ))}
                </Flex>
            </Flex>
        );
    };

    return (
        <Flex vertical style={{ width: '100%' }} gap={10}>
            <Card
                bordered={false}
                styles={{ body: { padding: "6px" } }}
                style={{
                    width: '100%',
                    position: 'sticky',
                    top: 0,
                    zIndex: 11
                }}>
                <Flex gap={16} justify="space-between" align="center">
                    <Flex gap={8} wrap="wrap" align="center">
                        <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)} shape="circle" />
                    </Flex>
                    <Flex gap={8} wrap="wrap" align="center">
                        <Button type={activeDeviceType === 'desktop' ? 'primary' : 'default'} onClick={() => setActiveDeviceType('desktop')} icon={<LuMonitor />} shape="circle" />
                        <Button type={activeDeviceType === 'mobile' ? 'primary' : 'default'} onClick={() => setActiveDeviceType('mobile')} icon={<LuSmartphone />} shape="circle" />
                    </Flex>
                    <Flex gap={8} wrap="wrap" align="center">
                        <Button icon={<LuEye />}>Preview</Button>
                    </Flex>
                    <Flex gap={8} wrap="wrap" align="center">
                        <Button icon={<LuShare />}>Share</Button>
                    </Flex>
                </Flex>
            </Card>
            <div style={{
                maxWidth: activeDeviceType === 'mobile' ? 400 : '100%',
                margin: '0 auto',
                width: '100%',
                height: 'calc(100vh - 125px)',
                overflowY: 'scroll',
                background: token.colorBgContainer,
                padding: activeDeviceType === 'mobile' ? '16px' : '24px',
                border: `2px solid ${token.colorTextBase}`,
                boxShadow: token.boxShadow,
                borderRadius: 20
            }}>
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 24,
                        padding: activeDeviceType === 'mobile' ? '8px 0' : '12px 0',
                        borderBottom: `1px solid ${token.colorBorder}`
                    }}
                >
                    <Flex align="center" gap={8}>
                        <img
                            src={LOGO_SMALL}
                            alt="Logo"
                            style={{
                                height: activeDeviceType === 'mobile' ? 24 : 32,
                                width: 'auto',
                                objectFit: "none"
                            }}
                        />
                        <Typography.Title
                            level={activeDeviceType === 'mobile' ? 5 : 4}
                            style={{ margin: 0 }}
                        >
                            MenuList AI
                        </Typography.Title>
                    </Flex>

                    {projectData.languages.size > 1 && (
                        <Select
                            style={{
                                width: activeDeviceType === 'mobile' ? 120 : 160
                            }}
                            value={activeLanguage}
                            onChange={(value) => setActiveLanguage(value)}
                        >
                            {Array.from(projectData.languages).map(lang => (
                                <Select.Option key={lang} value={lang}>
                                    {lang.split(' ')[1].replace(/[()]/g, '')}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Flex>

                {(() => {
                    const lang = activeLanguage?.split(' ')[1].replace(/[()]/g, '');
                    return (
                        <Flex key={lang} vertical gap={32}>
                            {projectData.files?.map((file, fileIdx) => (
                                file.modelResponse?.data.categories.map((category, idx) => (
                                    <div key={`${fileIdx}-${idx}`}>
                                        {renderCategory(category, lang, file)}
                                    </div>
                                ))
                            ))}
                        </Flex>
                    );
                })()}
            </div>
        </Flex>
    );
}
export default B2CView