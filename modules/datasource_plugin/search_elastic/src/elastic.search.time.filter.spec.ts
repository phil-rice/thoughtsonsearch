import {ElasticSearchContext} from './elastic.search';
import {timefilterPluginName, TimeFilters} from "@enterprise_search/react_time_filter_plugin";
import {findTimeFilter} from "./elastic.search.time.filter";

// Mock time service
const mockTimeService = () => new Date('2024-01-15T12:00:00Z').getTime();  // Fixed date for predictability

const mockContext: ElasticSearchContext = {
    timeService: mockTimeService,
} as any;

describe('findTimeFilter', () => {
    test('returns correct range for "yesterday"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'yesterday',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual({
            range: {
                timestamp: {
                    gte: '2024-01-14',
                    lt: '2024-01-15',
                    format: 'strict_date_optional_time',
                },
            },
        });
    });

    test('returns correct range for "lastWeek"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'lastWeek',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual({
            range: {
                timestamp: {
                    gte: '2024-01-08',
                    lt: '2024-01-15',
                    format: 'strict_date_optional_time',
                },
            },
        });
    });

    test('returns correct range for "lastMonth"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'lastMonth',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual({
            range: {
                timestamp: {
                    gte: '2023-12-01',
                    lt: '2024-01-15',
                    format: 'strict_date_optional_time',
                },
            },
        });
    });

    test('returns undefined for unsupported time string', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'unsupportedTimeString' as any,
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toBeUndefined();
    });

    test('returns correct range with custom timestamp field', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'yesterday',
        };

        const result = findTimeFilter(mockContext, filter, 'created_at');
        expect(result).toEqual({
            range: {
                created_at: {
                    gte: '2024-01-14',
                    lt: '2024-01-15',
                    format: 'strict_date_optional_time',
                },
            },
        });
    });

    test('returns undefined if no matching filters are found', () => {
        const filter: TimeFilters = {} as any;

        const result = findTimeFilter(mockContext, filter);
        expect(result).toBeUndefined();
    });
});
