import TextElement from '@antdComponent/textElement';
import Saperator from '@atoms/Saperator';
import SelectedItemCheck from '@atoms/selectedItemCheck';
import { DARK_COLORS, LIGHT_COLORS } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import AppLayoutSwitcher from '@organisms/appLayoutSwitcher';
import DateFormatSwitcher from '@organisms/dateFormatSwitcher';
import LanguageSwitcher from '@organisms/languageSwitcher';
import ThemeModeSwitcher from '@organisms/themeModeSwitcher';
import TimeFormatSwitcher from '@organisms/timeFormatSwitcher';
import TimezoneSwitcher from '@organisms/timezoneSwitcher';
import styles from '@organismsCSS/sidebarComponent/appSettingsPanel.module.scss';
import { getAppSettingsPanelStatus, getDarkColorState, getDarkModeState, getFullscreenModeState, getHeaderBgBlurState, getHeaderPositionState, getLightColorState, getRTLDirectionState, getShowDateInHeaderState, getShowUserDetailsInHeaderState, toggleAppSettingsPanel, toggleFullscreenMode, toggleHeaderBgBlur, toggleHeaderPosition, toggleRTLDirection, toggleShowDateInHeader, toggleShowUserDetailsInHeader, updateDarkThemeColor, updateLightThemeColor } from '@reduxSlices/clientThemeConfig';
import { showErrorToast, showSuccessToast } from '@reduxSlices/toast';
import { convertRGBtoOBJ, hexToRgbA } from '@util/utils';
import { Button, Checkbox, Drawer, Flex, Space, theme } from 'antd';
import { Fragment, memo, useEffect } from 'react';
import { LuArrowLeftFromLine, LuArrowRightFromLine, LuX } from 'react-icons/lu';

const colorsList = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
}

