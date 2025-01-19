import { SECTION_UID_SEPARATOR } from '@constant/builder';
import HomePageSectionsList, { ComponentType } from '@organisms/sections/homePage';
import MediaSectionsList from '@organisms/sections/media';
import { removeObjRef } from './utils';
import { getComponentUsingNumberUnid, getUnidAsNumber, updateConfigVariablesColors } from './websiteBuilder';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
/**
 * Moves an item from one list to another list.
 */
const getSectionsListCategory = (unid: any) => {
    if (unid == 1) {
        return HomePageSectionsList;
    } else if (unid == 2) {
        return MediaSectionsList;
    }
}

const updateChildIds = (unid, config: any, timeId: number) => {
    if (Boolean(config.children?.length)) {
        config.children.map((child: any) => {
            child = updateChildIds(unid, child, timeId);
        })
        return config
    } else {
        return config.uid = `${unid}${SECTION_UID_SEPARATOR}${timeId + (Math.random()).toFixed(2)}`;
    }

}
//when items drop from right panel to builders droppable list

// droppableSource - {"index": 111, "droppableId": "ECOMAI_BUILDER"}
// droppableDestination - {droppableId: 'Mobile', index: 0}
const clone = (destination, droppableSource, droppableDestination, colorVariables) => {

    //id passed at the time of dragging
    let timeId = new Date().getTime();
    if (droppableSource.id.includes(SECTION_UID_SEPARATOR)) {
        timeId = droppableSource.id.split(SECTION_UID_SEPARATOR)[1]
    }
    let componentDetails: ComponentType = removeObjRef(getComponentUsingNumberUnid(getUnidAsNumber(droppableSource.id)));
    const destinationClone = Array.from(destination);
    if (Boolean(componentDetails)) {
        componentDetails.config = updateChildIds(componentDetails.unid, componentDetails.config, timeId)
        destinationClone.splice(droppableDestination.id, 0,
            {
                ...updateConfigVariablesColors(colorVariables, componentDetails.config),
                id: timeId,//always created for each new dropped component ::: used in drag drop builder id={id}
                uid: `${componentDetails.unid}${SECTION_UID_SEPARATOR}${timeId}`//always created for each new dropped component :::  used in drag drop builder draggableId={item.uid} 
            });
    }

    return destinationClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destinationClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.id, 1);
    destinationClone.splice(droppableDestination.id, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destinationClone;
    return result;
};

export { clone, move, reorder };
