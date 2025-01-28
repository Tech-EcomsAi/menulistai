import { Button, Card, Empty, Flex, Image, message, Popconfirm, Splitter, Tag, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuEye, LuFileText, LuLayoutGrid, LuList, LuTrash } from "react-icons/lu";
import EditorContent from "./EditorContent";
import LanguageSelector from "./LanguageSelector";
import ZoomableImage from "./ZoomableImage";
import { Project, ProjectFileType } from "./type";

const { Text } = Typography;

function Editor({
    originalProjectData,
    setOriginalProjectData,
    onRemove,
    selectedLanguages,
    setSelectedLanguages,
    allLanguages,
    setAllLanguages,
    setCurrentView,
    currentView
}: {
    originalProjectData: Project,
    setOriginalProjectData: any,
    onRemove: (id: string) => void,
    selectedLanguages: Set<string>,
    setSelectedLanguages: (languages: Set<string>) => void,
    allLanguages: Set<string>,
    setAllLanguages: (languages: Set<string>) => void,
    setCurrentView: (view: number) => void,
    currentView: number
}) {
    const { token } = theme.useToken();
    const [previewFile, setPreviewFile] = useState<ProjectFileType | null>(null);
    const [projectData, setProjectData] = useState(originalProjectData);

    // Process languages in useEffect instead of during render
    useEffect(() => {
        if (!projectData.files) return;

        let hasNewLanguages = false;
        const newAllLanguages = new Set(allLanguages);
        const newSelectedLanguages = new Set(selectedLanguages);

        projectData.files.forEach(file => {
            if (file.modelResponse?.data) {
                const { languages } = file.modelResponse.data;
                languages?.forEach(lang => {
                    const langString = `${lang.name} (${lang.code})`;
                    if (!allLanguages.has(langString)) {
                        hasNewLanguages = true;
                        newAllLanguages.add(langString);
                        newSelectedLanguages.add(langString);
                    }
                });
            }
        });

        if (hasNewLanguages) {
            setAllLanguages(newAllLanguages);
            setSelectedLanguages(newSelectedLanguages);
        }
    }, [projectData.files, allLanguages, selectedLanguages, setAllLanguages, setSelectedLanguages]);

    if (!projectData.files || projectData.files.length === 0) {
        return (
            <Card>
                <Empty description="No images uploaded" />
                <Button type="primary" onClick={() => setCurrentView(1)}>Upload Files</Button>
            </Card>
        );
    }

    let totalCategories = 0;
    let totalItems = 0;

    projectData.files.forEach(file => {
        if (file.modelResponse?.data) {
            const { categories, items } = file.modelResponse.data;
            totalCategories += categories?.length || 0;
            totalItems += items?.length || 0;
        }
    });

    const handleLanguageToggle = (language: string) => {
        const newSelected = new Set(selectedLanguages);
        if (selectedLanguages.has(language)) {
            // Prevent deselecting the last language
            if (selectedLanguages.size <= 1) {
                message.warning('At least one language must remain selected');
                return;
            }
            newSelected.delete(language);
        } else {
            newSelected.add(language);
        }
        setSelectedLanguages(newSelected);
    };

    const handleUploadAndContinue = () => {
        setOriginalProjectData(projectData);
        setCurrentView(3);
    }

    const StatChip = ({ icon: Icon, label, count, color }: { icon: any, label: string, count: number, color: string }) => (
        <Tag
            style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: 12,
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                margin: '4px'
            }}
        >
            <Icon style={{ fontSize: 14, color }} />
            <span>{label}: <Text strong>{count}</Text></span>
        </Tag>
    );

    return (
        <Flex vertical gap={10} style={{ width: '100%' }}>
            {allLanguages.size > 0 && (
                <Card size="small"
                    styles={{ body: { padding: "4px 12px" } }}
                    style={{
                        width: '100%',
                        // background: token.colorBgLayout,
                        position: 'sticky',
                        top: 0,
                        zIndex: 11
                    }}>
                    <Flex gap={16} justify="space-between" align="center">
                        <Flex gap={8} wrap="wrap" align="center">
                            <Button icon={<LuArrowLeft />} onClick={() => setCurrentView(currentView - 1)}>Back</Button>
                            <StatChip icon={LuFileText} label="Files" count={projectData.files.length} color={token.colorInfo} />
                            <StatChip icon={LuLayoutGrid} label="Categories" count={totalCategories} color={token.colorWarning} />
                            <StatChip icon={LuList} label="Items" count={totalItems} color={token.colorSuccess} />
                        </Flex>

                        <Flex gap={8} wrap="wrap">
                            <LanguageSelector
                                allLanguages={allLanguages}
                                selectedLanguages={selectedLanguages}
                                onLanguageToggle={handleLanguageToggle}
                                style={{ marginTop: 0 }}
                            />
                        </Flex>
                    </Flex>
                </Card>
            )}

            {projectData.files.map((file: ProjectFileType, index: number) => (
                <Card key={index} size="small" style={{ width: '100%', background: token.colorBgLayout }} styles={{ body: { paddingBottom: 0 } }}>
                    <Splitter>
                        <Splitter.Panel defaultSize={300} min={300} max="50%" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                            <div style={{ position: "absolute", top: 8, right: 18, zIndex: 1 }}>
                                <Flex gap={8}>
                                    <Button
                                        icon={<LuEye style={{ fontSize: 16 }} />}
                                        onClick={() => setPreviewFile(file)}
                                        shape="circle"
                                    />
                                    <Popconfirm
                                        title="Delete processed image"
                                        description="This image has already been processed and tokens have been used. Are you sure you want to delete it?"
                                        okText="Yes, delete"
                                        cancelText="No, keep it"
                                        okButtonProps={{ danger: true }}
                                        open={file.charges ? undefined : false}
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            onRemove(file.uid);
                                        }}
                                    >
                                        <Button
                                            danger
                                            icon={<LuTrash style={{ fontSize: 16 }} />}
                                            shape="circle"
                                        />
                                    </Popconfirm>
                                </Flex>
                            </div>
                            <Flex style={{ width: '100%', overflow: 'auto' }}>
                                <ZoomableImage
                                    src={file.url}
                                    alt={file.name || `Image ${index + 1}`}
                                    style={{ width: '100%', minWidth: 300, paddingRight: 10 }}
                                />
                            </Flex>
                        </Splitter.Panel>
                        <Splitter.Panel>
                            <EditorContent
                                file={file}
                                setProjectData={(newData: ProjectFileType) => {
                                    setProjectData(prev => ({
                                        ...prev,
                                        files: prev.files.map(f => f.id === newData.id ? newData : f)
                                    }));
                                }}
                                selectedLanguages={selectedLanguages}
                            />
                        </Splitter.Panel>
                    </Splitter>
                </Card>
            ))}
            {previewFile && (
                <Image
                    alt={previewFile.name}
                    src={previewFile.url}
                    style={{ display: "none" }}
                    preview={{
                        onVisibleChange: (visible) => {
                            if (!visible) setPreviewFile(null)
                        },
                        visible: true,
                        src: previewFile.url,
                    }}
                />
            )}
            <Button
                onClick={handleUploadAndContinue}
                type="primary"
                icon={<LuArrowRight />}
                shape='round'
                size='large'
                style={{
                    zIndex: 1,
                    position: "fixed",
                    width: "max-content",
                    right: '50%',
                    transform: 'translateX(50%)',
                    bottom: 24
                }}
            >
                Continue
            </Button>
        </Flex>
    );
}

export default Editor;