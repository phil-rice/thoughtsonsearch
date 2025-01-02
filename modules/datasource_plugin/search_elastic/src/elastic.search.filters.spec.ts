import {findTimeFilter} from './elastic.search.time.filter';
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {ElasticSearchContext, ElasticSearchFilters} from "./elastic.search";
import {composeFilters, makeElasticSearchQueryFromFilters} from "./elastic.search.filters";
import {timefilterPluginName} from "@enterprise_search/react_time_filter_plugin";

// Mock the time filter to simplify testing
jest.mock('./elastic.search.time.filter', () => ({
    findTimeFilter: jest.fn(),
}));

const mockContext: ElasticSearchContext = {
    timeService: () => new Date('2024-01-15T12:00:00Z').getTime(),  // Fixed date
} as any;

describe('makeElasticSearchQueryFromFilters', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('constructs query with keyword filter and time filter', () => {
        // Mock time filter return
        (findTimeFilter as jest.Mock).mockReturnValue({
            range: {
                timestamp: {
                    gte: '2024-01-01',
                    lt: '2024-01-15',
                    format: 'strict_date_optional_time',
                },
            },
        });

        const filters: ElasticSearchFilters = {
            [keywordsFilterName]: 'test',
            [timefilterPluginName]: undefined,

        } as any;

        const result = makeElasticSearchQueryFromFilters(mockContext, filters);

        expect(result).toEqual({
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                timestamp: {
                                    gte: '2024-01-01',
                                    lt: '2024-01-15',
                                    format: 'strict_date_optional_time',
                                },
                            },
                        },
                        {
                            dis_max: {
                                queries: [
                                    {
                                        multi_match: {
                                            query: '*test*',
                                            fields: ["issue", "title", "name", "card_title"],
                                            type: 'best_fields',
                                            boost: 1.5,
                                        },
                                    },
                                    {
                                        query_string: {
                                            type: 'phrase_prefix',
                                            default_field: 'full_text',
                                            query: '*test*',
                                            boost: 1.5,
                                            default_operator: 'AND',
                                            phrase_slop: 1,
                                        },
                                    },
                                    {
                                        query_string: {
                                            query: 'test',
                                            boost: 1,
                                            default_operator: 'OR',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        });
        expect(findTimeFilter).toHaveBeenCalledWith(mockContext, filters);
    });

    test('returns match_none when no filters are provided', () => {
        (findTimeFilter as jest.Mock).mockReturnValue(undefined);

        const result = makeElasticSearchQueryFromFilters(mockContext, {} as any);

        expect(result).toEqual({
            query: {
                match_none: {},
            },
        });
    });

    test('returns keyword filter only if no time filter is present', () => {
        (findTimeFilter as jest.Mock).mockReturnValue(undefined);

        const filters: ElasticSearchFilters = {
            keywords: 'elastic'
        } as any;

        const result = makeElasticSearchQueryFromFilters(mockContext, filters);

        expect(result).toEqual({
            query: {
                dis_max: {
                    queries: [
                        {
                            multi_match: {
                                query: '*elastic*',
                                fields: ["issue", "title", "name", "card_title"],
                                type: 'best_fields',
                                boost: 1.5,
                            },
                        },
                        {
                            query_string: {
                                type: 'phrase_prefix',
                                default_field: 'full_text',
                                query: '*elastic*',
                                boost: 1.5,
                                default_operator: 'AND',
                                phrase_slop: 1,
                            },
                        },
                        {
                            query_string: {
                                query: 'elastic',
                                boost: 1,
                                default_operator: 'OR',
                            },
                        },
                    ],
                },
            },
        });
    });

    test('composes filters correctly', () => {
        const timeFilter = {
            range: {
                timestamp: {
                    gte: '2024-01-01',
                    lt: '2024-01-15',
                },
            },
        };

        const keywordFilter = {
            dis_max: {
                queries: [
                    {
                        query_string: {
                            query: 'test',
                        },
                    },
                ],
            },
        };

        const result = composeFilters(timeFilter, keywordFilter);

        expect(result).toEqual({
            bool: {
                must: [timeFilter, keywordFilter],
            },
        });
    });

    test('returns match_none if all filters are undefined', () => {
        const result = composeFilters(undefined, undefined);

        expect(result).toEqual({
            match_none: {},
        });
    });

    test('returns single filter if only one is present', () => {
        const keywordFilter = {
            dis_max: {
                queries: [
                    {
                        query_string: {
                            query: 'solo',
                        },
                    },
                ],
            },
        };

        const result = composeFilters(keywordFilter, undefined);

        expect(result).toEqual(keywordFilter);
    });
});
