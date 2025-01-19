import { getWorkspaceObject } from "./craftBuilderUtils";

const createCanvas = (width: number, height: number) => {
    const waterCanvas: HTMLCanvasElement = document.createElement('canvas');
    waterCanvas.width = width;
    waterCanvas.height = height;
    waterCanvas.style.position = 'fixed';
    waterCanvas.style.opacity = '0';
    waterCanvas.style.zIndex = '-1';
    return waterCanvas;
}

export const getWatermarkLayerImage = (canvas, watermarkState) => {

    return new Promise((resolve, reject) => {
        enum POSITION {
            lt = 'Left Top',
            lb = 'Left Right',
            rt = 'Right Top',
            rb = 'Right Bottom',
            full = 'Fullscreen',
        }

        const workspace = getWorkspaceObject(canvas);
        const { width, height, left, top }: any = workspace;

        const drawing = {
            [POSITION.lt]: (width: number, height: number, cb: (imgString: string) => void) => {
                let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
                const w = waterCanvas.width || width;
                let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
                ctx.fillStyle = watermarkState.color;
                ctx.font = `${watermarkState.size}px ${watermarkState.fontFamily}`;
                ctx.fillText(watermarkState.text, 10, watermarkState.size + 10, w - 20);
                cb && cb(waterCanvas.toDataURL());
                waterCanvas = null;
                ctx = null;
            },
            [POSITION.rt]: (width: number, height: number, cb: (imgString: string) => void) => {
                let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
                let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
                const w = waterCanvas.width || width;
                ctx.fillStyle = watermarkState.color;
                ctx.font = `${watermarkState.size}px ${watermarkState.fontFamily}`;
                ctx.fillText(
                    watermarkState.text,
                    w - ctx.measureText(watermarkState.text).width - 20,
                    watermarkState.size + 10,
                    w - 20
                );
                cb && cb(waterCanvas.toDataURL());
                waterCanvas = null;
                ctx = null;
            },
            [POSITION.lb]: (width: number, height: number, cb: (imgString: string) => void) => {
                let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
                let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
                const w = waterCanvas.width || width;
                const h = waterCanvas.height || height;
                ctx.fillStyle = watermarkState.color;
                ctx.font = `${watermarkState.size}px ${watermarkState.fontFamily}`;
                ctx.fillText(watermarkState.text, 10, h - watermarkState.size, w - 20);
                cb && cb(waterCanvas.toDataURL());
                waterCanvas = null;
                ctx = null;
            },
            [POSITION.rb]: (width: number, height: number, cb: (imgString: string) => void) => {
                let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
                let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
                const w = waterCanvas.width || width;
                ctx.fillStyle = watermarkState.color;
                ctx.font = `${watermarkState.size}px ${watermarkState.fontFamily}`;
                ctx.fillText(
                    watermarkState.text,
                    w - ctx.measureText(watermarkState.text).width - 20,
                    height - watermarkState.size,
                    width - 20
                );
                cb && cb(waterCanvas.toDataURL());
                waterCanvas = null;
                ctx = null;
            },
            [POSITION.full]: (width: number, height: number, cb: (imgString: string) => void) => {
                const angle = -30; // Calculate with 30 degrees counterclockwise
                const R = (angle * Math.PI) / 180;
                const font = `${watermarkState.size}px ${watermarkState.fontFamily}`;
                let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
                let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
                ctx.font = font;
                const textW = ctx.measureText(watermarkState.text).width + 40;
                let patternCanvas: HTMLCanvasElement | null = createCanvas(
                    watermarkState.isRotate ? textW * Math.abs(Math.cos(R)) + watermarkState.size : textW,
                    watermarkState.isRotate
                        ? textW * Math.abs(Math.sin(R)) + watermarkState.size
                        : watermarkState.size + 20
                );
                document.body.appendChild(patternCanvas);
                let ctxWater: CanvasRenderingContext2D | null = patternCanvas.getContext('2d')!;
                ctxWater.textAlign = 'left';
                ctxWater.textBaseline = 'top';
                ctxWater.font = font;
                ctxWater.fillStyle = `${watermarkState.color}`;
                if (watermarkState.isRotate) {
                    ctxWater.translate(0, textW * Math.abs(Math.sin(R)));
                    ctxWater.rotate(R);
                    ctxWater.fillText(watermarkState.text, 0, 0);
                } else {
                    ctxWater.fillText(watermarkState.text, 10, 10);
                }
                ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat')!;
                ctx.fillRect(0, 0, width, height);
                cb && cb(waterCanvas.toDataURL());
                waterCanvas = null;
                patternCanvas = null;
                ctx = null;
                ctxWater = null;
            },
        };
        drawing[watermarkState?.position](width, height, (imgString: string) => {
            resolve(imgString);
        });
    })
}