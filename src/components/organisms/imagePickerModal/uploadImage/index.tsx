import ImageUploadInput from '@atoms/imageUploadInput';
import { addUserUploadedFile } from '@database/collections/craftBuilder/user/uploaded';
import ImageCropper from '@organisms/imageCropper';
import { UserUploadedFileType } from '@template/craftBuilder/types';
import { Button, Flex } from 'antd';
import { useRef, useState } from 'react';
import { LuUpload } from 'react-icons/lu';
import { TbResize } from 'react-icons/tb';

function UploadImage({ src = "", isResize = false, onCrop, label = "Replace Image", size = "large", shape = "default", type = "default", styles = {} }: any) {

    const fileInputRef = useRef(null);
    const [showCropperModal, setShowCropperModal] = useState({ active: false, src: null });
    const [selectedFile, setSelectedFile] = useState({ name: "", size: 0, type: "", src: null }) //"type:image/png"

    const handleFileChange = async (selectedFile: UserUploadedFileType) => {
        setSelectedFile(selectedFile)
        setShowCropperModal({ active: true, src: selectedFile.src });
    };

    const onClickUpload = () => {
        if (isResize) setShowCropperModal({ active: true, src: src });
        else fileInputRef.current.click()
    }

    const handleCropperResponse = async (croppedImage) => {
        if (croppedImage) {
            if (!isResize) {
                const body: any = {
                    ...selectedFile,
                    base64Url: selectedFile.src,
                    originalSize: selectedFile.size,
                    creditsUsed: 0,
                }
                const { userTxnId, uploadedUrl } = await addUserUploadedFile(body, "User_Uploaded")
                onCrop(croppedImage, { ...selectedFile, id: userTxnId, uploadedUrl })
            } else {
                onCrop(croppedImage)
            }
        }
        setShowCropperModal({ active: false, src: null });
    }

    return (
        <>
            <Flex justify='space-between' align='center'>
                <Button block style={{ ...styles }} shape={shape} type={type} size={size} onClick={onClickUpload} icon={isResize ? <TbResize /> : <LuUpload />} >{label}</Button>
                <ImageCropper ratio={16 / 9} onReplaceImage={onClickUpload} onCancel={() => setShowCropperModal({ active: false, src: null })} modalData={showCropperModal} onSave={handleCropperResponse} cropBoxResizable={false} />
            </Flex>
            <ImageUploadInput onUploadFile={handleFileChange} fileInputRef={fileInputRef} />
        </>
    )
}

export default UploadImage