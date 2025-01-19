import AIButtonIcon from '@atoms/aiButtonIcon';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import styles from '@organismsCSS/componentRenderer/componentActionsWrap.module.scss';
import { activeEditorComponentInitialState, updateActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { BuilderContextType, getBuilderContext, getBuilderSidebarPanelAction, updateBuilderSidebarPanelAction, updateBuilderState } from '@reduxSlices/siteBuilderState';
import { move, toArray } from '@util/moveItem';
import { removeObjRef } from '@util/utils';
import { Button, Popconfirm, Tooltip } from 'antd';
import { memo } from 'react';
import { LuArrowDown, LuArrowUp, LuLayoutTemplate, LuPencilLine, LuTrash } from 'react-icons/lu';
import { MdDragIndicator } from 'react-icons/md';
type pageProps = {
    attributes: any,
    listeners: any,
    firstChild: boolean,
    lastChild: boolean,
    builderState: any,
    index: any,
    uid: any,
    deviceType: string,
}
function ComponentActions({ attributes, listeners, firstChild, lastChild, builderState, index, uid, deviceType }: pageProps) {
    const dispatch = useAppDispatch();
    const builderSidebarPanelAction = useAppSelector(getBuilderSidebarPanelAction);
    const builderContext: BuilderContextType = useAppSelector(getBuilderContext);

    const onClickAction = (event: any, action: string) => {
        const listKey = Object.keys(builderState)[0];
        const builderStateCopy: any = { ...builderState };
        switch (action) {
            case 'UP':
                builderStateCopy[listKey] = move(builderStateCopy[listKey], { from: index, to: index - 1 });
                break;
            case 'DOWN':
                builderStateCopy[listKey] = move(builderStateCopy[listKey], { from: index + 1, to: index });
                break;
            case 'DELETE':
                const components: any = [...toArray(builderStateCopy[listKey])];
                components.splice(index, 1);
                builderStateCopy[listKey] = components;
                break;
            case 'REDESIGN': case 'EDITOR':
                dispatch(updateBuilderSidebarPanelAction(action));
                break;
            default:
                break;
        }
        dispatch(updateBuilderState(removeObjRef(builderStateCopy)));
        dispatch(updateActiveEditorComponent((action == 'EDITOR' || action == 'REDESIGN') ? { originalState: builderState[Object.keys(builderState)[0]][index], uid: uid } : activeEditorComponentInitialState.activeEditorComponent));
        event.stopPropagation();
    }

    return (
        <div className={`${styles.componentActionsWrap} ${styles[deviceType]}`} style={{ flexDirection: (!builderContext.canvasMode && deviceType == "Desktop") ? "row" : "column" }}>

            <AIButtonIcon Icon={LuLayoutTemplate} onClick={(e) => onClickAction(e, 'REDESIGN')} size="middle" shape="circle" tooltip="Redesign with Ai" tooltipDir={deviceType == "mobile" ? "right" : "left"} />

            {/* <Tooltip placement={deviceType == "mobile" ? "right" : "left"} title="Change Layout" key='6'>
                <Button  size='middle' shape='circle' type={builderSidebarPanelAction == "RELAYOUT" ? "primary" : "default"} onClick={(e) => onClickAction(e, 'RELAYOUT')} icon={<LuLayoutTemplate />} />
            </Tooltip> */}

            <Tooltip placement={deviceType == "mobile" ? "right" : "left"} title="Edit Section" key='4'>
                <Button draggable size='middle' shape='circle' type={builderSidebarPanelAction == "EDITOR" ? "primary" : "text"} onClick={(e) => onClickAction(e, 'EDITOR')} icon={<LuPencilLine />} />
            </Tooltip>

            {!firstChild && <Tooltip placement={deviceType == "mobile" ? "right" : "left"} title={`Move Up`} key='1'>
                <Button size='middle' shape='circle' type="text" onClick={(e) => onClickAction(e, 'UP')} icon={<LuArrowUp />} />
            </Tooltip>}

            {!lastChild && <Tooltip placement={deviceType == "mobile" ? "right" : "left"} title="Move Down" key='2'>
                <Button size='middle' shape='circle' type="text" onClick={(e) => onClickAction(e, 'DOWN')} icon={<LuArrowDown />} />
            </Tooltip>}

            <Tooltip placement={deviceType == "mobile" ? "right" : "left"} title="Delete Section" key='3'>
                <Popconfirm
                    title="Delete Section"
                    description="Are you sure you want to delete this section?"
                    onConfirm={(e) => onClickAction(e, 'DELETE')}>
                    <Button size='middle' shape='circle' danger type="text" icon={<LuTrash />} />
                </Popconfirm>
            </Tooltip>

            {(builderContext.canvasMode ? builderContext.state.scale > 0.6 : true) &&
                <Tooltip placement={deviceType == "Desktop" ? "right" : "left"} title="Hold and drag section" key='5'>
                    <Button
                        {...listeners}
                        {...attributes}
                        className="dragDropHandle"
                        size='middle' shape='circle' type="default" onClick={() => { }} icon={<MdDragIndicator className="dragDropHandle" />} />
                </Tooltip>}
        </div>
    )
}

export default memo(ComponentActions)