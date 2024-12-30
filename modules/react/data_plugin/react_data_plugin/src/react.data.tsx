import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, useThrowError} from "@enterprise_search/react_utils";


export type DataComponents<Data> = {
    DisplayData: DisplayData<Data>
    OneLineDisplayData: DisplayData<Data>
}

//From the name of the data to the plugin that handles that data type
export type DataPlugins = NameAnd<DataPlugin<any>>
export type DataPlugin<Data> = DataComponents<Data> & {
    plugin: 'data'
    type: string
}

export type DisplayDataProps<Data> = {
    data: Data
}
export type DisplayData<Data> = (props: DisplayDataProps<Data>) => React.ReactElement

export const {Provider: DataPluginProvider, use: useDataPlugins} = makeContextFor('dataPlugins', {} as DataPlugins);

export const useDisplayDataComponent = <Data extends any>(): (type: string) => DisplayData<Data> => {
    const plugins = useDataPlugins()
    const throwError = useThrowError()
    return type => {
        const plugin = plugins[type] as DataPlugin<Data>
        if (!plugin) return throwError('s/w', `No plugin found for data type ${type}. Legal values are ${Object.keys(plugins).sort().join(', ')}`)

        const displayData = plugin.DisplayData;
        if (!displayData) return throwError('s/w', `No display data found for data type ${type}`)
        return displayData
    }
};

export const useOneLineDisplayDataComponent = <Data extends any>(): (type: string) => DisplayData<Data> => {
    const plugins = useDataPlugins()
    const throwError = useThrowError()
    return type => {
        const plugin = plugins[type] as DataPlugin<Data>
        if (!plugin) return throwError('s/w', `No plugin found for data type ${type}. Legal values are ${Object.keys(plugins).sort().join(', ')}`)
        const oneLineDisplayData = plugin.OneLineDisplayData;
        if (!oneLineDisplayData) return throwError('s/w', `No one line display data found for data type ${type}`)
        return oneLineDisplayData
    }
};




