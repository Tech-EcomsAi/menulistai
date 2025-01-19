import { APP_NAME } from '@constant/common';
import useDebounce from '@hook/useDebounce';
import { Button, Modal, Tooltip } from 'antd';
import "cropperjs/dist/cropper.css";
import React, { useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from "react-cropper";
import { AiOutlineClear, AiOutlineClose, AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai';
import { FiMaximize, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { LuFlipHorizontal, LuFlipVertical } from 'react-icons/lu';
import { TbArrowsMove, TbCrop, TbReplaceFilled, TbX } from 'react-icons/tb';
import styles from './imageCropper.module.scss';
export type DragMode = 'crop' | 'move' | 'none';

type cropperOptions = {
    dragMode: DragMode
    guides: boolean,
    center: boolean,
    aspectRatio: number,
    responsive: boolean
}

type ImageCropperType = {
    modalData: { active: boolean, src: any };
    onSave: any;
    onCancel: any;
    onReplaceImage: any;
    ratio: any,
    cropBoxResizable: boolean
}

function ImageCropper({ modalData, onSave, onCancel, onReplaceImage, ratio, cropBoxResizable }: ImageCropperType) {

    const cropperRef = useRef<ReactCropperElement>(null);
    const [croppedImage, setCroppedImage] = useState('')
    const [cropperOptions, setCropperOptions] = useState({
        dragMode: "crop",//move
        guides: true,
        center: true,
        aspectRatio: 1,
        responsive: true,
        scaleX: 1,
        scaleY: 1
    })

    const onClickSave = () => {
        onSave(croppedImage || modalData.src)
    }

    const debouncedCropperResult = useDebounce(() => {
        const cropper = cropperRef.current?.cropper;
        setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    });

    const onUpdateOptions = (property: any, value: any) => {
        const cropperOptionsCopy = { ...cropperOptions };
        cropperOptionsCopy[property] = value;
        setCropperOptions(cropperOptionsCopy)
    }

    const rotate = (value) => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.rotate(value);
        onUpdateOptions("rotate", value);
    };

    const zoom = (value) => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.zoom(value);
        onUpdateOptions("zoom", value);
    };

    const toggleDragMode = (value) => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.setDragMode(value)
        onUpdateOptions('dragMode', value);
    };

    const flip = (type) => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (type === "h") {
            const xValue = -cropper.getData().scaleX || -1;
            cropper.scaleX(xValue);
            onUpdateOptions('scaleX', xValue);
        } else {
            const yValue = -cropper.getData().scaleY || -1;
            cropper.scaleY(yValue);
            onUpdateOptions('scaleY', yValue);
        }
    };

    const clear = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.clear();
    }

    const reset = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        cropper.reset();
    }

    const ACTIONS = [
        { id: 1, tooltip: 'Reset cropping', action: () => reset(), icon: <FiMaximize />, disabled: false },
        { id: 1, tooltip: 'Clear cropping area', action: () => clear(), icon: <AiOutlineClear />, disabled: false },
        { id: 2, tooltip: 'Move Mode', action: () => toggleDragMode('move'), icon: <TbArrowsMove />, active: cropperOptions.dragMode == 'move', disabled: !cropBoxResizable },
        { id: 3, tooltip: 'Crop Mode', action: () => toggleDragMode('crop'), icon: <TbCrop />, active: cropperOptions.dragMode == 'crop', disabled: !cropBoxResizable },
        { id: 4, tooltip: 'Rotate image to left', action: () => rotate(-90), icon: <AiOutlineRotateLeft />, disabled: false },
        { id: 5, tooltip: 'Rotate image to right', action: () => rotate(90), icon: <AiOutlineRotateRight />, disabled: false },
        { id: 6, tooltip: 'Zoom in image', action: () => zoom(0.1), icon: <FiZoomIn />, disabled: false },
        { id: 7, tooltip: 'Zoom in image', action: () => zoom(-0.1), icon: <FiZoomOut />, disabled: false },
        { id: 8, tooltip: 'Flip image horizontally', action: () => flip("h"), icon: <LuFlipHorizontal />, disabled: false },
        { id: 9, tooltip: 'Flip image vertically', action: () => flip("v"), icon: <LuFlipVertical />, disabled: false },
    ]

    return (
        <Modal
            destroyOnClose
            title="Crop selected image"
            open={Boolean(modalData.active)}
            styles={{
                footer: {
                    display: 'flex',
                    justifyContent: "flex-end"
                },
                mask: {
                    backdropFilter: 'blur(6px)'
                }
            }}
            className={styles.cropperModal}
            closeIcon={<AiOutlineClose />}
            width={'max-content'}
            onCancel={onCancel}
            okText={'Crop & Submit Image'}
            footer={[
                <Button key="back" icon={<TbX />} onClick={onCancel}>Cancel</Button>,
                <Button key="action" type="dashed" loading={false} onClick={onReplaceImage} icon={<TbReplaceFilled />}>Change Image</Button>,
                <Button key="submit" type="primary" icon={<TbCrop />} loading={false} onClick={onClickSave}>Crop & Upload</Button>
            ]}
            maskClosable={false}
        >
            <div className={styles.cropperModalContent}>
                <div className={styles.displayImagesWrap}>
                    {/* //original image */}
                    <div className={styles.originalImageWrap}>
                        <img alt={APP_NAME} src={modalData?.src} />
                    </div>
                    {/* //cropped IMage Wrap */}
                    <div className={styles.cropperdImageWrap}>
                        <img alt={APP_NAME} src={croppedImage ? croppedImage : modalData?.src} />
                    </div>
                </div>
                <div className={styles.imageCropperWrap}>
                    <Cropper
                        dragMode={cropBoxResizable ? "crop" : "move"}
                        className={styles.cropperContainer}
                        src={modalData?.src}
                        cropBoxResizable={cropBoxResizable}
                        viewMode={1}
                        initialAspectRatio={ratio}
                        crop={debouncedCropperResult}
                        ref={cropperRef}
                        toggleDragModeOnDblclick={false}
                        minCropBoxHeight={100}
                        minCropBoxWidth={100}
                        responsive={true}
                        guides={true}
                        center={true}
                    />
                    <div className={styles.cropperActionsWrap}>
                        {ACTIONS.map((actionDetails, i) => {
                            if (actionDetails.disabled) return
                            return <React.Fragment key={i}>
                                <Tooltip title={actionDetails.tooltip}>
                                    <Button type={actionDetails.active ? "primary" : "default"} icon={actionDetails.icon} onClick={actionDetails.action} />
                                </Tooltip>
                            </React.Fragment>
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ImageCropper