import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {ElasticSearchContext, ElasticSearchFilters} from "./elastic.search";
import {findTimeFilter} from "./elastic.search.time.filter";

const boosts: readonly string[] = [
    "issue",
    "title",
    "name",
    "card_title",
];


function findKeywordFilter(context: ElasticSearchContext, filter: KeywordsFilter): object {
    const keywords = filter.keywords;
    if (!keywords) return undefined;
    return {
        dis_max: {
            queries: [
                {
                    multi_match: {
                        query: `*${keywords}*`,
                        fields: boosts,
                        type: "best_fields",
                        boost: 1.5,
                    },
                },
                {
                    query_string: {
                        type: "phrase_prefix",
                        default_field: "full_text",
                        query: `*${keywords}*`,
                        boost: 1.5,
                        default_operator: "AND",
                        phrase_slop: 1,
                    },
                },
                {
                    query_string: {
                        query: keywords,
                        boost: 1,
                        default_operator: "OR",
                    },
                },
            ],
        },
    };
}

export function composeFilters(...raw: (object | undefined)[]): object {
    const filters = raw.filter(Boolean);
    if (filters.length === 0) return { match_none: {} };
    if (filters.length === 1) return filters[0];
    return {
        bool: {
            must: filters,
        },
    };
}


export type ElasticsearchQuery = {
    query: {
        bool?: {
            must: object[];
        };
        match_none?: object;
    };
};

export type MakeElasticSearchQueryFromFilters = (
    context: ElasticSearchContext,
    filters: ElasticSearchFilters
) => ElasticsearchQuery;

export const makeElasticSearchQueryFromFilters: MakeElasticSearchQueryFromFilters = (
    context,
    filters
) => {
    const timeFilter = findTimeFilter(context, filters);

    const keywordFilter = findKeywordFilter(context, filters);

    return {
        query: composeFilters(timeFilter, keywordFilter),
    };
};
