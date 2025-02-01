import { Button, Card, Flex, theme } from "antd";
import { useState } from "react";
import { LuArrowLeft, LuFileJson, LuFileSpreadsheet, LuShare } from "react-icons/lu";
import { Project } from "./type";

interface OutputViewProps {
    currentView: number;
    setCurrentView: (view: number) => void;
    projectData: Project;
    selectedLanguages: Set<string>;
}

function B2BView({
    currentView,
    setCurrentView,
    projectData,
    selectedLanguages
}: OutputViewProps) {
    const { token } = theme.useToken();
    const [activeLanguage, setActiveLanguage] = useState(selectedLanguages[0])


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
                    <Flex gap={16}>
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuShare />}>Share</Button>
                        </Flex>
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuFileJson />}>JSON</Button>
                        </Flex>
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuFileSpreadsheet />}>Xls</Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Card>

        </Flex>
    );
}
export default B2BView