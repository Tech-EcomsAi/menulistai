'use client'
import SelectedItemCheck from '@atoms/selectedItemCheck';
import { DARK_COLORS, LIGHT_COLORS, PAGE_HEADING_FONT_SIZE } from '@constant/common';
import { ECOMSAI_PLATFORM_USER_ROLE } from '@constant/user';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { useClientAuthSession } from '@hook/useClientAuthSession';
import LanguageSwitcher from '@organisms/languageSwitcher';
import ThemeModeSwitcher from '@organisms/themeModeSwitcher';
import TimezoneSwitcher from '@organisms/timezoneSwitcher';
import { getDarkColorState, getDarkModeState, getLightColorState, updateDarkThemeColor, updateLightThemeColor } from '@reduxSlices/clientThemeConfig';
import PlatformUsers from '@template/platform/users';
import { convertRGBtoOBJ, hexToRgbA } from '@util/utils';
import { Button, Flex, theme, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { LuBuilding, LuBuilding2, LuCaseUpper, LuImage, LuList, LuSettings, LuUser } from 'react-icons/lu';
import StoresDashboard from '../stores';
import TenantsDashboard from '../tenants';
import styles from './settings.module.scss';
const { Text } = Typography;

const colorsList = {
    light: LIGHT_COLORS,
    dark: DARK_COLORS,
}

function PlatformSettings() {

    const isDarkMode = useAppSelector(getDarkModeState)
    const dispatch = useAppDispatch()
    const lightThemeColor = useAppSelector(getLightColorState)
    const darkThemeColor = useAppSelector(getDarkColorState)
    const [activetab, setActivetab] = useState('')
    const { token } = theme.useToken();
    const router = useRouter();
    const session = useClientAuthSession();

    const SETTING_NAVIGATIONS = [
        { active: true, route: "", name: "Settings", icon: <LuSettings /> },
        { active: true, route: "fonts", name: "Font Presets", icon: <LuCaseUpper /> },
        { active: true, route: "assets", name: "Assets", icon: <LuImage /> },
        { active: session.platformRole == ECOMSAI_PLATFORM_USER_ROLE, route: "logs", name: "Logs", icon: <LuList /> },
        { active: session.platformRole == ECOMSAI_PLATFORM_USER_ROLE, route: "users", name: "Users", icon: <LuUser /> },
        { active: session.platformRole == ECOMSAI_PLATFORM_USER_ROLE, route: "tenants", name: "Tenants", icon: <LuBuilding /> },
        { active: session.platformRole == ECOMSAI_PLATFORM_USER_ROLE, route: "stores", name: "Stores", icon: <LuBuilding2 /> },
    ]

    const updateThemeColor = (color: any) => {
        if (isDarkMode) {
            dispatch(updateDarkThemeColor(color))
        } else {
            dispatch(updateLightThemeColor(color))
        }
    }

    const getContent = () => {
        switch (activetab) {
            case "users":
                return <PlatformUsers />
            case "tenants":
                return <TenantsDashboard />
            case "stores":
                return <StoresDashboard />
            default:
                return <Flex vertical gap={10}>
                    <Text strong style={{ fontSize: PAGE_HEADING_FONT_SIZE }}>Change your app apperance and settings</Text>

                    <LanguageSwitcher />

                    <TimezoneSwitcher />

                    <ThemeModeSwitcher />

                    <Flex vertical gap={10}>
                        <Text>Theme Color</Text>
                        <Flex gap={10}>
                            {colorsList[isDarkMode ? "dark" : "light"].map((color: any, i: number) => {
                                const rgbaColors: any = convertRGBtoOBJ(hexToRgbA(color));
                                return <Fragment key={i}>
                                    <Button
                                        onClick={() => updateThemeColor(color)}
                                        style={{ background: `rgba(${rgbaColors.r}, ${rgbaColors.g}, ${rgbaColors.b}, ${0.6})`, borderColor: color }}>
                                        <SelectedItemCheck active={isDarkMode ? (darkThemeColor == color) : (lightThemeColor == color)} />
                                        <span style={{ background: color, borderRadius: isDarkMode ? (darkThemeColor == color ? "4px" : "15px") : (lightThemeColor == color ? "4px" : "15px") }}></span>
                                    </Button>
                                </Fragment>
                            })}
                        </Flex>
                    </Flex>
                </Flex>
        }
    }

    return (
        <Flex justify='flex-start' align='flex-start' >
            <Flex className={styles.navigations} style={{ boxShadow: token.boxShadow }} justify="flex-start" align="flex-start" vertical gap={10}>
                {SETTING_NAVIGATIONS.map((nav: any, i: number) => {
                    if (!nav.active) return null
                    return <Fragment key={i}>
                        <Button type={(nav.name == "Profile" && !activetab) || activetab == nav.route ? "primary" : "default"}
                            styles={{ icon: { fontSize: 20 } }}
                            size="large"
                            ghost={(nav.name == "Profile" && !activetab) || activetab == nav.route}
                            block
                            onClick={() => setActivetab(nav.route)} icon={nav.icon}>{nav.name}</Button>
                    </Fragment>
                })}
            </Flex>
            <Flex className={styles.contentWrap} style={{ padding: activetab != 'assets' ? 20 : 0 }}>
                {getContent()}
            </Flex>
        </Flex>
    )
}

export default PlatformSettings