import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor} from "@enterprise_search/react_utils";


export type DataViewDisplayProps = {}
export type DataViewDisplay = (props: DataViewDisplayProps) => React.ReactElement;


export type DataViewPurposes = 'navbar'
export type DataViewPurposesToDisplay = Record<DataViewPurposes, DataViewDisplay>


export type DataViewPlugins = NameAnd<DataViewPlugin>
export type DataViewPlugin = {
    plugin: 'dataview'
    name: string
    displays: DataViewPurposesToDisplay
}
export const {Provider: DataViewPluginsProvider, use: useDataViewPlugins} = makeContextFor('dataView', undefined as DataViewPlugins)

export type DataViewNavVarLayoutProps = { children: React.ReactNode }
export type DataViewNavBarLayout = (props: DataViewNavVarLayoutProps) => React.ReactElement;
export const {Provider: DataViewNavBarLayoutProvider, use: useDataViewNavBarLayout} = makeContextFor('navBarLayout', undefined as DataViewNavBarLayout)


