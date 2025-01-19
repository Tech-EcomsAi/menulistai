'use client'
import React, { Fragment } from 'react'
import styles from './genericDashboard.module.scss';
import { Button, Card, Space, theme } from 'antd';
import { useRouter } from 'next/navigation'
import { LuCloudSun, LuHeartHandshake, LuHelpingHand, LuListOrdered, LuReplace, LuShare2, LuStar, LuSun, LuUser } from 'react-icons/lu';
import { useAppDispatch } from '@hook/useAppDispatch';
import { getDarkModeState, toggleDarkMode } from '@reduxSlices/clientThemeConfig';
import { useAppSelector } from '@hook/useAppSelector';
import SearchComponent from './searchComponent';
import { APPS_MENU, DASHBOARD_MENU, REPORTS_MENU, NavItemType, LIST_MENUS, REACH_US_LINKS, NAVIGARIONS_ROUTINGS } from '@constant/navigations';

function GenericDashboard() {
    const { token } = theme.useToken();
    const router = useRouter();
    const dispatch = useAppDispatch()
    const isDarkMode = useAppSelector(getDarkModeState)

    const getIcon = (icon: any) => {
        const ICON_COMPONENT = icon;
        return <ICON_COMPONENT />
    }

    const ABOUT_US_LINKS = [
        ...REACH_US_LINKS,
        { label: 'Suggest Feature', keywords: 'documentation,contact,about,ecomsai,support', icon: LuReplace, route: "documentation" },
        { label: 'Feedback', keywords: 'documentation,contact,about,ecomsai,support', icon: LuStar, route: "documentation" },
        { label: 'About us', keywords: 'documentation,contact,about,ecomsai,support', icon: LuUser, route: "documentation" },
        { label: 'Privacy & Terms', keywords: 'documentation,contact,about,ecomsai,support', icon: LuHelpingHand, route: "documentation" },
        { label: 'Share Us', keywords: 'documentation,contact,about,ecomsai,support', icon: LuShare2, route: "documentation" },
    ]

    const MENU_LIST = [
        { label: 'Apps', items: APPS_MENU[0].subNav, icon: APPS_MENU[0].icon },
        { label: 'Transactions', items: LIST_MENUS, icon: LuListOrdered },
        { label: 'Dashboards', items: DASHBOARD_MENU[0].subNav, icon: DASHBOARD_MENU[0].icon },
        { label: 'Reports', items: REPORTS_MENU[0].subNav, icon: REPORTS_MENU[0].icon },
        { label: 'How to Reach Us', items: ABOUT_US_LINKS, icon: LuHeartHandshake },
    ]

    return (
        <div className={styles.genericDashboardWrap}
            style={{
                background: token.colorBgBase,
                backgroundImage: `radial-gradient(circle at 10px 10px, ${token.colorTextDisabled} 1px, transparent 0)`,
            }}
        >
            <div className={styles.bgWrap}></div>
            <Button className={styles.darkModeTheme}
                type="text"
                size='large'
                shape='circle'
                style={{
                    fontSize: "20px",
                    background: token.colorFillContent,
                    color: isDarkMode ? 'goldenrod' : token.colorTextBase
                }}
                icon={isDarkMode ? <LuSun /> : <LuCloudSun />}
                onClick={() => dispatch(toggleDarkMode(!isDarkMode))}></Button>
            <Space direction='vertical' style={{ width: "100%" }} size={0}>
                {/* header */}
                <div className={styles.headerWrap}>
                    <h1 className={`${styles.heading}`} style={{ color: token.colorTextHeading }}>
                        <svg stroke={'#30c4b8'} fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 12l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h6"></path><path d="M9 21v-6a2 2 0 0 1 2 -2h2c.39 0 .754 .112 1.061 .304"></path>
                            <path stroke="palevioletred" d="M19 21.5l2.518 -2.58a1.74 1.74 0 0 0 0 -2.413a1.627 1.627 0 0 0 -2.346 0l-.168 .172l-.168 -.172a1.627 1.627 0 0 0 -2.346 0a1.74 1.74 0 0 0 0 2.412l2.51 2.59z"></path>
                        </svg>
                        <span> Home for your business</span>
                    </h1>
                    <h4 className={`${styles.subheading}`} style={{ color: token.colorTextLabel }}>
                        Unlock Potential, Explore Possibilities – Your Dashboard, Your Control
                    </h4>
                </div>
                {/* content */}

                <Space className={styles.contentWrap} size={20} align='center'>
                    <div className={styles.searchGroupWrap}>
                        <SearchComponent />
                        <Button onClick={() => router.push(NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_DASHBOARD)} >Your Websites Dashboard</Button>
                        <Space className={styles.groupWrap} wrap size={15}>

                            {MENU_LIST.map((groupDetails: any, gIndex: number) => {
                                const GroupIconComponent = groupDetails.icon;
                                return <Card className={styles.navGroup} bordered key={gIndex}>
                                    <Space direction='vertical' size={10}>
                                        <Space className={styles.navGroupName} style={{ color: token.colorPrimaryBorder }}>
                                            <div className={styles.groupIcon}>
                                                {<GroupIconComponent />}
                                            </div>
                                            <div className={styles.groupName} style={{ color: token.colorTextBase }}>
                                                {groupDetails.label}
                                            </div>
                                        </Space>
                                        <Space className={styles.navItems} wrap>
                                            {groupDetails.items.map((nav: NavItemType, i: number) => {
                                                const IconComponent = nav.icon;
                                                return <Fragment key={i}>
                                                    <Button size='large' icon={<IconComponent />} onClick={() => router.push(nav.route)}>{nav.label}</Button>
                                                </Fragment>
                                            })}
                                        </Space>
                                    </Space>
                                </Card>
                            })}
                        </Space>
                    </div>
                </Space>
            </Space>
        </div>
    )
}

export default GenericDashboard