import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";


export type DataOps<Data> = {
    DisplayData: DisplayData<Data>
}

//From the name of the data to the plugin that handles that data type
export type DataPlugins = NameAnd<DataPlugin<any>>
export type DataPlugin<Data> = {
    plugin: 'data'
    type: string
    /** We can override the DefaultDisplayData for specific purposes if we want */
    DisplayDataForPurpose: NameAnd<DisplayData<Data>>
    DefaultDisplayData: DisplayData<Data>
}

export type DisplayDataProps<Data> = {
    data: Data
}
export type DisplayData<Data> = (props: DisplayDataProps<Data>) => React.ReactElement


export const DataPluginContext = React.createContext<DataPlugins | undefined>(undefined);


type DataPluginProvider = {
    ops: DataPlugins
    children: React.ReactNode
}

export const DataPluginProvider = ({ops, children}: DataPluginProvider) => {
    return (
        <DataPluginContext.Provider value={ops}>{children}</DataPluginContext.Provider>
    );
}


export function useData<Data>(purpose: string, type: string): DataOps<Data> {
    const context = React.useContext(DataPluginContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataPluginProvider');
    }
    const plugin: DataPlugin<Data> = context[type]
    if (!plugin) throw new Error(`Unknown data type ${type}. Legal values are ${Object.keys(plugin).sort()}`)
    const DisplayData = plugin.DisplayDataForPurpose[purpose] || plugin.DefaultDisplayData
    return {DisplayData};
}

