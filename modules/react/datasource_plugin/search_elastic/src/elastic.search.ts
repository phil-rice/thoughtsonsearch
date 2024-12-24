import {SearchByApiContext} from "@enterprise_search/search_api";
import {CommonDataSourceDetails, DataSourcePlugin} from "@enterprise_search/react_datasource_plugin";
import {KeywordsFilter} from "modules/react/filters_plugin/react_keywords_filter_plugin";
import {TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {Authentication} from "@enterprise_search/authentication";
import {DataViewFilters} from "@enterprise_search/react_data_views_filter_plugin";

/* This lets us say 'in the elastic search I want you to search these indicies
The indicies are the 'ones that are known'. Filters can trim this down
 */

export type ElasticSearchSourceDetails = CommonDataSourceDetails & {
    indicies: string[]
}

export type ElasticSearchContext = SearchByApiContext & {
    elasticSearchUrl: string
    elasticSearchToken: () => Promise<string>
    knownIndicies: string[]
}

export type ElasticSearchPaging = {}
export type ElasticSearchFilters = KeywordsFilter & TimeFilters & DataViewFilters

export function elasticSearchDataSourcePlugin(authentication: Authentication,
                                              allDetails: ElasticSearchSourceDetails[]): DataSourcePlugin<ElasticSearchSourceDetails, ElasticSearchFilters, ElasticSearchPaging> {
    return {
        plugin: 'datasource',
        datasourceName: 'elasticsearch',
        authentication,
        fetch: async (filters, paging) => {
            return undefined as any
        },
        allDetails
    };
}


