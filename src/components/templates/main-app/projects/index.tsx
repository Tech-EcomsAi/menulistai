'use client';

import { getProjectData, getProjects } from '@database/projects';
import { PlatformGlobalDataContext, PlatformGlobalDataProviderType } from '@providers/platformProviders/platformGlobalDataProvider';
import { getBase64, removeObjRef } from '@util/utils';
import { Button, Empty, Flex, Typography, Upload, message, theme } from 'antd';
import type { UploadFileStatus, UploadProps } from 'antd/es/upload/interface';
import { useContext, useEffect, useState } from 'react';
import { LuArrowRight, LuUpload } from 'react-icons/lu';
import { TbUpload } from 'react-icons/tb';
import B2BView from './b2bView';
import B2CView from './b2cView';
import { DummyModelResponses } from './data';
import Editor from './Editor';
import { FileList } from './FileList';
import LanguageSelector from './LanguageSelector';
import { ProjectHeader } from './ProjectHeader';
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
    const { tenantDetails } = useContext<PlatformGlobalDataProviderType>(PlatformGlobalDataContext)

    //1: File Upload view
    //2: Response editor view
    //3: Catalogue view
    const [allLanguages, setAllLanguages] = useState<string[]>(['English (en)', 'Spanish (es)', 'French (fr)']);

    const handleLanguageToggle = (newLanguages: string[]) => {
        if (!projectData) return;
        setProjectData({ ...projectData, languages: newLanguages });
    };

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
            // Check if the project already has defined languages
            if (Boolean(projectData?.languages?.length)) {
                // If languages exist, use them to set the available languages
                setAllLanguages(projectData.languages);
            } else {
                // If no languages are defined, set English as the default project language
                projectData.languages = ['English (en)'];
                // Initialize the language selector with default supported languages
                setAllLanguages(['English (en)', 'Spanish (es)', 'French (fr)']);
            }
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
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Calculate processing time
        const processingTime = Date.now() - startTime;
        const modelResponse = DummyModelResponses[i];
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
            modelResponse: modelResponse,
            inputToken: 400,
            ouputToken: JSON.stringify(modelResponse).length,
            chargePerToken: 10,//in paise
            charges: (400 + JSON.stringify(modelResponse).length) * 10,//in paise
            processingTime
        }
        return dummy
    }

    const handleUploadAndContinue = async () => {
        if (!selectedProject) {
            message.error('Please select a project first');
            return;
        }

        if (!projectData?.files?.length) {
            message.error('Please upload at least one file to continue');
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

    const handleRemove = (id: string) => {
        if (projectData?.files) {
            const updatedFiles = projectData.files.filter(file => file.uid !== id);
            const projectDataCopy: Project = removeObjRef(projectData);
            projectDataCopy.files = updatedFiles;
            setProjectData(projectDataCopy);

            // If no files left, move back to view 1
            if (updatedFiles.length === 0) {
                setCurrentView(1);
            }
        }
    };

    const validateSelectedFile = async (file: any) => {
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
    }

    const onSelectFile = async (info: any) => {
        const newFileList = [...info.fileList];

        // Generate preview URLs for new files
        await Promise.all(
            newFileList.map(async (file) => {
                if (!file.url && file.originFileObj && file.type?.startsWith('image/')) {
                    file.url = await getBase64(file.originFileObj);
                }
            })
        );

        const projectDataCopy: Project = removeObjRef(projectData)
        projectDataCopy.files = newFileList.map((file) => ({
            uid: file.uid,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url || ""
        }));
        setProjectData(projectDataCopy);
    }

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: true,
        style: { background: token.colorBgLayout },
        fileList: projectData?.files?.map((file) => ({
            uid: file.uid || file.url || String(Math.random()),  // Use src/url as id or generate random
            name: file.name || 'Untitled',
            size: file.size,
            type: file.type,
            status: 'done' as UploadFileStatus,
            url: file.url,
        })),
        accept: '.jpg,.jpeg,.png,.pdf',
        beforeUpload: validateSelectedFile,
        onChange: onSelectFile,
        itemRender: (file, fileid) => null
    };

    if (loading) {
        return <Flex vertical gap={20} justify='center' align='center' style={{ height: '100vh' }}><Empty /></Flex>;
    }

    return (
        <Flex vertical gap={10}>
            {currentView == 1 && <ProjectHeader
                projects={projects}
                selectedProject={selectedProject}
                currentView={currentView}
                setSelectedProject={setSelectedProject}
                setProjects={setProjects}
                projectData={projectData}
                setProjectData={setProjectData}
                setCurrentView={setCurrentView}
            />}
            <Flex vertical gap={30} style={{ width: '100%' }} align='center' justify='flex-start'>

                {currentView == 1 && <>
                    <Flex gap={20} vertical align='center' justify='center' style={{ width: '100%' }}>
                        <Dragger {...uploadProps}>
                            <Flex gap={16} align='center' justify='center' style={{ width: '100%', marginBottom: 10 }}>
                                <Empty description={<Button icon={<LuUpload />}>Browse Files</Button>} image={<TbUpload fontSize={64} style={{ color: token.colorPrimary }} />} />
                            </Flex>

                            <p className="ant-upload-text" style={{ fontSize: 16, marginBottom: 8 }}>
                                Click or drag files to this area to upload (JPG, PNG, or PDF format)
                            </p>
                            <p className="ant-upload-hint" style={{ color: token.colorTextDescription }}>
                                Support for single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files. Maximum file size: 10MB
                            </p>
                        </Dragger>

                        <LanguageSelector
                            // title="Select Target Languages"
                            description="Choose the languages you want to extract menu items in"
                            allLanguages={allLanguages}
                            selectedLanguages={projectData?.languages || []}
                            onLanguageToggle={handleLanguageToggle}
                        />
                        {projectData?.files?.length > 0 && (<FileList
                            fileProcessingId={fileProcessingId}
                            files={projectData.files}
                            onRemove={handleRemove}
                        />)}
                    </Flex>
                </>}

                {currentView == 2 && <>
                    <Flex gap={10} vertical align='center' justify='center' style={{ width: '100%' }}>
                        <Editor
                            setCurrentView={setCurrentView}
                            originalProjectData={projectData}
                            setOriginalProjectData={setProjectData}
                            onRemove={handleRemove}
                            allLanguages={allLanguages}
                            setAllLanguages={setAllLanguages}
                        />
                    </Flex>
                </>}

                {currentView == 3 && <>
                    <Flex gap={10} vertical align='center' justify='center' style={{ width: '100%' }}>
                        {tenantDetails?.businessEntityType == 'B2C' ?
                            <B2CView
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                projectData={projectData}
                            /> :
                            <B2BView
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                originalProjectData={projectData}
                            />}
                    </Flex>
                </>}


            </Flex>
            {currentView == 1 && (
                <Button
                    onClick={handleUploadAndContinue}
                    type="primary"
                    icon={projectData?.files?.some(file => !file.charges) ? <LuUpload /> : <LuArrowRight />}
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
                    {projectData?.files?.some(file => !file.charges) ? 'Upload & Continue' : 'Continue'}
                </Button>)}
        </Flex>
    );
}

export default ProjectsPage;