import { Project, ProjectFileType } from "./type";
import { Row, Col, Card, Typography, Image, Form, Input, Select, Empty } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

function Editor({ projectData }: { projectData: Project }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [form] = Form.useForm();

    const handleFormChange = (changedValues: any, allValues: any) => {
        console.log("Form changed:", changedValues, allValues);
        // Here you can implement the logic to update the modelResponse
    };

    const currentFile: ProjectFileType | undefined = projectData.files?.[currentImageIndex];

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Card>
                    <Title level={4}>Uploaded Image</Title>
                    {projectData.files && projectData.files.length > 0 ? (
                        <>
                            <Image
                                src={currentFile?.url}
                                alt={`Image ${currentImageIndex + 1}`}
                                style={{ width: '100%', marginBottom: 16 }}
                            />
                            <Row justify="space-between" align="middle">
                                <Text>
                                    Image {currentImageIndex + 1} of {projectData.files.length}
                                </Text>
                                <Row gutter={8}>
                                    <Col>
                                        <Select
                                            value={currentImageIndex}
                                            onChange={setCurrentImageIndex}
                                            style={{ width: 120 }}
                                        >
                                            {projectData.files.map((file, index) => (
                                                <Select.Option key={index} value={index}>
                                                    {file.name || `Image ${index + 1}`}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                            </Row>
                        </>
                    ) : (
                        <Empty description="No images uploaded" />
                    )}
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Title level={4}>Model Response</Title>
                    {currentFile?.modelResponse ? (
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={currentFile.modelResponse}
                            onValuesChange={handleFormChange}
                        >
                            <Form.Item label="Languages" name={["data", "languages"]}>
                                <Input.TextArea autoSize={{ minRows: 2 }} />
                            </Form.Item>
                            <Form.Item label="Categories" name={["data", "categories"]}>
                                <Input.TextArea autoSize={{ minRows: 3 }} />
                            </Form.Item>
                            <Form.Item label="Items" name={["data", "items"]}>
                                <Input.TextArea autoSize={{ minRows: 6 }} />
                            </Form.Item>
                        </Form>
                    ) : (
                        <Empty description="No model response available" />
                    )}
                </Card>
            </Col>
        </Row>
    );
}

export default Editor;