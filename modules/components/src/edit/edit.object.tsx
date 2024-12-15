import {useLowlevelEditComponents} from "./use.edit";
import React from "react";
import {RecoilState} from "recoil";

export type EditDropdownDefn<T> = { type: 'dropdown', key: keyof T, options: string[] }


export function isEditDropdownDefn<T>(defn: EditObjectDefn<T>): defn is EditDropdownDefn<T> {
    return (defn as any).type === 'dropdown'
}

export type TitleDefn = { type: 'title', title: string }

export function isTitleDefn(defn: EditObjectDefn<any>): defn is TitleDefn {
    return (defn as any).type === 'title'
}

export type EditObjectDefn<T> = keyof T | EditDropdownDefn<T> | TitleDefn
export type FullEditObjectProps<T> = {

    atom: RecoilState<T>
    rootId: string
    defns: EditObjectDefn<T>[]
}

export type EditObjectComponent = <T extends any>(props: FullEditObjectProps<T>) => React.ReactElement;

export const EditObject: EditObjectComponent = <T extends any>({atom, rootId, defns}: FullEditObjectProps<T>) => {
    const {EditLayout, EditStringInput, EditStringDropdown, Title} = useLowlevelEditComponents()
    return <EditLayout>
        {defns.map((defn, index) => {
            if (typeof defn === 'string') {
                return <EditStringInput key={defn} rootId={rootId} atom={atom} atomKey={defn as any}/> //would like to have a nicer type for this
            } else if (isEditDropdownDefn(defn)) {
                return <EditStringDropdown key={defn.key.toString()} rootId={rootId} atom={atom} atomKey={defn.key as any} options={defn.options}/>
            }
            if (isTitleDefn(defn)) {
                return <Title key={defn.title} title={defn.title}/>
            } else {
                throw new Error(`Unknown defn type. ${typeof defn} ${JSON.stringify(defn)}`)
            }
        })}
    </EditLayout>
};

export type EditObjectProps<T> = {
    title: string
    rootId: string
}

export function editObjectFromDefn<T>(atom: RecoilState<T>, defns: EditObjectDefn<T>[]) {
    return (props: EditObjectProps<T>) =>
        <EditObject {...props} atom={atom} defns={defns}/>
}