import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import { MODAL_PAGES_LIST, getActiveModalPage, updateActiveModalPage } from "@reduxSlices/common";
import { Modal } from "antd";
import { LuX } from "react-icons/lu";

function WebsiteBuilderPageSettings() {
    const activePage = useAppSelector(getActiveModalPage);
    const dispatch = useAppDispatch()
    return (
        <Modal
            destroyOnClose
            open={Boolean(activePage == MODAL_PAGES_LIST.WEBSITE_BUILDER_PAGE_SETTINGS)}
            onCancel={() => dispatch(updateActiveModalPage(""))}
            styles={{
                mask: { backdropFilter: 'blur(6px)' },
                body: { maxWidth: '80vh' },
                footer: { display: "flex", justifyContent: "flex-end" }
            }}
            closeIcon={<LuX />}
            okText={"Add Page"}
            width={600}
        >
            WebsiteBuilderPageSettings
        </Modal>
    )
}

export default WebsiteBuilderPageSettings