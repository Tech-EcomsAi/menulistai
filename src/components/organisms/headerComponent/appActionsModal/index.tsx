import TextElement from '@antdComponent/textElement'
import { CRAFT_BUILDER_NAVIGARIONS_ROUTINGS } from '@constant/navigations'
import { useAppDispatch } from '@hook/useAppDispatch'
import { useAppSelector } from '@hook/useAppSelector'
import { getDarkModeState, toggleAppSettingsPanel, toggleDarkMode } from '@reduxSlices/clientThemeConfig'
import { Button, Card, Divider, Flex, Popconfirm, Space, theme, Typography } from 'antd'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { LuAlarmPlus, LuBanknote, LuCalendarPlus, LuCloudSun, LuImagePlus, LuPlus, LuSmile, LuSun, LuUser, LuUserPlus, LuX } from 'react-icons/lu'
import styles from './appActionsModal.module.scss'
const { Text } = Typography;

function AppActionsModal({ children }) {
    const { token } = theme.useToken();
    const router = useRouter();
    const [hoverId, setHoverId] = useState(null)
    const dispatch = useAppDispatch()
    const isDarkMode = useAppSelector(getDarkModeState);

    const ACTIONS_LIST = [
        { title: "My Profile", icon: <LuUser />, onClick: () => { } },
        { title: isDarkMode ? "Light Mode" : "Dark Mode", icon: isDarkMode ? <LuSun /> : <LuCloudSun />, onClick: () => dispatch(toggleDarkMode(!isDarkMode)) },
        { title: "Image Editor", icon: <LuImagePlus />, onClick: () => router.push(CRAFT_BUILDER_NAVIGARIONS_ROUTINGS.ROOT) },
        { title: "Appearance", icon: <LuSmile />, onClick: () => dispatch(toggleAppSettingsPanel(true)) },
        { title: "Add User", icon: <LuUserPlus />, onClick: () => { } },
        { title: "Add Note", icon: <LuBanknote />, onClick: () => { } },
        { title: "Add Product", icon: <LuPlus />, onClick: () => { } },
        { title: "Add Reminder", icon: <LuAlarmPlus />, onClick: () => { } },
        { title: "Appointment", icon: <LuCalendarPlus />, onClick: () => { } },
    ]

    const closeModalForceFully = () => {
        const ele: any = document.getElementById("modal-close-btn");
        ele && ele.click();
    }

    const handleClose = () => {
        closeModalForceFully()
    }

    const onClickAction = (action) => {
        action.onClick();
        handleClose()
        // message.open({ content: `${action.title} clicked` })
    }

    const renderTitle = () => {
        return <Flex vertical>
            <Flex justify='space-between' align='center' style={{ width: "100%" }}>
                <Text>Quick Actions Menu</Text>
                <Button icon={<LuX />} type='default' size='small' shape='circle' onClick={closeModalForceFully} />
            </Flex>
            <Divider style={{ margin: "6px 0 10px" }} />
        </Flex>
    }

    const renderAppActions = () => {
        return <div className={styles.appActionsWrap}>
            {ACTIONS_LIST.map((action, i) => {
                return <Card key={i} className={styles.actionCard}
                    onClick={() => onClickAction(action)}
                    styles={{ body: { padding: "unset" } }}
                    size='small'
                    type='inner'
                    hoverable
                    style={{ background: action.title == hoverId ? token.colorBgTextHover : token.colorBgBase }}
                    onMouseEnter={() => setHoverId(action.title)}
                    onMouseLeave={() => setHoverId('')}
                >
                    <Space direction='vertical' align='center'>
                        <Button icon={action.icon} size='large' shape='circle' type='text' style={{ fontSize: 22, color: hoverId == action.title ? token.colorPrimary : token.colorTextLabel }} />
                        <TextElement text={action.title} styles={{ textAlign: "center", display: "block" }} />
                    </Space>
                </Card>
            })}
        </div>
    }

    return (
        <Fragment>
            <Popconfirm
                placement="bottomRight"
                destroyTooltipOnHide
                title={renderTitle()}
                description={renderAppActions()}
                icon={<></>}
                okText=""
                okType='text'
                okButtonProps={{ style: { height: "0" }, type: "text" }}
                cancelButtonProps={{ style: { height: "0" }, type: "text", id: "modal-close-btn" }}
                cancelText=""
            >
                {children}
            </Popconfirm>
        </Fragment>
    )
}

export default AppActionsModal