const AppSettingsPanel = () => {
  const { token } = theme.useToken();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(getDarkModeState)
  const lightThemeColor = useAppSelector(getLightColorState)
  const darkThemeColor = useAppSelector(getDarkColorState)
  const isOpen = useAppSelector(getAppSettingsPanelStatus)
  const fixedHeader = useAppSelector(getHeaderPositionState)
  const headerBgBlured = useAppSelector(getHeaderBgBlurState)
  const isRTLDirection = useAppSelector(getRTLDirectionState)
  const showDateInHeader = useAppSelector(getShowDateInHeaderState)
  const showUserInHeader = useAppSelector(getShowUserDetailsInHeaderState)
  const fullscreenMode = useAppSelector(getFullscreenModeState);

  useEffect(() => {
    dispatch(toggleFullscreenMode(false))
  }, [])

  const updateThemeColor = (color: any) => {
    if (isDarkMode) {
      dispatch(updateDarkThemeColor(color))
    } else {
      dispatch(updateLightThemeColor(color))
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setTimeout(() => {
        if (Boolean(window?.document?.fullscreenEnabled)) {
          dispatch(showSuccessToast("Fullscreen mode enabled"))
          dispatch(toggleFullscreenMode(true))
        }
        else dispatch(showErrorToast("Your broweser does not support fullscreen mode"))
      }, 1000);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      dispatch(showSuccessToast("Fullscreen mode disabled"))
      dispatch(toggleFullscreenMode(false))
    }
  }

  const renderTitle = () => {
    return <Space direction='vertical' size={0}>
      <TextElement text={'App Appearance'} size="medium" type='primary' />
      <TextElement text={'Customize & Preview in Real Time'} size="small" />
    </Space>
  }

  return (
    <>
      <Drawer
        title={renderTitle()}
        placement={"right"}
        closable={false}
        onClose={() => dispatch(toggleAppSettingsPanel(!isOpen))}
        destroyOnClose={true}
        open={isOpen}
        key={"app-settings"}
        extra={<Button shape='circle' icon={<LuX />} onClick={() => dispatch(toggleAppSettingsPanel(!isOpen))} />}
      >
        <Flex vertical>
          {/* //color mode wrap */}
          <ThemeModeSwitcher />
          {/* //side bar wrap */}
          <Saperator />

          <AppLayoutSwitcher />

          {/* //theme color wrap */}
          <Saperator />
          <div className={styles.settingsWrap}>
            <TextElement text={'Color presets'} size="medium" />
            <div className={styles.settingsDetails}>
              <div className={styles.setting}
                style={{ borderColor: token.colorBorder, transform: "unset" }}>
                <TextElement text={'Primary theme color'} />
                <Flex className={`${styles.skeletonWrap} ${styles.colors}`} >
                  {colorsList[isDarkMode ? "dark" : "light"].map((color: any, i: number) => {
                    const rgbaColors: any = convertRGBtoOBJ(hexToRgbA(color));
                    return <Fragment key={i}>
                      <Button className={styles.element}
                        onClick={() => updateThemeColor(color)}
                        style={{ background: `rgba(${rgbaColors.r}, ${rgbaColors.g}, ${rgbaColors.b}, ${0.6})`, borderColor: color }}>
                        <SelectedItemCheck active={isDarkMode ? (darkThemeColor == color) : (lightThemeColor == color)} />
                        <span style={{ background: color, borderRadius: isDarkMode ? (darkThemeColor == color ? "4px" : "15px") : (lightThemeColor == color ? "4px" : "15px") }}></span>
                      </Button>
                    </Fragment>
                  })}
                </Flex>
              </div>
            </div>
          </div>

          <Saperator />
          <LanguageSwitcher />

          <Saperator />
          <TimezoneSwitcher />
          <Saperator />

          <Flex gap={10}>
            <DateFormatSwitcher />
            <TimeFormatSwitcher />
          </Flex>

          <Saperator />

          {/* //App rtl */}
          <Flex vertical gap={10}>
            <Flex gap={10}>
              <Button
                block
                onClick={() => dispatch(toggleRTLDirection(true))}
                size="large"
                type={isRTLDirection ? "primary" : "default"}
                icon={<LuArrowLeftFromLine />}>
                RTL
              </Button>
              <Button
                block
                onClick={() => dispatch(toggleRTLDirection(false))}
                size="large"
                type={isRTLDirection ? "default" : "primary"}
                icon={<LuArrowRightFromLine />}>
                LTR
              </Button>
            </Flex>
            {/* <Checkbox defaultChecked={isRTLDirection} checked={isRTLDirection} onChange={() => dispatch(toggleRTLDirection(!isRTLDirection))}>RTL Direction Layout</Checkbox> */}
          </Flex>

          {/* //Fixed Header */}
          <Saperator />
          <Flex vertical gap={10}>
            <Checkbox defaultChecked={fixedHeader} checked={fixedHeader} onChange={() => dispatch(toggleHeaderPosition(!fixedHeader))}>Fixed Header</Checkbox>
          </Flex>

          {/* //Blur Header */}
          <Saperator />
          <Flex vertical gap={10}>
            <Checkbox defaultChecked={headerBgBlured} checked={headerBgBlured} onChange={() => dispatch(toggleHeaderBgBlur(!headerBgBlured))}>Blur Header</Checkbox>
          </Flex>

          {/* //Current date in header */}
          <Saperator />
          <Flex vertical gap={10}>
            <Checkbox defaultChecked={showDateInHeader} checked={showDateInHeader} onChange={() => dispatch(toggleShowDateInHeader(!showDateInHeader))}>Todays date in header</Checkbox>
          </Flex>

          {/* //User details in header */}
          <Saperator />
          <Flex vertical gap={10}>
            <Checkbox defaultChecked={showUserInHeader} checked={showUserInHeader} onChange={() => dispatch(toggleShowUserDetailsInHeader(!showUserInHeader))}>Logged in user name in header</Checkbox>
          </Flex>

          {/* //Fullscreen mode */}
          <Saperator />
          <Flex vertical gap={10}>
            <Checkbox defaultChecked={fullscreenMode} checked={fullscreenMode} onChange={toggleFullscreen} >Fullscreen Mode</Checkbox>
          </Flex>

        </Flex>
        <Saperator />

      </Drawer>
    </>
  );
};

export default memo(AppSettingsPanel);