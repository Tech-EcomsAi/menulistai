import { StoreRoleDataType } from "./roles";

export type StoreDataType = {
    storeId: number;
    storeKey: string,
    tenantId: number;
    active: boolean;
    blocked?: boolean;
    deleted: boolean;
    verified?: boolean;

    name: string;
    email: string;
    countryCode?: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    description?: string;
    gstn?: string;
    domain?: string;
    subDomain?: string;
    url?: string;
    createdBy?: string;
    createdOn?: string;
    logo: string;
    licenceKey?: string;
    licenceExpiryDate?: string;
    addressLine?: string;
    area?: string;
    district?: string;
    city: string;
    state: string;
    postalCode?: string;
    country?: string;
    timeZone?: string;
    dateFormat?: string;
    timeFormat?: string;
    language?: string;

    currencyCode: string;
    currencySymbol: string;

    businessType?: string;

    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonNumber: string;

    roles: StoreRoleDataType[];
    rolesPermissionStrategy: string;

};

export type MinimalStoreDataType = Pick<StoreDataType, "name" | "storeKey" | 'storeId'> & {
    // Additional unknown keys
    // [key: string]: any;
    storeDetails?: StoreDataType
};