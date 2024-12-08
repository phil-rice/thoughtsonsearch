import React from 'react';
import ReactDOM from 'react-dom/client';
import {RecoilRoot, useRecoilValue} from "recoil";
import {AddressComponent, NameComponent} from "./domain/name.and.address";
import {addressAtom, nameAtom} from "./domain/name.address.domain";

const StateDisplay = () => {
    const nameState = useRecoilValue(nameAtom);
    const addressState = useRecoilValue(addressAtom);

    return (
        <pre>
      {JSON.stringify({name: nameState, address: addressState}, null, 2)}
    </pre>
    );
};

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);
root.render(
    <RecoilRoot>
        <div>
            <h1>User Profile</h1>
            <NameComponent/>
            <AddressComponent/>
            <StateDisplay/>
        </div>
    </RecoilRoot>
);