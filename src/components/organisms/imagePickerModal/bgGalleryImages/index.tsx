import BgImageEditor from '@molecules/bgImageEditor';
import { theme } from 'antd';
import { Fragment, useState } from 'react';
import { BG_IMAGES_List, imagesTypes } from 'src/data/bodyBackgroundImages';
import styles from './galleryImages.module.scss';

function BgGalleryImages({ setSelectedImage, selectedImage }) {

    const { token } = theme.useToken();
    const [activeCategory, setActiveCategory] = useState(imagesTypes[0]);

    return (
        <div className={styles.galleryImagesWrap}>
            <div className={styles.categoriesWrap} style={{ background: token.colorBgBase }}>
                {imagesTypes.map((category, i) => {
                    return <div className={styles.categoryName} key={i}
                        onClick={() => setActiveCategory(category)}
                        style={{ color: activeCategory == category ? token.colorPrimary : token.colorText }}>
                        {category}
                    </div>
                })}
            </div>
            <div className={styles.imagesWrap}>
                {BG_IMAGES_List[activeCategory].map((imageData, i) => {
                    return <Fragment key={i}>
                        <BgImageEditor
                            active={selectedImage?.src == imageData}
                            imageData={{ src: imageData }}
                            onSelect={(image) => setSelectedImage(image)}
                            styleProps={{ height: '200px', column: 3 }}
                        />
                    </Fragment>
                })}
            </div>
        </div>
    )
}

export default BgGalleryImages