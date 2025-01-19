import { SECTION_UID_SEPARATOR } from '@constant/builder';
import { ComponentType } from '@organisms/sections/homePage';
import { removeObjRef } from './utils';
import { getComponentUsingNumberUnid } from './websiteBuilder';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const updateChildIds = (unid, config: any, time: number) => {
    if (Boolean(config.children?.length)) {
        config.children.map((child: any) => {
            child = updateChildIds(unid, child, time);
        })
        return config
    } else {
        return config.uid = `${unid}${SECTION_UID_SEPARATOR}${time + Math.random()}`;
    }

}
//when items drop from right panel to builders droppable list

// droppableSource - {"index": 111, "droppableId": "ECOMAI_BUILDER"}
// droppableDestination - {droppableId: 'Mobile', index: 0}
const copy = (destination, droppableSource, droppableDestination) => {
    const time = new Date().getTime();
    let componentDetails: ComponentType = removeObjRef(getComponentUsingNumberUnid(droppableSource.index));
    componentDetails.config = updateChildIds(componentDetails.unid, componentDetails.config, time)
    const destinationClone = Array.from(destination);
    if (Boolean(componentDetails)) {
        destinationClone.splice(droppableDestination.index, 0,
            {
                ...componentDetails.config,
                id: time,//always created for each new dropped component ::: used in drag drop builder index={index}
                uid: `${componentDetails.unid}${SECTION_UID_SEPARATOR}${time}`//always created for each new dropped component :::  used in drag drop builder draggableId={item.uid} 
            });
    }

    return destinationClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destinationClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destinationClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destinationClone;
    return result;
};

export { copy, move, reorder };
