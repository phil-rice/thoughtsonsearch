import {EditStringDropdown, EditStringDropdownComponent} from "./edit.string.dropdown";
import {EditStringInput, EditStringInputComponent} from "./edit.string";
import {createContext, useContext} from "react";
import {EditLayout, EditLayoutComponent} from "./edit.layout";
import {makeContextFor} from "@enterprise_search/react_utils";

export type TitleComponents = (props: { title: string }) => React.ReactElement;
export type LowLevelEditComponents = {
    EditStringDropdown: EditStringDropdownComponent;
    EditStringInput: EditStringInputComponent;
    EditLayout: EditLayoutComponent;
    Title: TitleComponents;
}

export const defaultEditComponents: LowLevelEditComponents = {
    EditStringDropdown: EditStringDropdown,
    EditStringInput: EditStringInput,
    EditLayout: EditLayout,
    Title: ({title}) => <h2>{title}</h2>
}

export const {Provider: EditComponentsProvider, use: useLowlevelEditComponents} = makeContextFor('editComponents', defaultEditComponents);

