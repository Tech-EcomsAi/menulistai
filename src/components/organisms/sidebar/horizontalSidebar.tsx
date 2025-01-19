import { NavItemType, SIDEBAR_DASHBOARD_LAYOUT } from '@constant/navigations';
import { useAppSelector } from '@hook/useAppSelector';
import { getHeaderPositionState, getSidebarLayoutState } from '@reduxSlices/clientThemeConfig';
import { Flex, Menu, MenuProps, theme } from 'antd';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuArrowBigDown } from 'react-icons/lu';
import styles from './horizontalSidebarComponent.module.scss';

const HorizontalSidebarComponent = () => {

    const { token } = theme.useToken();
    const router = useRouter()
    const [activeNav, setActiveNav] = useState<any[]>([]);
    const currentLayout = useAppSelector(getSidebarLayoutState)
    const fixedHeader = useAppSelector(getHeaderPositionState)
    const pathname = usePathname()

    const getMenuItems = () => {
        const menuCopy = [];
        SIDEBAR_DASHBOARD_LAYOUT.map((nav: NavItemType) => {
            const navItem: any = {
                key: nav.label,
                label: nav.label,
                icon: <nav.icon />,
                route: `${nav.route}`,
                children: Boolean(nav.subNav?.length) ?
                    nav.subNav.map((subnav: NavItemType, subIndex: number) => {
                        return {
                            key: `${nav.label}-${subnav.label}`,
                            label: subnav.label,
                            icon: <subnav.icon />,
                            route: `${subnav.route}`,
                            className: styles.menuItemWrap,
                        }
                    }) : null,
                className: styles.menuItemWrap,
                popupClassName: styles.subMenuWrap

            }
            menuCopy.push(navItem)
        })
        return menuCopy;
    }

    useEffect(() => {
        let currentNav, currentSubNav;
        getMenuItems().map((nav: any, index: number) => {
            //second level sub nav clicked
            if (Boolean(nav?.children?.length)) {
                nav.children.map((subnav: NavItemType, subIndex: number) => {
                    subnav.active = false
                    if (pathname == `${subnav.route}`) {
                        // nav.showSubNav = true;
                        currentSubNav = subnav;
                        currentNav = nav;
                    }
                })
            } else if (pathname == `${nav.route}`) {
                currentNav = nav;
            }
        })

        if (currentNav) {
            if (currentSubNav) {
                setActiveNav([currentNav.key, currentSubNav.key])
            } else {
                setActiveNav([currentNav.key])
            }
        }
    }, [pathname])

    const onClickNav: MenuProps['onClick'] = (menu: any) => {
        console.log("menu", menu)

        getMenuItems().map((nav: any) => {
            if (Boolean(nav?.children?.length)) {
                nav.children.map((subnav: NavItemType) => {
                    if (subnav.key == menu.key) {
                        // activeSubNav = subnav;
                        // activeNav = nav;
                        if (subnav.route) router.push(`${subnav.route}`);
                    }
                })
            } else {
                if (nav.key == menu.key) {
                    // activeNav = nav;
                    router.push(`${nav.route}`);
                }
            }
        })
    };

    return (
        <motion.div
            className={`${styles.sidebarContainer} ${styles[currentLayout]}`}
            style={{ backgroundColor: token.colorBgBase, top: fixedHeader ? "52px" : 0 }}>
            <Flex gap={10}>
                <Menu
                    className={styles.sidebarMenu}
                    expandIcon={<LuArrowBigDown />}
                    style={{ width: '100%' }}
                    defaultSelectedKeys={activeNav}
                    selectedKeys={activeNav}
                    mode={"horizontal"}
                    items={getMenuItems()}
                    onClick={onClickNav}
                />
            </Flex>
        </motion.div>
    )
}

export default HorizontalSidebarComponent

