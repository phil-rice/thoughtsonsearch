import {ElasticSearchContext} from "./elastic.search";
import {TimeService} from "@enterprise_search/recoil_utils";
import {TimeFilters, TimeString, timeStrings} from "@enterprise_search/react_time_filter_plugin";

// Type definition for the time range returned
type TimeRange = {
    gte: string;
    lt: string;
};

// Helper function to calculate time ranges immutably
export function getTimeRange(timeService: TimeService, timeString: TimeString): TimeRange {
    const now = new Date(timeService());
    const todayString = now.toISOString().split('T')[0];  // Calculate once for reuse

    const calculateRange = (daysToSubtract: number): TimeRange => {
        const calculatedDate = new Date(now);  // Clone to avoid mutation
        calculatedDate.setDate(calculatedDate.getDate() - daysToSubtract);
        return {
            gte: calculatedDate.toISOString().split('T')[0],  // Start of the calculated day
            lt: todayString,                                   // Start of today
        };
    };

    switch (timeString) {
        case 'yesterday':
            return calculateRange(1);
        case 'lastWeek':
            return calculateRange(7);
        case 'lastMonth': {
            const firstOfThisMonth = new Date(now);
            firstOfThisMonth.setDate(1);  // Go to the first of the current month
            firstOfThisMonth.setMonth(firstOfThisMonth.getMonth() - 1);  // Subtract one month

            const startOfLastMonth = firstOfThisMonth.toISOString().split('T')[0];  // Start of last month
            return {
                gte: startOfLastMonth,
                lt: todayString,  // Up to today (current date)
            };
        }
        case 'lastYear': {
            const firstOfThisYear = new Date(now);
            firstOfThisYear.setMonth(0);  // Go to January
            firstOfThisYear.setDate(1);   // Set to the first day of the year
            firstOfThisYear.setFullYear(firstOfThisYear.getFullYear() - 1);  // Subtract one year

            const startOfLastYear = firstOfThisYear.toISOString().split('T')[0];  // Start of last year
            return {
                gte: startOfLastYear,
                lt: todayString,
            };
        }
        default:
            throw new Error(`Unsupported time string: ${timeString}`);
    }
}

export type ElasticsearchRangeQuery = {
    range: {
        [key: string]: TimeRange & { format: string };
    };
};

export function findTimeFilter(
    context: ElasticSearchContext,
    filter: TimeFilters,
    timestampField: string = 'timestamp'
): ElasticsearchRangeQuery | undefined {
    const timeFilterEntries = Object.entries(filter);

    for (const [pluginName, timeString] of timeFilterEntries) {
        if (timeStrings.includes(timeString)) {
            const range = getTimeRange(context.timeService, timeString);
            return {
                range: {
                    [timestampField]: {
                        ...range,
                        format: "strict_date_optional_time",
                    },
                },
            };
        }
    }
    return undefined;
}
