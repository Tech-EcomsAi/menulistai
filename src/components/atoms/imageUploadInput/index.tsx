import { IMAGE_COMPRESSION_LIMIT } from "@constant/common";
import { getBase64, getBase64Length, getCompressedImage } from "@util/utils";
import { useState } from "react";

type PropsType = {
    onUploadFile: Function
    fileInputRef: any
    compression?: boolean
    cropperConfiguarations?: {
        cropBoxResizable: boolean;
        ratio: any;
        active: boolean;
    };
}
function ImageUploadInput({
    onUploadFile,
    fileInputRef,
    compression = true,
    cropperConfiguarations = {
        active: false,
        ratio: 1,
        cropBoxResizable: false
    } }: PropsType) {

    const [showCropperModal, setShowCropperModal] = useState<{ active: boolean, src: string, data: any }>({ active: false, src: null, data: null })

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        let base64: any = null;
        let compressed: {};
        if (file) {
            if (compression && file.size > IMAGE_COMPRESSION_LIMIT) {
                base64 = await getCompressedImage(file, 0.4);
                compressed = {
                    size: getBase64Length(base64),
                    src: base64,
                };
            } else {
                base64 = await getBase64(file);
            }

            if (base64) {
                const data = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    src: base64,
                    compressed,
                }
                const allowedList = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
                if (allowedList.includes(file.type) && cropperConfiguarations.active) {
                    setShowCropperModal({
                        active: true, src: base64, data
                    });
                } else {
                    onUploadFile(data);
                }
            }
        }
    };

    const onCropImage = (cropedImage) => {
        onUploadFile({ ...showCropperModal.data, src: cropedImage })
        setShowCropperModal({ active: false, src: null, data: null })
    }

    return (
        <>
            <input
                tabIndex={0}
                aria-hidden="true"
                data-sentinel="end"
                type="file"
                style={{
                    display: "none",
                    width: 0,
                    height: 0,
                    overflow: "hidden",
                    outline: "none",
                    position: "absolute",
                }}
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            {/* {cropperConfiguarations.active && <ImageCropper
                ratio={cropperConfiguarations.ratio}
                cropBoxResizable={cropperConfiguarations.cropBoxResizable}
                onReplaceImage={() => fileInputRef.current.click()}
                onCancel={() => setShowCropperModal({ active: false, src: null, data: null })}
                modalData={showCropperModal}
                onSave={onCropImage}
            />} */}

        </>
    );
}

export default ImageUploadInput;
