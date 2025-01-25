'use client'

import { SKIP_CLIENT_APP_LAYOUT_ROUTINGS } from '@constant/navigations';
import { useAppSelector } from '@hook/useAppSelector';
import HeadMetaTags from '@organisms/headMetaTags';
import HorizontalSidebar from '@organisms/sidebar/horizontalSidebar';
import AntdThemeProvider from '@providers/antdThemeProvider';
import { getDarkModeState, getHeaderPositionState, getRTLDirectionState, getSidebarLayoutState, getSidebarState } from '@reduxSlices/clientThemeConfig';
import { Layout, theme } from 'antd';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import styles from './layoutWrapper.module.scss';

const AppSettingsPanel = dynamic(() => import('@organisms/sidebar/appSettingsPanel'), { ssr: false });
const HeaderComponent = dynamic(() => import('@organisms/headerComponent'), { ssr: false });
const SidebarComponent = dynamic(() => import('@organisms/sidebar'), { ssr: false });

const { Content } = Layout;
export default function AntdLayoutWrapper(props: any) {

    const isCollapsed = useAppSelector(getSidebarState);
    const isDarkMode = useAppSelector(getDarkModeState);
    const isRTLDirection = useAppSelector(getRTLDirectionState)
    const { token } = theme.useToken();
    const pathname = usePathname();
    const isVerticalSidebar = useAppSelector(getSidebarLayoutState)
    const fixedHeader = useAppSelector(getHeaderPositionState)

    const renderContent = () => {

        if (SKIP_CLIENT_APP_LAYOUT_ROUTINGS.includes(pathname)) {
            return <>{props.children}</>
        } else {
            return <Layout className={`${styles.layoutWrapper}`} dir={isRTLDirection ? "rtl" : "ltr"} >
                <HeadMetaTags title={undefined} description={undefined} image={undefined} siteName={undefined} storeData={undefined} />
                <Fragment>
                    <Layout style={isVerticalSidebar ? { paddingLeft: isCollapsed ? "62px" : "200px", paddingTop: (isVerticalSidebar && fixedHeader) ? 52 : 0 } : {}}>
                        <HeaderComponent />
                        {isVerticalSidebar ? <SidebarComponent /> : <HorizontalSidebar />}
                        <AppSettingsPanel />
                        <Content className={styles.mainContentWraper}
                            style={{
                                backgroundImage: isDarkMode ? `radial-gradient(#dee1ec57 0.8px, transparent 0)` : `radial-gradient(#cbcbcb 1px, transparent 0)`,
                                // background: isDarkMode ? token.colorFillContent : token.colorBgBase,
                                minHeight: isVerticalSidebar ? 'calc(100vh - 52px)' : 'calc(100vh - 98px)',
                                width: "100%"
                            }}>
                            {props.children}
                        </Content>
                    </Layout>
                </Fragment>
            </Layout>
        }
    }
    return (
        <AntdThemeProvider>
            {renderContent()}
        </AntdThemeProvider>
    )
}