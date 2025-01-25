import { DB_COLLECTIONS } from "@constant/database";
import { deleteFileByUrl } from "@database/storage/deleteFromStorage";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { Project, ProjectMetadata } from "@template/main-app/projects/type";

const METADATA_COLLECTION = DB_COLLECTIONS.PROJECTS_METADATA;
const DATA_COLLECTION = DB_COLLECTIONS.PROJECTS;

let session: any = null;

const getMetadataCollectionRef = async () => {
    session = Boolean(session) ? session : await getActiveSession()
    return collection(firebaseClient, `${METADATA_COLLECTION}/${session.tId}/${session.sId}`)
}

const getDataCollectionRef = async () => {
    session = Boolean(session) ? session : await getActiveSession()
    return collection(firebaseClient, `${DATA_COLLECTION}/${session.tId}/${session.sId}`)
}

const getMetadataDocRef = async (projectId: string) => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${METADATA_COLLECTION}/${session.tId}/${session.sId}`, projectId)
}

const getDataDocRef = async (projectId: string) => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${DATA_COLLECTION}/${session.tId}/${session.sId}`, projectId)
}

export const uploadProjectFile = async (data: any, type = '', projectId: string, fileId: string) => {
    let newUrl: any = '';
    let fileType: any = data.fileType;
    let fileToUpdate: any = data.fileToUpdate;
    const docId = `${projectId}/${fileId}`;

    if (fileToUpdate) {
        if (fileToUpdate?.includes('base64')) {
            newUrl = await uploadBase64ToStorage({
                fileId: docId,
                url: fileToUpdate,
                path: `${DATA_COLLECTION}/${type}/${docId}`,
                type: fileType
            })
        }
        return newUrl
    }
    return ''
}

export const addProject = async (data: Partial<ProjectMetadata>) => {
    return await apiCallComposer(
        async () => {
            // Handle metadata
            const metadataData = await requestBodyComposer({ name: data.name, active: true, deleted: false });

            // If it's a default project, use the provided projectId
            let metadataRef;
            if (data.projectId) {
                metadataRef = await getMetadataDocRef(data.projectId);
                await setDoc(metadataRef, { ...metadataData, projectId: data.projectId });
            } else {
                metadataRef = await addDoc(await getMetadataCollectionRef(), metadataData);
            }

            const projectId = data.projectId || metadataRef.id;

            // Handle project data
            const projectData = await requestBodyComposer({ projectId, files: [] });

            // Use the same ID for project data
            const dataRef = doc(await getDataCollectionRef(), projectId);
            await setDoc(dataRef, projectData);

            return { ...metadataData, projectId, projectData };
        },
        data,
        "addProject"
    );
}

export const updateProjectMetadata = async (data: Partial<ProjectMetadata>) => {
    return await apiCallComposer(
        async () => {
            const updateData = await requestBodyComposer(data);
            await setDoc(await getMetadataDocRef(data.projectId), updateData, { merge: true });
            return updateData;
        },
        data,
        "updateProjectMetadata"
    );
}

export const updateProject = async (data: Partial<Project>) => {
    return await apiCallComposer(
        async () => {
            const updateData = await requestBodyComposer(data);

            if (data.files?.length) {
                for (let i = 0; i < data.files.length; i++) {
                    if (updateData.files[i].url.includes('base64')) {
                        updateData.files[i].url = await uploadProjectFile({ fileType: data.files[i].type, fileToUpdate: data.files[i].url }, 'files', data.projectId, data.files[i].name)
                    }
                }
            }

            await setDoc(await getDataDocRef(data.projectId), updateData, { merge: true });
            return updateData;
        },
        data,
        "updateProject"
    );
}

export const getProjects = async () => {
    return await apiCallComposer(
        async () => {
            const metadataSnapshot = await getDocs(await getMetadataCollectionRef());
            const projects = metadataSnapshot.docs.map(doc => ({ ...doc.data(), projectId: doc.id }));

            // If no projects exist, create default project
            if (projects.length === 0) {
                const defaultProject: ProjectMetadata = {
                    projectId: "default",
                    name: "Default",
                    active: true,
                    deleted: false
                };
                const newProject = await addProject(defaultProject);
                return [newProject];
            }

            return projects;
        },
        null,
        "getProjects"
    );
}

export const getProjectData = async (projectId: string): Promise<Project> => {
    return await apiCallComposer(
        async () => {
            const docRef = await getDataDocRef(projectId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw new Error('Project not found');
            }
            return docSnap.data() as Project;
        },
        { projectId },
        "getProjectData"
    );
}

export const getProject = async (projectId: string) => {
    return await apiCallComposer(
        async () => {
            const metadataDoc = await getDoc(await getMetadataDocRef(projectId));
            const projectDoc = await getDoc(await getDataDocRef(projectId));

            if (metadataDoc.exists() && projectDoc.exists()) {
                return { ...metadataDoc.data(), projectData: projectDoc.data() };
            }
            return null;
        },
        projectId,
        "getProject"
    );
};

export const deleteProject = async (projectId: string) => {
    return await apiCallComposer(
        async () => {
            // Get project data to find uploaded files
            const projectDoc = await getDoc(await getDataDocRef(projectId));
            if (projectDoc.exists()) {
                const projectData = projectDoc.data() as Project;

                // Delete uploaded files
                const deletePromises: Promise<any>[] = [];

                // Delete files from uploadedData
                if (projectData.files?.length) {
                    projectData.files.forEach(file => {
                        if (file.url && !file.url.includes('base64')) {
                            deletePromises.push(deleteFileByUrl(file.url));
                        }
                    });
                }

                // Wait for all file deletions to complete
                await Promise.all(deletePromises);
            }

            // Delete the documents
            await deleteDoc(await getMetadataDocRef(projectId));
            await deleteDoc(await getDataDocRef(projectId));

            return true;
        },
        projectId,
        "deleteProject"
    );
};
