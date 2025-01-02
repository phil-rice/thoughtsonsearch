import { ElasticSearchContext } from './elastic.search';
import { timefilterPluginName, TimeFilters } from "@enterprise_search/react_time_filter_plugin";
import { findTimeFilter } from "./elastic.search.time.filter";

// Mock time service for predictable results
const mockTimeService = () => new Date('2024-01-15T12:00:00Z').getTime();  // Fixed date for predictability

const mockContext: ElasticSearchContext = {
    timeService: mockTimeService,
} as any;

// Helper function to create expected range results
const expectedRange = (gte: string, lt: string, field: string = 'timestamp') => ({
    range: {
        [field]: {
            gte,
            lt,
            format: 'strict_date_optional_time',
        },
    },
});

describe('findTimeFilter', () => {
    test('returns correct range for "yesterday"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'yesterday',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual(expectedRange('2024-01-14', '2024-01-15'));
    });

    test('returns correct range for "lastWeek"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'lastWeek',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual(expectedRange('2024-01-08', '2024-01-15'));
    });

    test('returns correct range for "lastMonth"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'lastMonth',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual(expectedRange('2023-12-01', '2024-01-15'));
    });

    test('returns correct range for "lastYear"', () => {
        const filter: TimeFilters = {
            [timefilterPluginName]: 'lastYear',
        };

        const result = findTimeFilter(mockContext, filter);
        expect(result).toEqual(expectedRange('2023-01-01', '2024-01-15'));
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
        expect(result).toEqual(expectedRange('2024-01-14', '2024-01-15', 'created_at'));
    });

    test('returns undefined if no matching filters are found', () => {
        const filter: TimeFilters = {} as any;

        const result = findTimeFilter(mockContext, filter);
        expect(result).toBeUndefined();
    });
});
