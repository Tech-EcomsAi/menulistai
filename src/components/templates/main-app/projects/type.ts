export interface ProjectMetadata {
    projectId?: string;
    name: string;
    active: boolean;
    deleted?: boolean;
    deletedAt?: string;
}

export interface Project {
    projectId?: string;
    files?: ProjectFileType[];
    languages?: Set<string>;
}

export interface ProjectFileType {
    uid?: any;
    active?: boolean;
    deleted?: boolean;
    deletedAt?: string;
    index?: number;
    name?: string;
    size?: number;
    type?: string;
    url?: string;
    modelResponse?: any;
    inputToken?: any;
    ouputToken?: any;
    charges?: any;
    chargePerToken?: any;
    processingTime?: number; // Time taken to process in milliseconds
}