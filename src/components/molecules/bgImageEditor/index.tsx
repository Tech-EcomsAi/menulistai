import { APP_NAME } from '@constant/common';
import { Button, Image, Tooltip, theme } from 'antd';
import { useState } from 'react';
import { BiShow } from 'react-icons/bi';
import styles from './bgImageEditor.module.scss';

function BgImageEditor({ active, imageData, onSelect, styleProps }: any) {
    const { token } = theme.useToken();
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className={`${styles.imageWrap} ${active ? styles.active : ''}`}
            style={{
                outlineColor: active ? token.colorPrimary : token.colorBorder,
                height: styleProps.height, width: styleProps.width || `calc(100% / ${styleProps.column} - 10px)`,
            }}
            onClick={() => onSelect(imageData)}
        >
            <div className={styles.imageContent} >
                <div className={styles.imageActionsWrap}>
                    <Tooltip title="Click to see large view of image">
                        <Button onClick={(e) => {
                            setShowPreview(true);
                            e.stopPropagation()
                        }} type="primary" size="middle" icon={<BiShow />} />
                    </Tooltip>
                    {/* <Tooltip title="Select image to view in builder">
                        <Button onClick={() => onSelect(imageData)} type="primary" size="middle" icon={<BiCheck />}>Select</Button>
                    </Tooltip> */}
                </div>
                {<Image alt={APP_NAME} src={imageData.thumb || imageData.src} preview={false} />}
                {showPreview && <Image alt={APP_NAME}
                    style={{ display: 'none' }}
                    src={imageData.thumb || imageData.src}
                    preview={{
                        visible: showPreview,
                        scaleStep: 1,
                        src: imageData.thumb || imageData.src,
                        style: { background: token.colorBgLayout },
                        onVisibleChange: (value) => setShowPreview(value),
                    }} />}
            </div>
            {imageData.title && <div className={styles.title} style={{ backgroundColor: active ? token.colorPrimary : '#d1d5e8' }}>{imageData.title}</div>}
        </div>
    )
}

export default BgImageEditor