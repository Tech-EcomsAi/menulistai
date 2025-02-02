import { Button, Flex, Image, theme } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

interface ZoomableImageProps {
    src: string;
    alt: string;
    style?: React.CSSProperties;
}

export function ZoomableImage({ src, alt, style }: ZoomableImageProps) {
    const { token } = theme.useToken();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const imgElement = document.querySelector('.zoomable-image img') as HTMLImageElement;
        if (imgElement) {
            imageRef.current = imgElement;
        }
    }, []);
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.5, 4));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => Math.max(prev - 0.5, 1));
    }, []);

    const getBoundedPosition = useCallback((x: number, y: number) => {
        if (!containerRef.current || !imageRef.current) return { x, y };

        const container = containerRef.current.getBoundingClientRect();
        const image = imageRef.current.getBoundingClientRect();

        const maxX = (image.width * zoom - container.width) / 2;
        const maxY = (image.height * zoom - container.height) / 2;

        return {
            x: Math.min(Math.max(x, -maxX), maxX),
            y: Math.min(Math.max(y, -maxY), maxY)
        };
    }, [zoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (zoom > 1) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
            setStartPosition({ ...position });
        }
    }, [zoom, position]);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (zoom > 1) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            setStartPosition({ ...position });
        }
    }, [zoom, position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging && zoom > 1) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            const newPosition = getBoundedPosition(
                startPosition.x + deltaX,
                startPosition.y + deltaY
            );
            setPosition(newPosition);
        }
    }, [isDragging, dragStart, startPosition, zoom, getBoundedPosition]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging && zoom > 1) {
            e.preventDefault();
            const deltaX = e.touches[0].clientX - dragStart.x;
            const deltaY = e.touches[0].clientY - dragStart.y;
            const newPosition = getBoundedPosition(
                startPosition.x + deltaX,
                startPosition.y + deltaY
            );
            setPosition(newPosition);
        }
    }, [isDragging, dragStart, startPosition, zoom, getBoundedPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (zoom === 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [zoom]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

    return (
        <div style={{ position: 'relative', ...style }}>
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    overflow: 'hidden',
                    cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default'),
                    userSelect: 'none',
                    touchAction: 'none',
                    position: 'relative'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onDragStart={e => e.preventDefault()}
            >
                <Image
                    rootClassName="zoomable-image"
                    preview={false}
                    src={src}
                    alt={alt}
                    draggable={false}
                    style={{
                        width: '100%',
                        minWidth: 300,
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transformOrigin: '0 0',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                        pointerEvents: 'none'
                    }}
                />
                <Flex
                    gap={8}
                    style={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        background: token.colorBgContainer,
                        padding: '4px 8px',
                        borderRadius: 8,
                        boxShadow: token.boxShadowSecondary,
                        zIndex: 9,
                        opacity: 0.9,
                        backdropFilter: 'blur(8px)',
                        transition: 'opacity 0.3s ease'
                    }}
                    className="zoom-controls"
                >
                    <Button
                        type="text"
                        icon={<LuMinus />}
                        onClick={handleZoomOut}
                        size="small"
                        disabled={zoom <= 1}
                    />
                    <span style={{
                        color: token.colorTextSecondary,
                        minWidth: 45,
                        textAlign: 'center'
                    }}>
                        {Math.round(zoom * 100)}%
                    </span>
                    <Button
                        type="text"
                        icon={<LuPlus />}
                        onClick={handleZoomIn}
                        size="small"
                        disabled={zoom >= 4}
                    />
                </Flex>
            </div>
            <style jsx global>{`
                .zoom-controls {
                    opacity: 0.9;
                }
                .zoom-controls:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

export default ZoomableImage;
