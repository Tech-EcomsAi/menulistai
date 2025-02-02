import { useAppSelector } from "@hook/useAppSelector";
import { getDarkModeState } from "@reduxSlices/clientThemeConfig";
import { removeObjRef } from "@util/utils";
import { Button, Card, Flex, Popconfirm, theme } from "antd";
import { useState } from "react";
import { LuArrowLeft, LuDownload, LuRefreshCcw, LuShare } from "react-icons/lu";
import ReactJson from 'react-json-view'; // Import ReactJson component
import { Project } from "./type";
import { handleXlsDownload } from "./utils";

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

function B2BView({ currentView, setCurrentView, originalProjectData }: OutputViewProps) {

    const { token } = theme.useToken();
    const [projectData, setProjectData] = useState(removeObjRef(originalProjectData))
    const isDarkMode = useAppSelector(getDarkModeState);
    const [isUpdated, setIsUpdated] = useState(false)

    const handleJsonEdit = (file: any, edit: JsonEditResult) => {
        try {
            // Validate edited JSON before updating state
            console.log(edit)
            JSON.parse(JSON.stringify(edit.updated_src));
            const index = projectData.files.findIndex((f) => f.uid === file.uid);
            if (index !== -1) {
                const updatedFiles = [...projectData.files];
                updatedFiles[index].modelResponse.data = edit.updated_src;
                setProjectData({ ...projectData, files: updatedFiles });
                setIsUpdated(true)
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
                    <Flex gap={16} justify="space-between" align="center">
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)} shape="circle" />
                            {isUpdated && (
                                <Popconfirm
                                    title="Reset Changes"
                                    description="Are you sure you want to reset all changes?"
                                    onConfirm={() => {
                                        setProjectData(removeObjRef(originalProjectData));
                                        setIsUpdated(false);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<LuRefreshCcw />} shape="circle" />
                                </Popconfirm>
                            )}
                        </Flex>
                        <Flex gap={8}>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuShare />}>Share</Button>
                            </Flex>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuDownload />} onClick={() => handleXlsDownload(projectData)}>JSON</Button>
                            </Flex>
                            <Flex gap={8} wrap="wrap" align="center">
                                <Button icon={<LuDownload />} onClick={() => handleXlsDownload(projectData)}>XLS</Button>
                            </Flex>
                        </Flex>
                    </Flex>

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