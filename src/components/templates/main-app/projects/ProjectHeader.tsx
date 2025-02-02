import { Button, Card, Flex, Steps, theme, Tooltip, Typography } from 'antd';
import { LuArrowLeft, LuFileEdit, LuInfo, LuScanLine, LuSmile } from 'react-icons/lu';
import { ProjectSelector } from './ProjectSelector';
import { Project, ProjectMetadata } from './type';

interface ProjectHeaderProps {
    projects: ProjectMetadata[];
    selectedProject: ProjectMetadata | null;
    currentView: number;
    setSelectedProject: (project: ProjectMetadata | null) => void;
    setProjects: (projects: ProjectMetadata[]) => void;
    projectData: Project | null;
    setProjectData: (updater: (prev: Project | null) => Project | null) => void;
    setCurrentView: (view: number) => void;
}

export function ProjectHeader({
    projects,
    selectedProject,
    currentView,
    setSelectedProject,
    setProjects,
    projectData,
    setProjectData,
    setCurrentView
}: ProjectHeaderProps) {
    const { token } = theme.useToken();
    return (
        <Card size='small' style={{ width: '100%', background: token.colorBgBase }}>
            <Flex justify='space-between' align='center'>

                {currentView === 1 ? (
                    <ProjectSelector
                        setSelectedProject={setSelectedProject}
                        setProjects={setProjects}
                        projects={projects}
                        selectedProject={selectedProject}
                        onProjectSelect={(projectMetadata) => {
                            const project = projects.find(p => p.projectId === projectMetadata.projectId);
                            if (project) {
                                setSelectedProject(project);
                            }
                        }}
                    />
                ) :
                    (<Button icon={<LuArrowLeft />} type='text' onClick={() => setCurrentView(currentView - 1)}>Back</Button>)}

                <Steps
                    current={currentView - 1}
                    items={[
                        {
                            icon: <></>,
                            title: <Tooltip title="Upload your menu images">
                                <Flex gap={8} align='center' justify='center'>
                                    <LuScanLine fontSize={22} color={currentView >= 1 ? token.colorPrimary : undefined} />
                                    <Typography.Text style={{ lineHeight: 'unset', color: currentView >= 1 ? token.colorPrimary : undefined }}>Upload</Typography.Text>
                                </Flex>
                            </Tooltip>
                        },
                        {
                            icon: <></>,
                            title: <Tooltip title="Edit and verify menu items">
                                <Flex gap={8} align='center' justify='center'>
                                    <LuFileEdit fontSize={22} color={currentView >= 2 ? token.colorPrimary : undefined} />
                                    <Typography.Text style={{ lineHeight: 'unset', color: currentView >= 2 ? token.colorPrimary : undefined }}>Edit</Typography.Text>
                                </Flex>
                            </Tooltip>
                        },
                        {
                            icon: <></>,
                            title: <Tooltip title="View and customize your menu">
                                <Flex gap={8} align='center' justify='center'>
                                    <LuSmile fontSize={22} color={currentView >= 3 ? token.colorPrimary : undefined} />
                                    <Typography.Text style={{ lineHeight: 'unset', color: currentView >= 3 ? token.colorPrimary : undefined }}>Preview</Typography.Text>
                                </Flex>
                            </Tooltip>
                        },
                    ]}
                    style={{ width: '100%', maxWidth: 400 }}
                />
                <Flex>
                    {projectData?.files?.length > 0 ? (
                        <Button
                            type='text'
                            onClick={() => {
                                if (selectedProject) {
                                    // Reset files in the current project
                                    setProjectData(prev => ({ ...prev, files: [] }));
                                }
                                // Reset to upload view
                                setCurrentView(1);
                            }}>Start Over</Button>
                    ) : <Button icon={<LuInfo />}></Button>}
                </Flex>
            </Flex>
        </Card>
    );
}
