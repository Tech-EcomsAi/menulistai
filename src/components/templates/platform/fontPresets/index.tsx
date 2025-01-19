
'use client'

import Saperator from "@atoms/Saperator";
import { addFontPreset, deletFontPreset, getFontPresets, updateFontPreset } from "@database/collections/craftBuilder/assets/fontPresets";
import { useAppDispatch } from "@hook/useAppDispatch";
import EditorWrapper from "@organisms/editor/editorWrapper";
import { showSuccessToast } from "@reduxSlices/toast";
import { addFontFaceStyle, getBase64, getBase64Length, removeObjRef } from "@util/utils";
import { Button, Divider, Flex, Input, InputNumber, Popconfirm, theme, Typography } from "antd";
import { fabric } from "fabric";
import FontFaceObserver from 'fontfaceobserver';
import { Fragment, useEffect, useRef, useState } from "react";
import { LuArrowUpDown, LuPlusCircle, LuRefreshCcw, LuTrash, LuUpload, LuUploadCloud, LuX } from "react-icons/lu";
import logger from "src/loggers";
import SortFontModal from "./sortFontModal";
const { Text } = Typography;

let canvasInstance: fabric.Canvas = null;
const emptyFontDetails = {
    name: "",
    code: "",//used to save file with same name
    blackTextUrl: "",
    whiteTextUrl: "",
    size: "",
    type: "",
    fileUrl: "",
    id: "",
    fontSize: 30,
    width: 150,
    height: 35,
    index: 0
}
function FontPresets() {

    const canvasRef: any = useRef();//canvas DOM element reference
    const { token } = theme.useToken();
    const fileInputRef = useRef(null);
    const [fontsList, setFontsList] = useState([]);
    const [fontDetails, setFontDetails] = useState(emptyFontDetails)
    const dispatch = useAppDispatch();
    const [showSortModal, setShowSortModal] = useState({ active: false, data: [] })

    useEffect(() => {

        getFontPresets().then((res) => {
            logger.debug("res", res)
            setFontsList(res)
        })
        canvasInstance = new fabric.Canvas(canvasRef.current,
            {
                isDrawingMode: false,
                allowTouchScrolling: true,
                isTouchSupported: true,
                renderOnAddRemove: false,
                fireRightClick: true, // Enable right-click, button number is 3
                stopContextMenu: true, // Disable default right-click menu
                controlsAboveOverlay: true, // Show controls even when they overlap the clipPath
                imageSmoothingEnabled: false, // Disable image smoothing to prevent blurry text export
                preserveObjectStacking: true, // Keep objects in their original stacking order when selected
            }
        );
    }, []);

    const handleFileChange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const fontData: any = {
                ...fontDetails,
                code: `eai-f-${file.name.split(".")[0]}`,
                name: file.name.split(".")[0],
                size: file.size,
                type: file.type,
                fileUrl: await getBase64(file)
            }
            setFontDetails(fontData)
        }
    };

    const getURL = () => {
        return canvasInstance?.toDataURL({
            format: "png",
            quality: 1,
            width: fontDetails.width,
            height: fontDetails.height,
        })
    }

    const getTextObj = (type) => {
        return new fabric.IText(fontDetails.name, {
            fontSize: fontDetails.fontSize,
            fontFamily: fontDetails.code,
            fill: type == "white" ? "#ffffff" : '#000000'
        });
    }

    const updateText = async (fontDetails) => {
        addFontFaceStyle([fontDetails])

        canvasInstance.renderAll(); // Update the display

        canvasInstance.set("width", fontDetails.width)
        canvasInstance.set("height", fontDetails.height)

        canvasRef.current.style.width = fontDetails.width + "px"
        canvasRef.current.style.height = fontDetails.height + "px"

        const upperCanavs: any = document.getElementsByClassName("upper-canvas ")
        upperCanavs[0].style.width = fontDetails.width + "px"
        upperCanavs[0].style.height = fontDetails.height + "px"

        canvasInstance.clear();

        if (fontDetails.fileUrl) {
            const font = new FontFaceObserver(fontDetails.code);
            font.load(null, 150000).then(() => {
                canvasInstance.renderAll();

                const whiteText = getTextObj("white")
                canvasInstance.add(whiteText).centerObject(whiteText).renderAll();
                fabric.fontPaths = { [fontDetails.code]: fontDetails.fileUrl };
                const whiteTextUrl = getURL();

                canvasInstance.remove(whiteText).renderAll();

                const blackText = getTextObj("black")
                canvasInstance.add(blackText).centerObject(blackText).renderAll();
                fabric.fontPaths = { [fontDetails.code]: fontDetails.fileUrl };
                const blackTextUrl = getURL();

                setFontDetails({
                    ...fontDetails,
                    blackTextUrl,
                    whiteTextUrl
                    //for svg preview
                    // svg: canvasInstance.toSVG({ width: 300, height: 100, viewBox: { width: 300, height: 100 }, })
                })

            }).catch((err) => {
                console.log(err);
            });
        }
    };

    const onClickSave = async () => {
        const fontsListCopy = removeObjRef(fontsList)
        if (fontDetails.id) {
            const fondRes = await updateFontPreset({ ...fontDetails })
            const index = fontsListCopy.findIndex(f => f.id == fontDetails.id);
            fontsListCopy[index] = fondRes
            dispatch(showSuccessToast("Font updated successfully"))
        } else {
            const fondRes = await addFontPreset({
                ...fontDetails,
                index: fontsList.length,
            })
            fontsListCopy.push(fondRes);
            dispatch(showSuccessToast("Font added successfully"))
        }
        setFontsList(fontsListCopy);
        setFontDetails(emptyFontDetails)
    }

    const onDeleteFont = async () => {
        await deletFontPreset(fontDetails.id, fontDetails.fileUrl);
        const fontsListCopy = removeObjRef(fontsList)
        const index = fontsListCopy.findIndex(f => f.id == fontDetails.id);
        fontsListCopy.splice(index, 1);
        setFontsList(fontsListCopy);
        setFontDetails(emptyFontDetails)
        dispatch(showSuccessToast("Font deleted successfully"))
    }

    return (
        <Flex align="flex-start" justify="flex-start" gap={20}>
            <Flex vertical style={{ width: 300, height: "100%", overflow: "auto" }} gap={10}>
                <Text strong>Added Fonts List</Text>
                {(fontsList.sort((a, b) => a.index - b.index)).map((fontData: any, i: number) => {
                    return <Fragment key={i}>
                        <Button
                            ghost={fontData.id == fontDetails?.id}
                            type={fontData.id == fontDetails?.id ? "primary" : "dashed"}
                            onClick={() => setFontDetails({ ...removeObjRef(fontDetails), ...fontData })}>{fontData.name}</Button>
                    </Fragment>
                })}
                <Flex style={{ position: "sticky", bottom: 0, marginTop: 20 }} justify="space-between" gap={10}>
                    <Button
                        block
                        icon={<LuPlusCircle />}
                        type="primary"
                        size="large"
                        onClick={() => setFontDetails(removeObjRef(emptyFontDetails))}>Add New</Button>

                    <Button
                        block
                        icon={<LuArrowUpDown />}
                        type="primary"
                        ghost
                        size="large"
                        onClick={() => setShowSortModal({ active: true, data: fontsList })}>Sort</Button>
                </Flex>
            </Flex>

            <Divider type="vertical" style={{ height: "100%" }} />
            <Flex vertical gap={30} style={{ width: 500 }}>
                <Text strong>{fontDetails.id ? "Update Font" : "Create Font"}</Text>
                {!Boolean(fontDetails.id) && <Button size="large" type="primary" ghost icon={<LuUpload />} onClick={() => fileInputRef.current?.click()}>{fontDetails.size ? "Replace Font" : "Upload Local Font"}</Button>}

                {fontDetails.size && <>

                    <Flex gap={20}>
                        <EditorWrapper>
                            <Text strong>Preview Name</Text>
                            <Input
                                showCount
                                maxLength={80}
                                value={fontDetails.name}
                                style={{ width: 250 }}
                                onChange={(e) => setFontDetails({ ...fontDetails, name: e.target.value })}
                                placeholder="Name of your font"
                                defaultValue={fontDetails.name}
                            />
                        </EditorWrapper>
                        <EditorWrapper>
                            <Text strong>Font Size</Text>
                            <InputNumber
                                min={10}
                                max={70}
                                step={1}
                                style={{ width: "100%" }}
                                onChange={(value) => setFontDetails({ ...fontDetails, fontSize: Number(value) })}
                                placeholder="Font Size (Display to end user)"
                                defaultValue={fontDetails.fontSize}
                            />
                        </EditorWrapper>
                        <EditorWrapper>
                            <Text strong>Canvas Width</Text>
                            <InputNumber
                                min={50}
                                max={300}
                                step={1}
                                style={{ width: "100%" }}
                                onChange={(value) => setFontDetails({ ...fontDetails, width: Number(value) })}
                                placeholder="Canvas Width"
                                defaultValue={fontDetails.width}
                            />
                        </EditorWrapper>
                    </Flex>

                    {/* <Flex>
                        <EditorWrapper>
                            <Text strong>Canvas Width</Text>
                            <InputNumber
                                min={50}
                                max={300}
                                step={2}
                                style={{ width: "100%" }}
                                onChange={(value) => setFontDetails({ ...fontDetails, width: Number(value) })}
                                placeholder="Font Size (Display to end user)"
                                defaultValue={fontDetails.width}
                            />
                        </EditorWrapper>
                    </Flex> */}

                    <EditorWrapper>
                        <Text strong>Font Code(Used for internal font mapping purpose)</Text>
                        <Input
                            showCount
                            maxLength={80}
                            value={fontDetails.code}
                            onChange={(e) => setFontDetails({ ...fontDetails, code: e.target.value })}
                            placeholder="Font code (used to save file with same name)"
                            defaultValue={fontDetails.code}
                        />
                    </EditorWrapper>

                    <Flex vertical gap={20}>

                        <Button size="large" icon={<LuRefreshCcw />} type="dashed" onClick={() => updateText(fontDetails)}>Refresh Preview</Button>

                        <Flex gap={20} style={{ width: "100%" }}>

                            <Flex gap={20} vertical style={{ width: "100%" }}>
                                <Text>Black Theme</Text>
                                <Flex style={{ width: "100%", height: 80, background: "black", border: `2px solid ${token.colorBorder}`, boxShadow: token.boxShadow }} align="center" justify="center">
                                    <img style={{ width: "auto", border: `1px solid ${token.colorBorder}` }} src={fontDetails.whiteTextUrl} />
                                </Flex>
                                <Button>Size: {Number(getBase64Length(fontDetails.whiteTextUrl) / 1000).toFixed()}KB  ({fontDetails.width}X{fontDetails.height})</Button>
                            </Flex>

                            <Flex gap={20} vertical style={{ width: "100%" }}>
                                <Text>White Theme</Text>
                                <Flex style={{ width: "100%", height: 80, background: "white", border: `2px solid ${token.colorBorder}`, boxShadow: token.boxShadow }} align="center" justify="center">
                                    <img style={{ width: "auto", border: `1px solid ${token.colorBorder}` }} src={fontDetails.blackTextUrl} />
                                </Flex>
                                <Button>Size: {Number(getBase64Length(fontDetails.blackTextUrl) / 1000).toFixed()}KB  ({fontDetails.width}X{fontDetails.height})</Button>
                            </Flex>

                        </Flex>

                        <Saperator />

                        <Flex gap={20} justify="flex-end" align="center">
                            <Button size="large" icon={<LuX />} onClick={() => setFontDetails(emptyFontDetails)}>Cancel</Button>
                            {Boolean(fontDetails.id) && <Popconfirm
                                title="Delete Font"
                                description="Are you sure you want to delete this font?"
                                onConfirm={onDeleteFont}>
                                <Button danger type="default" size="large" icon={<LuTrash />} >Delete Font</Button>
                            </Popconfirm>}
                            <Button size="large" ghost type="primary" onClick={onClickSave} icon={<LuUploadCloud />}>{fontDetails.id ? "Update" : "Add"} Font</Button>
                        </Flex>

                    </Flex>
                </>}

                <input type="file" style={{ display: 'none' }} accept=".ttf" ref={fileInputRef} onChange={handleFileChange} />
                <Flex style={{ display: "none" }}>
                    <canvas ref={canvasRef} width={fontDetails.width} height={fontDetails.height} />
                </Flex>
            </Flex>
            <SortFontModal showSortModal={showSortModal} setFontsList={setFontsList} setShowSortModal={setShowSortModal} />
        </Flex>
    )
}

export default FontPresets