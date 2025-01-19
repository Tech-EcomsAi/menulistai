import BgImageEditor from '@molecules/bgImageEditor';
import { Button, Flex, Typography, theme } from 'antd';
import { Fragment, useState } from 'react';
import { BG_IMAGES_List, imagesTypes } from 'src/data/backgroundImages';
import styles from './galleryImages.module.scss';
const { Text } = Typography
const configSample = {
    type: 'small'
}
function GalleryImages({ currentPage = "", config, setSelectedImage, selectedImage }) {

    const { token } = theme.useToken();
    const [activeCategory, setActiveCategory] = useState(imagesTypes[config.type][0]);
    const [hoverId, setHoverId] = useState(null)

    return (
        <div className={styles.galleryImagesWrap}>
            <div className={styles.categoriesWrap} style={{ background: token.colorBgBase }}>
                {imagesTypes[config.type].map((category, i) => {
                    return <Button
                        key={i}
                        onClick={() => setActiveCategory(category)}
                        onMouseEnter={() => setHoverId(category)}
                        onMouseLeave={() => setHoverId('')}
                        style={{
                            zIndex: activeCategory == category ? 2 : 1,
                            position: activeCategory == category ? 'sticky' : 'relative'
                        }}
                        type={activeCategory == category ? "primary" : "default"}
                    >
                        {category}
                    </Button>
                })}
            </div>

            <Flex justify="space-between" align='center'>
                <Text style={{ textAlign: "center", lineHeight: 4, fontWeight: "bold" }} >{activeCategory}</Text>
                <Button type='text'>View All</Button>
            </Flex>

            <div className={styles.imagesWrap}>
                {BG_IMAGES_List[config.type][activeCategory].map((imageData, i) => {
                    return <Fragment key={i}>
                        <BgImageEditor
                            active={selectedImage?.src == imageData}
                            imageData={{ src: imageData }}
                            onSelect={(image) => setSelectedImage(image)}
                            styleProps={{ height: 'auto', column: 3 }}
                        />
                    </Fragment>
                })}
            </div>
        </div>
    )
}

export default GalleryImages