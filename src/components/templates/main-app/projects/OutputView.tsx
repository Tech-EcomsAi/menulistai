import { Button, Card, Flex, theme } from "antd";
import { LuArrowLeft } from "react-icons/lu";
import { Project } from "./type";

interface OutputViewProps {
    currentView: number;
    setCurrentView: (view: number) => void;
    projectData: Project;
    selectedLanguages: Set<string>;
    setSelectedLanguages: (languages: Set<string>) => void;
}

function OutputView({
    currentView,
    setCurrentView,
    projectData,
    selectedLanguages,
    setSelectedLanguages
}: OutputViewProps) {
    const { token } = theme.useToken();

    return (
        <Flex vertical style={{ width: '100%' }} gap={16}>
            <Card size="small"
                styles={{ body: { padding: "4px 12px" } }}
                style={{
                    width: '100%',
                    position: 'sticky',
                    top: 0,
                    zIndex: 9999
                }}>
                <Flex gap={16} justify="space-between" align="center">
                    <Flex gap={8} wrap="wrap" align="center">
                        <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)}>Back</Button>
                    </Flex>
                </Flex>
            </Card>

            {/* Add your output view content here */}
            <div>Output Content</div>
        </Flex>
    );
}

export default OutputView;