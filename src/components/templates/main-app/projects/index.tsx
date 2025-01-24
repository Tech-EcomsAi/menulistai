'use client';

import { getProjectData, getProjects } from '@database/projects';
import { getBase64, removeObjRef } from '@util/utils';
import { Button, Card, Empty, Flex, Steps, Typography, Upload, message, theme } from 'antd';
import type { UploadFileStatus, UploadProps } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';
import { LuScanLine, LuSmile, LuUpload } from 'react-icons/lu';
import { DummyModelResponses } from './data';
import Editor from './Editor';
import { FileList } from './FileList';
import { ProjectSelector } from './ProjectSelector';
import { Project, ProjectMetadata } from './type';

const { Dragger } = Upload;
const { Text } = Typography;
const { useToken } = theme;

function ProjectsPage() {
    const { token } = useToken();
    const [projects, setProjects] = useState<ProjectMetadata[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectMetadata | null>(null);
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [fileProcessingId, setFileProcessingId] = useState(null)
    const [currentView, setCurrentView] = useState(1);
    //1: File Upload view
    //2: Response editor view
    //3: Catalogue view
    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject?.projectId) {
            fetchProjectData(selectedProject.projectId);
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);
            if (fetchedProjects.length > 0) {
                setSelectedProject(fetchedProjects[0]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            message.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectData = async (projectId: string) => {
        try {
            const projectData = await getProjectData(projectId);
            setProjectData(projectData);
        } catch (error) {
            console.error('Error fetching project data:', error);
            message.error('Failed to fetch project data');
        } finally {
            setLoading(false);
        }
    };

    const processFile = async (file: any, i: any) => {
        const startTime = Date.now();

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        const dummy = {
            uid: file.uid,
            name: file.name,
            size: file.size,
            type: file.type,
            active: true,
            deleted: false,
            deletedAt: null,
            index: 0,
            url: file.url,
            modelResponse: DummyModelResponses[i],
            inputToken: 100,
            ouputToken: 1000,
            charges: 10,
            chargePerToken: 10,
            processingTime
        }
        return dummy
    }

    const handleUploadAndContinue = async () => {
        if (!selectedProject) {
            message.error('Please select a project first');
            return;
        }

        try {
            const projectDataCopy: Project = removeObjRef(projectData)
            if (projectDataCopy?.files?.length) {
                for (let i = 0; i < projectDataCopy.files.length; i++) {
                    const file = projectDataCopy.files[i];
                    if (file.url?.includes('base64')) {
                        setFileProcessingId(file.uid)
                        const uploadedFileData = await processFile(file, i);
                        projectDataCopy.files[i] = { ...uploadedFileData };
                        setProjectData(projectDataCopy);
                    }
                }
            }
            setCurrentView(2);
            setFileProcessingId(null);
            // const updatedProject = await updateProject({ ...projectData, projectId: selectedProject.projectId });
            // if (updatedProject) {
            // setProjectData(updatedProject);
            message.success('All files processed successfully');
            // }
        } catch (error) {
            console.error('Error updating project data:', error);
            message.error('Failed to update project data');
        } finally {
            setFileProcessingId(null);
        }
    };

    const handleRemove = async (id: string) => {
        const newFiles = projectData?.files?.filter(f => f.uid !== id);
        const projectDataCopy: Project = removeObjRef(projectData)
        projectDataCopy.files = newFiles;
        setProjectData(projectDataCopy);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        fileList: projectData?.files?.map((file) => ({
            uid: file.uid || file.url || String(Math.random()),  // Use src/url as id or generate random
            name: file.name || 'Untitled',
            size: file.size,
            type: file.type,
            status: 'done' as UploadFileStatus,
            url: file.url,
        })),
        accept: '.jpg,.jpeg,.png,.pdf',
        beforeUpload: (file) => {
            const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);

            if (!isValidType) {
                message.error(`${file.name} is not a valid file type`);
                return Upload.LIST_IGNORE;
            }

            // Check for duplicate files
            const isDuplicate = projectData?.files?.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );

            if (isDuplicate) {
                message.error(`${file.name} has already been uploaded`);
                return Upload.LIST_IGNORE;
            }

            return false;
        },
        onChange: async (info) => {
            const newFileList = [...info.fileList];

            // Generate preview URLs for new files
            await Promise.all(
                newFileList.map(async (file) => {
                    if (!file.url && !file.preview && file.originFileObj && file.type?.startsWith('image/')) {
                        file.preview = await getBase64(file.originFileObj);
                    }
                })
            );

            const projectDataCopy: Project = removeObjRef(projectData)
            projectDataCopy.files = newFileList.map((file) => ({
                uid: file.uid,
                name: file.name,
                size: file.size,
                type: file.type,
                url: file.preview || file.url
            }));
            setProjectData(projectDataCopy);
        },
        itemRender: (file, fileid) => null
    };

    if (loading) {
        return <Card loading={true} />;
    }

    return (
        <>
            <Flex vertical gap={10}>
                <Card size='small'>
                    <Flex justify='space-between' align='center'>
                        <ProjectSelector
                            setSelectedProject={setSelectedProject}
                            setProjects={setProjects}
                            projects={projects}
                            selectedProject={selectedProject || null}
                            onProjectSelect={(projectMetadata) => {
                                const project = projects.find(p => p.projectId === projectMetadata.projectId);
                                if (project) {
                                    setSelectedProject(project);
                                }
                            }}
                        />
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
                <Card >
                    <Flex vertical gap={30} style={{ width: '100%' }} align='center' justify='flex-start'>


                        {currentView == 1 && <>
                            <Flex gap={30} vertical align='center' justify='center' style={{ width: '100%' }}>
                                <Dragger {...uploadProps}>
                                    <Flex gap={16} align='center' justify='center' style={{ width: '100%' }}>
                                        <Empty description="" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </Flex>
                                    <p className="ant-upload-text" style={{ fontSize: 16, marginBottom: 8 }}>
                                        Click or drag files to this area to upload (JPG, PNG, or PDF format)
                                    </p>
                                    <p className="ant-upload-hint" style={{ color: token.colorTextDescription }}>
                                        Support for single or bulk upload. Strictly prohibited from uploading company data or other
                                        banned files. Maximum file size: 10MB
                                    </p>
                                </Dragger>

                                {projectData?.files?.length > 0 && (<FileList
                                    fileProcessingId={fileProcessingId}
                                    files={projectData.files}
                                    onRemove={handleRemove}
                                />)}
                            </Flex>
                        </>}

                        {currentView == 2 && <>
                            <Flex gap={30} vertical align='center' justify='center' style={{ width: '100%' }}>
                                <Editor projectData={projectData} />
                            </Flex>
                        </>}



                    </Flex>
                </Card>
            </Flex>

            {projectData?.files?.length > 0 && (
                <Button
                    onClick={handleUploadAndContinue}
                    type="primary"
                    icon={<LuUpload />}
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
                    disabled={!selectedProject || projectData?.files?.length === 0}
                >
                    Upload & Scan
                </Button>
            )}
        </>
    );
}

export default ProjectsPage;