import {SearchResult} from "@enterprise_search/search_state";
import {ErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@laoban/utils";
import React, {useMemo} from "react";
import {Authentication} from "@enterprise_search/authentication";


//Maps from a data source name to the plugin that fetches data from that source, and displays it
export type DataSourcePlugins<Filters> = NameAnd<DataSourcePlugin<Filters, any>>
export type FetchFromDatasourceFn<Filters, Paging> = (filters: Filters, paging?: Paging) => Promise<ErrorsOr<SearchResult<any, any>>>;
export type DataSourcePlugin<Filters, Paging> = {
    plugin: 'datasource'
    datasourceName: string
    knownFilterNames: string[]
    authentication: Authentication,
    fetch: FetchFromDatasourceFn<Filters, Paging>
    navBar: () => React.ReactElement
    purposeToDisplay: NameAnd<DataSourceDisplayFn>
}

export type DataSourceDisplayFn = (purpose: string, datasourceName) => DataSourceDisplay
export type DataSourceDisplayProps = {}
export type DataSourceDisplay = (props: DataSourceDisplayProps) => React.ReactElement

export const DataSourcePluginContext = React.createContext<DataSourcePlugins<any> | undefined>(undefined)

export type DataSourcePluginProviderProps = {
    plugins: DataSourcePlugins<any>
    children: React.ReactNode
}
export const DataSourcePluginProvider = ({plugins, children}: DataSourcePluginProviderProps) => {
    return <DataSourcePluginContext.Provider value={plugins}>{children}</DataSourcePluginContext.Provider>
}

export type DataSourcePluginOps<Filters, Paging> = {
    DataSourceDisplay: DataSourceDisplay

    knownFilterNames: string[]
    fetch: FetchFromDatasourceFn<Filters, Paging>
    navBar: () => React.ReactElement
}

export function useDataSourcePlugins<Filters, Paging>(): DataSourcePlugins<Filters> {
    const plugins = React.useContext(DataSourcePluginContext)
    if (!plugins) throw new Error('useDataSourcePlugins must be within a DataSourcePluginProvider')
    return plugins;
}

export function useDataSource<Filters, Paging>(purpose: string, datasourceName: string): DataSourcePluginOps<Filters, Paging> {
    const plugin = findPlugin(datasourceName);
    const DataSourceDisplayFn = plugin.purposeToDisplay[purpose]
    if (!DataSourceDisplayFn) throw new Error(`No display found for purpose ${purpose} in datasource ${datasourceName}. Legal values are ${Object.keys(plugin.purposeToDisplay).sort().join(', ')}`)
    const DataSourceDisplay = useMemo(() => DataSourceDisplayFn(purpose, datasourceName), [plugin, purpose, datasourceName]);
    return {DataSourceDisplay, fetch: plugin.fetch, knownFilterNames: plugin.knownFilterNames, navBar: plugin.navBar}
}

function findPlugin<Filters, Paging>(datasourceName: string): DataSourcePlugin<Filters, Paging> {
    const plugins = React.useContext(DataSourcePluginContext)
    if (!plugins) throw new Error('useDataSourcePlugin must be within a DataSourcePluginProvider')
    const plugin = plugins[datasourceName]
    if (!plugin) throw new Error(`No plugin found for datasource ${datasourceName}. Legal values are ${Object.keys(plugins).sort().join(', ')}`)
    return plugin;
}