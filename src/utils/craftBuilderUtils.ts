import { CUSTOME_ATTRIBUTES, OBJECT_TYPES } from "@constant/craftBuilder";
import { CRAFT_TEMPLATE_SECTIONS_LIST } from "@data/craftBuilder/sections";
import { fabric } from "fabric";

export const getObjectType = (canvasObject) => {
    return canvasObject ? (canvasObject?.get('type').includes('text') ? OBJECT_TYPES.text : canvasObject.get('type')) : '';
}

export const getCustomObjectType = (canvasObject) => {
    return canvasObject ? canvasObject?.get(CUSTOME_ATTRIBUTES.OBJECT_TYPE) : '';
}

export const getWorkspaceObject = (canvas) => {
    return canvas.getObjects().find((item) => getCustomObjectType(item) === OBJECT_TYPES.workspace) as fabric.Rect;
}

export const getWorkspaceIndex = (canvas) => {
    return canvas.getObjects().findIndex((item) => getCustomObjectType(item) === OBJECT_TYPES.workspace) as fabric.Rect;
}

export function insertImgFile(base64Src: string) {
    return new Promise((resolve) => {
        const imgEl = document.createElement('img');
        imgEl.src = base64Src;
        // insert page
        document.body.appendChild(imgEl);
        imgEl.onload = () => {
            resolve(imgEl);
        };
    });
}

export function convertDataUrlToSvg(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const svgDataUrl = canvas.toDataURL('image/svg+xml');
            resolve(svgDataUrl);
        };
        image.onerror = function () {
            reject(new Error('Failed to load image.'));
        };
        image.src = dataUrl;
    });
}

export const checkNonRestrictedObject = (obj) => {
    // used in src/components/templates/craftBuilder/initDragging.ts & src/components/templates/craftBuilder/initHotKeys.ts
    if (getCustomObjectType(obj) == OBJECT_TYPES.workspace) {
        return false
    } return true;
}

export const getTemplateSectionBySectionId = (sectionId: any) => {
    return CRAFT_TEMPLATE_SECTIONS_LIST.find(section => section.id == sectionId);
}

export const getTemplateCategoryBySectionCategoryId = (sectionId: any, categoryId: any) => {
    return CRAFT_TEMPLATE_SECTIONS_LIST.find(section => section.id == sectionId).categories.find(category => category.id == categoryId);
}

export const getScaledDimentions = (width, height, maxWidth = 300) => {
    const scaleFactor = Math.min(1, maxWidth / Math.max(width, height));
    return {
        width: width * scaleFactor,
        height: height * scaleFactor,
    }
}

export function shiftAngle(start: fabric.Point, end: fabric.Point) {
    const startX = start.x;
    const startY = start.y;
    const x2 = end.x - startX;
    const y2 = end.y - startY;
    const r = Math.sqrt(x2 * x2 + y2 * y2);
    let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
    angle = ~~(((angle + 7.5) % 360) / 15) * 15;

    const cosx = r * Math.cos((angle * Math.PI) / 180);
    const sinx = r * Math.sin((angle * Math.PI) / 180);

    return {
        x: cosx + startX,
        y: sinx + startY,
    };
}
