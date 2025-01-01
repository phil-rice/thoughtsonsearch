import React from "react";
import {NameAnd} from "@enterprise_search/recoil_utils";
import {makeContextFor, useThrowError} from "@enterprise_search/react_utils";
import {DataAndDataSource, OneSearch} from "@enterprise_search/search_state";


export type DataComponents<Data> = {
    DisplayDataWidget: DisplayDataWidget<Data>
    DisplayDataArray: DisplayDataArray<Data>
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
    id: string
}
export type DisplayData<Data> = (props: DisplayDataProps<Data>) => React.ReactElement

export type DisplayDataArrayProps<Data> = {
    title: string
    data: DataAndDataSource<Data>[]
    id: string
    Display: DisplayData<Data>
}
export type DisplayDataArray<Data> = (props: DisplayDataArrayProps<Data>) => React.ReactElement

export type DisplayDataWidgetProps<Data> = {
    title: string
    data: DataAndDataSource<Data>[]
    id: string
}
export type DisplayDataWidget<Data> = (props: DisplayDataWidgetProps<Data>) => React.ReactElement

export const {Provider: DataPluginProvider, use: useDataPlugins} = makeContextFor('dataPlugins');

export const useOneLineDisplayDataComponent = <Data extends any>(): (type: string,) => DisplayData<Data> => {
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




