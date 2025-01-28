import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Card, Flex, Image, Popconfirm, Spin, Tag, Tooltip, theme } from 'antd';
import { useState } from 'react';
import { LuEye, LuFileText, LuTrash } from 'react-icons/lu';
import { ProjectFileType } from './type';

const { useToken } = theme;

interface FileListProps {
    files: ProjectFileType[];
    onRemove: (uid: string) => void;
    fileProcessingId: string | null;
}

export function FileList({ files, onRemove, fileProcessingId }: FileListProps) {

    const { token } = useToken();
    const [previewFile, setPreviewFile] = useState<ProjectFileType | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const handlePreview = async (file: ProjectFileType) => {
        if (!file.url) return;
        setPreviewFile(file);
    };

    return (
        <>
            <div>
                <Flex gap={20} wrap={"wrap"}>
                    {files.map((file) => {
                        const isImage = file.type?.startsWith('image/');
                        return (
                            <Card key={file.uid}
                                style={{ cursor: 'pointer', minWidth: 200, maxWidth: 200, position: 'relative', height: "max-content" }}
                                onClick={() => isImage && handlePreview(file)}
                                size="small"
                                hoverable
                                onMouseEnter={() => setHoveredCard(file.uid)}
                                onMouseLeave={() => setHoveredCard(null)}
                                cover={
                                    <>
                                        {(Boolean(file.charges) || (fileProcessingId === file.uid) || hoveredCard === file.uid) && (
                                            <div className='animate__animated animate__fadeIn animate__faster'
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: token.colorBgMask,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexDirection: 'column',
                                                    gap: 20,
                                                    zIndex: 1
                                                }}>
                                                {Boolean(file.charges) && (
                                                    <Tooltip title={`Processed in ${(file.processingTime! / 1000).toFixed(1)} seconds`}>
                                                        <Flex className='animate__animated animate__fadeInLeft animate__faster' vertical align='center' justify='center' gap={10}>
                                                            <CheckCircleFilled style={{ fontSize: 40, color: token.colorSuccess }} />
                                                            <Tag color={token.colorSuccess}>{(file.processingTime! / 1000).toFixed(1)} s</Tag>
                                                            <Tag color={token.colorPrimary}>{file.inputToken + file.inputToken} Tokens</Tag>
                                                        </Flex>
                                                    </Tooltip>
                                                )}
                                                {fileProcessingId === file.uid && (<Spin size="large" />)}
                                                {hoveredCard === file.uid && (
                                                    <Flex align='center' justify='center' gap={10}>
                                                        {isImage && (
                                                            <Button
                                                                shape='circle'
                                                                className='animate__animated animate__fadeInLeft animate__faster'
                                                                icon={<LuEye style={{ fontSize: 18 }} />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePreview(file);
                                                                }}
                                                            />
                                                        )}
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
                                                                shape='circle'
                                                                className='animate__animated animate__fadeInRight animate__faster'
                                                                danger
                                                                icon={<LuTrash style={{ fontSize: 18 }} />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!file.charges) {
                                                                        onRemove(file.uid);
                                                                    }
                                                                }}
                                                            />
                                                        </Popconfirm>
                                                    </Flex>
                                                )}
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
                                                <Image
                                                    alt={file.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        width: 'auto',
                                                        height: 'auto',
                                                        objectFit: 'cover'
                                                    }}
                                                    src={file.url}
                                                    preview={true}
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
                            >
                                <Card.Meta title={file.name} description={`${(file.size! / 1024 / 1024).toFixed(2)} MB`} />
                            </Card>
                        );
                    })}
                </Flex>
            </div>
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
        </>
    );
}
