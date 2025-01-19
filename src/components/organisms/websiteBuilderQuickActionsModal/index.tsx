import { PANEL_ACTIONS_LIST } from "@constant/builder";
import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import { MODAL_PAGES_LIST, getActiveModalPage, updateActiveModalPage } from "@reduxSlices/common";
import { updateBuilderSidebarPanelAction } from "@reduxSlices/siteBuilderState";
import { Button, Card, Modal, Space } from "antd";
import { LuKeyboard, LuLayers, LuPlus, LuSettings, LuX } from "react-icons/lu";
const { Meta } = Card

function WebsiteBuilderQuickActionsModal() {
    const activePage = useAppSelector(getActiveModalPage);
    const dispatch = useAppDispatch()

    const ACTIONS_LIST = [
        { group: "Show", icon: <LuLayers />, title: "Show website sections layers", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.LAYERS)) },
        { group: "Show", icon: <LuSettings />, title: "Show page settings", action: () => dispatch(updateActiveModalPage(MODAL_PAGES_LIST.WEBSITE_BUILDER_PAGE_SETTINGS)) },
        { group: "Show", icon: <LuSettings />, title: "Show webiste theme settings", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.GLOBAL)) },
        { group: "Show", icon: <LuKeyboard />, title: "Show webiste editor keyboards shortcuts", action: () => dispatch(updateActiveModalPage(MODAL_PAGES_LIST.WEBSITE_BUILDER_SHORTCUTS_PAGE)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Page", action: () => dispatch(updateActiveModalPage(MODAL_PAGES_LIST.ADD_WEBSITE_PAGE)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Section", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.SECTIONS)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Media Section", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.MEDIA)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Creative Section", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.CREATIVES)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Social Site Section", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.SOCIAL)) },
        { group: "Add", icon: <LuPlus />, title: "Add New Utility", action: () => dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.UTILITY)) },
    ]

    return (
        <Modal
            title="Quick Actions/Navigations"
            destroyOnClose
            open={Boolean(activePage == MODAL_PAGES_LIST.WEBSITE_BUILDER_ACTIONS_PAGE)}
            onCancel={() => dispatch(updateActiveModalPage(""))}
            styles={{
                mask: { backdropFilter: 'blur(6px)' },
                body: { maxWidth: '80vh' },
                footer: { display: "flex", justifyContent: "flex-end" }
            }}
            closeIcon={<LuX />}
            okText={"Add Page"}
            width={"max-content"}
            footer={<></>}
        >
            <Space style={{ width: "100%" }} align="start" styles={{ item: { width: "100%" } }}>
                <Card title="Add to website actions">
                    <Space direction="vertical" style={{ width: "100%" }} styles={{ item: { width: "100%" } }}>
                        {ACTIONS_LIST.filter(a => a.group == "Add").map((action: any, i: number) => {
                            return <Button
                                style={{ width: "100%" }}
                                type="default"
                                size="large"
                                key={i}
                                icon={action.icon}
                                onClick={() => {
                                    dispatch(updateActiveModalPage(""));
                                    action.action();
                                }}>
                                {action.title}
                            </Button>
                        })}
                    </Space>
                </Card>
                <Card title="View actions">
                    <Space direction="vertical" style={{ width: "100%" }} styles={{ item: { width: "100%" } }}>
                        {ACTIONS_LIST.filter(a => a.group == "Show").map((action: any, i: number) => {
                            return <Button

                                style={{ width: "100%", textAlign: "left" }}
                                type="default"
                                size="large"
                                key={i}
                                icon={action.icon}
                                onClick={() => {
                                    dispatch(updateActiveModalPage(""));
                                    action.action();
                                }}>
                                {action.title}
                            </Button>
                        })}
                    </Space>
                </Card>
            </Space>
        </Modal>
    )
}

export default WebsiteBuilderQuickActionsModal