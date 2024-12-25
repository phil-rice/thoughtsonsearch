import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor} from "@enterprise_search/react_utils";
import {useReportError} from "@enterprise_search/react_error";


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

export const {Provider: DataPluginProvider, use: useDataPlugins} = makeContextFor('dataPlugins', {} as DataPlugins);

export function useData<Data>(purpose: string, type: string): DataOps<Data> {
    const dataPlugins = useDataPlugins();
    const reportError = useReportError();
    const plugin: DataPlugin<Data> = dataPlugins[type]
    if (!plugin) reportError('s/w', `Unknown data type ${type}. Legal values are ${Object.keys(plugin).sort()}`)
    const DisplayData = plugin.DisplayDataForPurpose[purpose] || plugin.DefaultDisplayData
    return {DisplayData};
}

