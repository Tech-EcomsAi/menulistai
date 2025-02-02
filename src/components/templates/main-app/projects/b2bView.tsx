import { Button, Card, Flex, theme } from "antd";
import { useState } from "react";
import { LuArrowLeft, LuFileJson, LuFileSpreadsheet, LuShare } from "react-icons/lu";
import LanguageSelector from "./LanguageSelector";
import { Project } from "./type";

interface OutputViewProps {
    currentView: number;
    setCurrentView: (view: number) => void;
    projectData: Project;
}

function B2BView({
    currentView,
    setCurrentView,
    projectData
}: OutputViewProps) {
    const { token } = theme.useToken();
    const [activeLanguages, setActiveLanguages] = useState(new Set(projectData.languages))

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
                <Flex vertical gap={14}>
                    <Flex gap={16} justify="space-between" align="center">
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)} shape="circle" />
                            <Flex gap={8} wrap="wrap">
                                <LanguageSelector
                                    allLanguages={projectData.languages}
                                    selectedLanguages={activeLanguages}
                                    onLanguageToggle={setActiveLanguages}
                                    style={{ marginTop: 0 }}
                                />
                            </Flex>
                        </Flex>
                        <Flex gap={8}>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuShare />}>Share</Button>
                            </Flex>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuFileJson />}>JSON</Button>
                            </Flex>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuFileSpreadsheet />}>XLS</Button>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Card size="small" style={{ width: '100%' }}>

                    </Card>
                </Flex>
            </Card>
        </Flex>
    );
}
export default B2BView