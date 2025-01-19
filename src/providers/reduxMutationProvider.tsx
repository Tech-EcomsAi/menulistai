'use client';
import { useAppDispatch } from '@hook/useAppDispatch';
import { updateActiveTemplate, updateActiveTemplateConfig, updateBuilderSavedState, updateBuilderState } from '@reduxSlices/siteBuilderState';
import { useEffect } from 'react';

export type mutationDataType = {
    action: string,
    payload: any
}
type Props = {
    children: React.ReactNode;
    mutationData: mutationDataType[];
}

const actionsList = {
    "updateBuilderState": updateBuilderState,
    "updateActiveTemplateConfig": updateActiveTemplateConfig,
    "updateActiveTemplate": updateActiveTemplate,
    "updateBuilderSavedState": updateBuilderSavedState,
}

export default function ReduxMutationProvider({ children, mutationData = [] }: Props) {
    const dispatch = useAppDispatch()
    console.log("mutationData:", mutationData)
    useEffect(() => {
        if (mutationData.length != 0) {
            mutationData.map((data: mutationDataType) => {
                dispatch(actionsList[data.action](data.payload))
            })
        }
    }, [mutationData])

    return (
        <>
            {children}
        </>
    )
}