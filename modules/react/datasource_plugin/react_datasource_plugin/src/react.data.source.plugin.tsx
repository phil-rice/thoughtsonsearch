import {SearchResult} from "@enterprise_search/search_state";
import {ErrorsOr} from "@enterprise_search/errors";
import {NameAnd} from "@laoban/utils";
import {Authentication} from "@enterprise_search/authentication";
import {makeContextFor} from "@enterprise_search/react_utils";


/* This will be extended. It's the information about 'get me this from the data source'.
* For example elastic search will have indicies. A database might have schemas and tables */
export type CommonDataSourceDetails = {
    type: string
}


//Maps from a data source name to the plugin that fetches data from that source
export type DataSourcePlugins<Filters> = NameAnd<DataSourcePlugin<any, Filters, any>>

export type FetchFromDatasourceFn<Filters, Paging> = (filters: Filters, paging?: Paging) => Promise<ErrorsOr<SearchResult<any, any>>>;

export type DataSourcePlugin<Details extends CommonDataSourceDetails, Filters, Paging> = {
    plugin: 'datasource'
    datasourceName: string
    allDetails: Details[]

    authentication: Authentication,
    fetch: FetchFromDatasourceFn<Filters, Paging>
}

export const {Provider: DataSourcePluginProvider, use: useDataSourcePlugins} = makeContextFor('plugins', undefined as DataSourcePlugins<any>)

export function useDatasourcePlugin<Details extends CommonDataSourceDetails, Filters, Paging>(datasourceName: string): DataSourcePlugin<Details, Filters, Paging> {
    const plugins = useDataSourcePlugins()
    const plugin = plugins[datasourceName]
    if (!plugin) throw new Error(`No plugin found for datasource ${datasourceName}. Legal values are ${Object.keys(plugins).sort().join(', ')}`)
    return plugin;
}