import React from 'react';
import {StringValue} from "../helpers/string.value";
import {addressAtom, nameAtom} from "./name.address.domain";
import {DropdownValue} from "../helpers/drop.down";

export const NameComponent = () => {
    return (
        <div>
            <h3>Edit Name</h3>
            <DropdownValue rootId='name' atom={nameAtom} atomKey="title" options={["Mr", "Mrs", "Ms", "Dr"]}/>
            <StringValue rootId='name' atom={nameAtom} atomKey="firstName"/>
            <StringValue rootId='name' atom={nameAtom} atomKey="middleName"/>
            <StringValue rootId='name' atom={nameAtom} atomKey="lastName"/>
        </div>
    );
};

export const AddressComponent = () => {
    return (
        <div>
            <h3>Edit Address</h3>
            <StringValue rootId='address' atom={addressAtom} atomKey="street"/>
            <StringValue rootId='address' atom={addressAtom} atomKey="city"/>
            <StringValue rootId='address' atom={addressAtom} atomKey="stateOrProvince"/>
            <StringValue rootId='address' atom={addressAtom} atomKey="zipCode"/>
            <StringValue rootId='address' atom={addressAtom} atomKey="country"/>
        </div>
    );
};
