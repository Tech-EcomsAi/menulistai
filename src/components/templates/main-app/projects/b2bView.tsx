import { useAppSelector } from "@hook/useAppSelector";
import { getDarkModeState } from "@reduxSlices/clientThemeConfig";
import { Button, Card, Flex, theme } from "antd";
import { useState } from "react";
import { LuArrowLeft, LuFileJson, LuFileSpreadsheet, LuShare } from "react-icons/lu";
import ReactJson from 'react-json-view'; // Import ReactJson component
import { Project } from "./type";

interface OutputViewProps {
    currentView: number;
    setCurrentView: (view: number) => void;
    originalProjectData: Project;
}

interface JsonEditResult {
    updated_src: object;
    name: string;
    namespace: string[];
    existing_value: any;
    new_value: any;
}

function B2BView({
    currentView,
    setCurrentView,
    originalProjectData,
}: OutputViewProps) {
    const { token } = theme.useToken();
    const [projectData, setProjectData] = useState(originalProjectData)
    const isDarkMode = useAppSelector(getDarkModeState);

    const handleJsonEdit = (file: any, edit: JsonEditResult) => {
        try {
            // Validate edited JSON before updating state
            JSON.parse(JSON.stringify(edit.updated_src));
            const index = projectData.files.findIndex((f) => f.uid === file.uid);
            if (index !== -1) {
                const updatedFiles = [...projectData.files];
                updatedFiles[index].modelResponse.data = edit.updated_src;
                setProjectData({ ...projectData, files: updatedFiles });
            }
            // Consider adding Redux dispatch here if needed
        } catch (error) {
            console.error('Invalid JSON edit:', error);
        }
    }

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
                <Flex vertical gap={4}>
                    <Card size="small">
                        <Flex gap={16} justify="space-between" align="center">
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)} shape="circle" />
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
                    </Card>

                    <Card size="small" styles={{ body: { padding: "0" } }} style={{ width: '100%', height: "100%", maxHeight: "calc(100vh - 146px)", overflow: 'auto', background: token.colorBgLayout }}>
                        <Flex justify="space-between" align="flex-start" gap={10} vertical style={{ width: '100%' }}>
                            {projectData.files.map((file) => (
                                <ReactJson
                                    key={file.uid}
                                    src={file.modelResponse?.data}
                                    theme={isDarkMode ? "summerfruit" : "summerfruit:inverted"}
                                    name={file.name}
                                    onEdit={(edit: any) => handleJsonEdit(file, edit)}
                                    style={{ padding: '16px', width: '100%' }}
                                    enableClipboard
                                    displayDataTypes
                                />
                            ))}
                        </Flex>
                    </Card>
                </Flex>
            </Card>
        </Flex>
    );
}
export default B2BView