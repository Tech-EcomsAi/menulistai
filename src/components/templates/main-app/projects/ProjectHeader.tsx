import { Button, Card, Flex, Steps, theme } from 'antd';
import { LuArrowLeft, LuScanLine, LuSmile, LuUpload } from 'react-icons/lu';
import { ProjectSelector } from './ProjectSelector';
import { Project, ProjectMetadata } from './type';

interface ProjectHeaderProps {
    projects: ProjectMetadata[];
    selectedProject: ProjectMetadata | null;
    currentView: number;
    setSelectedProject: (project: ProjectMetadata | null) => void;
    setProjects: (projects: ProjectMetadata[]) => void;
    setProjectData: (updater: (prev: Project | null) => Project | null) => void;
    setCurrentView: (view: number) => void;
}

export function ProjectHeader({
    projects,
    selectedProject,
    currentView,
    setSelectedProject,
    setProjects,
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
                ) : (<Button icon={<LuArrowLeft />} type='text' onClick={() => setCurrentView(currentView - 1)}>Back</Button>)}

                <Steps
                    current={currentView - 1}
                    items={[
                        { icon: <LuUpload />, title: 'Upload' },
                        { icon: <LuScanLine />, title: 'Edit' },
                        { icon: <LuSmile />, title: 'Design' },
                    ]}
                    style={{ width: '100%', maxWidth: 400 }}
                />
                <Button onClick={() => {
                    if (selectedProject) {
                        // Reset files in the current project
                        setProjectData(prev => ({ ...prev, files: [] }));
                    }
                    // Reset to upload view
                    setCurrentView(1);
                }}>Start Over</Button>
            </Flex>
        </Card>
    );
}
