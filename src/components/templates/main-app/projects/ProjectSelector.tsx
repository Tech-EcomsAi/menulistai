import { addProject, updateProjectMetadata } from '@database/projects';
import { Badge, Button, Card, Flex, Form, Input, Modal, Popover, Space, Switch, Typography, message, theme } from 'antd';
import { useState } from 'react';
import { IoChevronDown } from "react-icons/io5";
import { LuFileEdit, LuFolderOpen, LuPlus } from 'react-icons/lu';
import { ProjectMetadata } from './type';

const { Text, Title } = Typography;
const { useToken } = theme;

interface ProjectSelectorProps {
    projects: ProjectMetadata[];
    selectedProject: ProjectMetadata | null;
    onProjectSelect: (project: ProjectMetadata) => void;
    setProjects: any,
    setSelectedProject: any
}

interface ProjectFormData {
    name: string;
    active: boolean;
}

export const ProjectSelector = ({
    projects,
    selectedProject,
    onProjectSelect,
    setProjects,
    setSelectedProject
}: ProjectSelectorProps) => {
    const { token } = useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<ProjectFormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectMetadata | null>(null);

    const handleSubmit = async (values: ProjectFormData) => {
        try {
            setIsLoading(true);
            if (editingProject) {
                await updateProjectMetadata({
                    ...editingProject,
                    name: values.name,
                    active: values.active
                });
                setProjects(projects.map(p => p.projectId === editingProject.projectId ? { ...editingProject, name: values.name, active: values.active } : p));
                setSelectedProject({ ...editingProject, name: values.name, active: values.active });
                message.success('Project updated successfully');
            } else {
                const newProject = await addProject({ name: values.name, active: values.active });
                if (newProject) {
                    onProjectSelect(newProject);
                    setProjects([...projects, newProject]);
                    message.success('Project created successfully');
                }
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingProject(null);
        } catch (error) {
            console.error('Error handling project:', error);
            message.error(`Failed to ${editingProject ? 'update' : 'create'} project`);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (project?: ProjectMetadata) => {
        if (project) {
            setEditingProject(project);
            form.setFieldsValue({
                name: project.name,
                active: project.active
            });
        } else {
            setEditingProject(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <Space style={{
                // zIndex: 999,
                // width: 'max-content',
                // justifyContent: 'flex-start',
                // alignItems: 'center',
                // position: "fixed",
                // top: "10px",
                // left: "50%",
                // transform: "translateX(-50%)"
            }}>
                <Popover
                    placement="bottomLeft"
                    trigger="click"
                    content={
                        <div style={{ maxWidth: 320, maxHeight: 400, overflow: 'auto' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={8}>
                                {projects.map((project) => (
                                    <Card
                                        key={project.projectId}
                                        size="small"
                                        hoverable
                                        style={{
                                            cursor: 'pointer',
                                            borderColor: selectedProject?.projectId === project.projectId ? token.colorPrimary : undefined,
                                        }}
                                        onClick={() => onProjectSelect(project)}
                                    >
                                        <Badge dot={true} style={{ background: project.active ? "green" : "red" }}>
                                            <Flex justify="space-between" align='center' style={{ minWidth: 300 }}>
                                                <Text strong>{project.name}</Text>
                                                <Button type="text" icon={<LuFileEdit />} onClick={(e) => { e.stopPropagation(); openModal(project); }} />
                                            </Flex>
                                        </Badge>
                                    </Card>
                                ))}
                                <Button type="dashed" icon={<LuPlus />} block onClick={() => openModal()}>Add New Project</Button>
                            </Space>
                        </div>
                    }
                >
                    <Button style={{ minWidth: 200 }} icon={<LuFolderOpen />}>
                        Current Project:  {selectedProject ? selectedProject.name : 'Select Project'}
                        <IoChevronDown style={{ marginLeft: 8 }} />
                    </Button>
                </Popover>
            </Space>

            <Modal
                title={editingProject ? 'Edit Project' : 'Create New Project'}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingProject(null);
                }}
                confirmLoading={isLoading}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ active: true }}
                >
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please enter a project name' }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>
                    <Form.Item
                        name="active"
                        label="Active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
