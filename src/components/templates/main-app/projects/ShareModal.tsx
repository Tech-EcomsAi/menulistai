import { Button, Flex, Form, Input, Modal, message } from 'antd';
import { useState } from 'react';
import { Project } from './type';
import { getOutputJson } from './utils';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectData: Project;
}

export const ShareModal = ({ isOpen, onClose, projectData }: ShareModalProps) => {
    const [form] = Form.useForm();
    const [isSharing, setIsSharing] = useState(false);

    const handleClose = () => {
        form.resetFields();
        onClose();
        setIsSharing(false);
    };

    const handleSubmit = async (values: { apiUrl: string }) => {
        try {
            setIsSharing(true);
            const data = getOutputJson(projectData);
            const response = await fetch(values.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            message.success('Data shared successfully!');
            handleClose();
        } catch (error) {
            console.error('Error sharing data:', error);
            message.error('Failed to share data. Please check the API URL and try again.');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <Modal
            title="Share Menu Data"
            open={isOpen}
            onCancel={handleClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="apiUrl"
                    label="API URL"
                    rules={[{
                        required: true,
                        message: 'Please enter the API URL',
                        type: 'url',
                        validator: (_, value) => {
                            if (!value) return Promise.reject();
                            try {
                                new URL(value);
                                return Promise.resolve();
                            } catch {
                                return Promise.reject('Please enter a valid URL');
                            }
                        }
                    }]}
                >
                    <Input placeholder="https://api.example.com/menu-data" type="url" />
                </Form.Item>
                <Form.Item>
                    <Flex gap={8} justify="end">
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSharing}
                        >
                            Share
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    );
};
