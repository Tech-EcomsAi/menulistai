export interface GlobalAddressType {
    label: string; //home | office | other
    addressLine: string;
    area: string;
    district: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export type UserUploadedFileType = {
    src?: string;
    name?: string;
    size?: number;
    type?: string;
    url?: string;
}