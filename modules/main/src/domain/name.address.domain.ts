// Define the Name type
import {atom} from "recoil";

export type Name = {
    title: string;
    firstName: string;
    lastName: string;
    middleName?: string; // Optional middle name
};

// Define the Address type
export type Address = {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    stateOrProvince?: string; // Optional state or province
};
export const nameAtom = atom<Name>({
    key: 'nameAtom',
    default: {
        title: '',
        firstName: '',
        middleName:'',
        lastName: '',
    },
});

export const addressAtom = atom<Address>({
    key: 'addressAtom',
    default: {
        street: '',
        city: '',
        zipCode: '',
        country: '',
    },
});