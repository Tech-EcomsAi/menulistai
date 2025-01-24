import { CheckCircleFilled, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Modal, Spin, Tag, Tooltip, theme } from 'antd';
import { useState } from 'react';
import { LuFileText } from 'react-icons/lu';
import { ProjectFileType } from './type';

const { useToken } = theme;

interface FileListProps {
    files: ProjectFileType[];
    onRemove: (uid: string) => void;
    fileProcessingId: string | null;
}

export function FileList({ files, onRemove, fileProcessingId }: FileListProps) {

    console.log("files", files)
    const { token } = useToken();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handlePreview = async (file: ProjectFileType) => {
        if (!file.url) return;

        setPreviewImage(file.url);
        setPreviewOpen(true);
        setPreviewTitle(file.name || 'Image');
    };

    const handleCancel = () => setPreviewOpen(false);

    return (
        <>
            <div>
                <Flex gap={30} wrap={"wrap"}>
                    {files.map((file) => {
                        const isImage = file.type?.startsWith('image/');
                        return (
                            <Card key={file.uid}
                                style={{ cursor: 'pointer', minWidth: 200, maxWidth: 200, position: 'relative', height: "max-content" }}
                                onClick={() => isImage && handlePreview(file)}
                                size="small"
                                hoverable
                                cover={
                                    <>
                                        {(Boolean(file.charges) || (fileProcessingId === file.uid)) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: token.colorBgMask,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 1
                                            }}>
                                                {Boolean(file.charges) && (
                                                    <Tooltip title={`Processed in ${(file.processingTime! / 1000).toFixed(1)} seconds`}>
                                                        <Flex vertical align='center' justify='center' gap={10}>
                                                            <CheckCircleFilled style={{ fontSize: 40, color: token.colorSuccess }} />
                                                            <Tag color={token.colorSuccess}>{(file.processingTime! / 1000).toFixed(1)} s</Tag>
                                                        </Flex>
                                                    </Tooltip>
                                                )}
                                                {fileProcessingId === file.uid && (<Spin size="large" />)}
                                            </div>
                                        )}
                                        {isImage ? (
                                            <div style={{
                                                minHeight: "auto",
                                                maxHeight: '100%',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: token.colorFillAlter
                                            }}>
                                                <img
                                                    alt={file.name}
                                                    src={file.url}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        width: 'auto',
                                                        height: 'auto',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                height: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: token.colorFillAlter
                                            }}>
                                                <LuFileText style={{ fontSize: 48, color: token.colorPrimary }} />
                                            </div>
                                        )}
                                    </>
                                }
                                actions={[
                                    <Button
                                        block
                                        key="view"
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isImage && handlePreview(file)
                                        }}
                                    />,
                                    <Button
                                        block
                                        key="delete"
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(file.uid)
                                        }}
                                    />
                                ]}
                            >
                                <Card.Meta title={file.name} description={`${(file.size! / 1024 / 1024).toFixed(2)} MB`} />
                            </Card>
                        );
                    })}
                </Flex>
            </div>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}
