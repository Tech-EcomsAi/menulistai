import { LoadingOutlined } from '@ant-design/icons';
import useInViewport from '@hook/useInViewport';
import iconcss from '@template/craftBuilder/tabsComposer/graphics/reactIconRenderer/reactIconRenderer.module.scss';
import { removeObjRef } from '@util/utils';
import { Spin, theme } from 'antd';
import React, { useRef, useState } from 'react';
import { ICONS_CATEGORY_LIST } from 'src/data/reactIcons';
import styles from './iconSelector.module.scss';

function IconSelector() {
    const { token } = theme.useToken();
    const [selectedIcons, setSelectedIcons] = useState([
        { "id": "bs", "name": "Bootstrap", icons: [] },
        { "id": "gi", "name": "Game", icons: [] },
        { "id": "fc", "name": "Flat Color", icons: [] },
        { "id": "wi", "name": "Weather", icons: [] },
        { "id": "im", "name": "IcoMoon", icons: [] },
        { "id": "ti", "name": "Typicons", icons: [] },
        { "id": "di", "name": "Devicons", icons: [] },
    ])
    const [activeCat, setActiveCat] = useState({ ...ICONS_CATEGORY_LIST[0], catIndex: 0 })
    const [iconsList, setIconsList] = useState(removeObjRef(ICONS_CATEGORY_LIST))
    const [activeTab, setactiveTab] = useState()

    const onSelectIcon = (iconIndex) => {
        const iconsListCopy: any = [...iconsList]
        // iconsListCopy[activeCat.catIndex].icons[iconIndex].selected = !iconsListCopy[activeCat.catIndex].icons[iconIndex].selected
        const selectedListCopy = [...selectedIcons]
        let index = selectedListCopy[activeCat.catIndex].icons.findIndex((i) => i.name == iconsList[activeCat.catIndex].icons[iconIndex].name)
        if (index == -1) {
            selectedListCopy[activeCat.catIndex].icons.push({ ...iconsList[activeCat.catIndex].icons[iconIndex], selected: true })
        } else {
            selectedListCopy[activeCat.catIndex].icons.splice(index, 1)
        }
        setSelectedIcons([...selectedListCopy])
        // setIconsList(iconsListCopy)
    }

    const onRemoveIcon = (catINdex, itemIndex) => {
        const selectedListCopy = [...selectedIcons]
        selectedListCopy[catINdex].icons.splice(itemIndex, 1)
        setSelectedIcons([...selectedListCopy])
    }

    const switchTab = (tab) => {
        localStorage.setItem(activeTab, JSON.stringify(selectedIcons))
        setactiveTab(tab)
        setActiveCat({ ...ICONS_CATEGORY_LIST[0], catIndex: 0 })
        setIconsList((ICONS_CATEGORY_LIST))
        let selected = localStorage.getItem(tab);
        setSelectedIcons([
            { "id": "bs", "name": "Bootstrap", icons: [] },
            { "id": "gi", "name": "Game", icons: [] },
            { "id": "fc", "name": "Flat Color", icons: [] },
            { "id": "wi", "name": "Weather", icons: [] },
            { "id": "im", "name": "IcoMoon", icons: [] },
            { "id": "ti", "name": "Typicons", icons: [] },
            { "id": "di", "name": "Devicons", icons: [] },
        ])
        // if (selected) {
        //     setSelectedIcons(JSON.parse(selected))
        // } else {
        //     setSelectedIcons([
        //         { "id": "bs", "name": "Bootstrap", icons: [] },
        //         { "id": "gi", "name": "Game", icons: [] },
        //         { "id": "fc", "name": "Flat Color", icons: [] },
        //         { "id": "wi", "name": "Weather", icons: [] },
        //         { "id": "im", "name": "IcoMoon", icons: [] },
        //         { "id": "ti", "name": "Typicons", icons: [] },
        //         { "id": "di", "name": "Devicons", icons: [] },
        //     ])
        // }
    }
    return (
        <div className={styles.iconSelectorWrap}>
            <div className={styles.heading}>
                <div className={styles.tab}
                    style={{
                        background: (activeTab == 'icons') ? token.colorPrimary : token.colorBorder,
                        borderColor: (activeTab == 'icons') ? token.colorPrimary : token.colorBorder,
                        color: (activeTab == 'icons') ? token.colorBgBase : token.colorTextBase,
                    }}
                    onClick={() => switchTab('icons')}>
                    ICONS ASSETS
                </div>
                <div className={styles.tab}
                    style={{
                        background: (activeTab == 'pattern') ? token.colorPrimary : token.colorBorder,
                        borderColor: (activeTab == 'pattern') ? token.colorPrimary : token.colorBorder,
                        color: (activeTab == 'pattern') ? token.colorBgBase : token.colorTextBase,
                    }}
                    onClick={() => switchTab('pattern')}>
                    PATTERNS ASSETS
                </div>
            </div>
            {activeTab ? <div className={styles.iconsContent}>
                <div className={styles.categoryWrap}>

                    <div className={styles.categoryList}>
                        {ICONS_CATEGORY_LIST.map((category, catIndex) => {
                            return <React.Fragment key={catIndex}>
                                <div className={`${styles.categoryDetails}`}
                                    style={{
                                        background: (activeCat.name == category.name) ? token.colorPrimary : token.colorBorder,
                                        borderColor: (activeCat.name == category.name) ? token.colorPrimary : token.colorBorder,
                                        color: (activeCat.name == category.name) ? token.colorBgBase : token.colorTextBase,
                                    }}
                                    onClick={() => setActiveCat({ ...category, catIndex })}>
                                    {category.name}
                                </div>
                            </React.Fragment>
                        })}
                    </div>

                    <div className={styles.categoryList}>
                        <div className={`${styles.iconsListWrap} ${styles.categoryItemsView}`}>
                            <div className={styles.stickyCategory} style={{ background: token.colorBgBase }}>
                                <div className={styles.categoriesWrap}>
                                    <div className={styles.category} style={{ zIndex: 1, position: 'relative', background: token.colorBgBase, borderColor: token.colorBorder, color: token.colorText }}>
                                        <div className={styles.categoryName}>
                                            {activeCat?.name}
                                        </div>
                                        <div className={styles.iconsWrap}>
                                            {activeCat?.icons?.map((icon, iconIndex) => {
                                                return <ReactIconRenderer viewType="" key={iconIndex} iconDetails={icon} onSelect={() => onSelectIcon(iconIndex)} />
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.selectedList}>
                    <div className={styles.categoryList}>
                        {selectedIcons.map((category, catIndex) => {
                            return <React.Fragment key={catIndex}>
                                <div className={`${styles.iconsListWrap} ${styles.categoryItemsView}`}>
                                    <div className={styles.stickyCategory} style={{ background: token.colorBgBase }}>
                                        <div className={styles.categoriesWrap}>
                                            <div className={styles.category} style={{ zIndex: 1, position: 'relative', background: token.colorBgBase, borderColor: token.colorBorder, color: token.colorText }}>
                                                <div className={styles.categoryName}>
                                                    {category.name}
                                                </div>
                                                <div className={styles.iconsWrap}>
                                                    {category.icons.map((icon, iconIndex) => {
                                                        return <ReactIconRenderer viewType="" key={iconIndex} iconDetails={icon} onSelect={() => onRemoveIcon(catIndex, iconIndex)} />
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        })}
                    </div>
                </div>
            </div> : <div className='d-f-c'>
                Select Tab
            </div>}
        </div>
    )
}

export default IconSelector



function ReactIconRenderer({ viewType, onSelect, iconDetails }) {
    const [hoverId, setHoverId] = useState(null);
    const IconComponent = iconDetails.icon;
    const { token } = theme.useToken();
    const iconRef = useRef();
    const isVisible = useInViewport(iconRef);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div className={`${iconcss.iconElementWrap} ${viewType == 'large' ? iconcss.largeView : ''}`}
            onClick={onSelect}
            onMouseEnter={() => setHoverId(iconDetails.name)}
            onMouseLeave={() => setHoverId('')}
            ref={iconRef}
            style={{
                background: (hoverId == iconDetails.name || iconDetails.selected) ? token.colorPrimary : token.colorBorder,
                borderColor: (hoverId == iconDetails.name || iconDetails.selected) ? token.colorPrimary : token.colorBorder,
                color: (hoverId == iconDetails.name || iconDetails.selected) ? token.colorBgBase : token.colorTextBase,
                width: '50px',
                height: '50px',
            }}>
            {isVisible ? <IconComponent /> : <>
                <Spin indicator={antIcon} />
            </>}
        </div>
    )
}

export { ReactIconRenderer };
