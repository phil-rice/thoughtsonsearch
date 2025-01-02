import {ElasticSearchContext, fetchElasticSearch, processResponse, validateElasticSearch} from './elastic.search';
import {ServiceResponse} from "@enterprise_search/service_caller";
import {isErrors, ThrowError} from "@enterprise_search/errors";
import {DataView} from "@enterprise_search/data_views";
import {TimeService} from "@enterprise_search/recoil_utils";
import {Authentication, emptyAuthentication} from "@enterprise_search/authentication";

// Mock dependencies
const mockServiceCaller = jest.fn();
const mockAuthentication: Authentication = emptyAuthentication

const mockTimeService: TimeService = () => new Date().getTime();

const context: ElasticSearchContext = {
    elasticSearchUrl: 'https://es-cluster.local',
    serviceCaller: mockServiceCaller,
    knownIndices: ['index1', 'index2'],
    authentication: mockAuthentication,
    timeService: mockTimeService,
};

// Mock data view and filters
const mockDataView = {
    datasources: [
        {type: 'elasticSearch', names: ['index1', 'index2','unknown_index']}
    ]
} as unknown as DataView<any>;

const mockFilters = {
    dataviews: {
        selectedNames: ['index1'],
    }
};

// Mock throwError function
const throwError: ThrowError = jest.fn((severity, message) => {
    throw new Error(message);
});

describe('ElasticSearch DataSource Plugin', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Validation', () => {
        test('returns errors when missing context properties', () => {
            const invalidContext = {
                elasticSearchUrl: '',
                serviceCaller: undefined,
                knownIndices: undefined,
                authentication: mockAuthentication,
                timeService: mockTimeService,
            };

            const validate = validateElasticSearch(invalidContext as any);
            const errors = validate();

            expect(errors).toEqual([
                'elasticSearchUrl is required',
                'serviceCaller is required',
                'knownIndices is required',
            ]);
        });

        test('returns no errors when context is valid', () => {
            const validate = validateElasticSearch(context);
            const errors = validate();
            expect(errors).toEqual([]);
        });
    });

    describe('fetchElasticSearch', () => {
        const fetch = fetchElasticSearch(context);

        test('throws error for unknown indices', async () => {
            const unknownFilters = {
                dataviews: {
                    allowedNames: ['index1', 'index2'],
                    selectedNames: ['unknown_index'],
                }
            };

            const fetchCall = fetch(
                {debug: jest.fn(), errorReporter: jest.fn(), dataView: mockDataView, throwError},
                'searchType',
                unknownFilters,
                10,
                {}
            );

            await expect(fetchCall).rejects.toThrow('Unknown indices unknown_index. Known indices are index1,index2');
        });

        test('returns empty result for no indices', async () => {
            const emptyFilters = {
                dataviews: {
                    selectedNames: [],
                    allowedNames: []
                }
            };

            const result = await fetch(
                {debug: jest.fn(), errorReporter: jest.fn(), dataView: mockDataView, throwError},
                'searchType',
                emptyFilters,
                10,
                {}
            );

            expect(result).toEqual({value: {data: [], paging: undefined}});
        });

        test('calls serviceCaller with correct request', async () => {
            mockServiceCaller.mockResolvedValueOnce({
                value: {
                    body: {
                        hits: {
                            total: {value: 1},
                            hits: [{_source: {title: 'Test'}}]
                        }
                    }
                }
            });

            const result = await fetch(
                {debug: jest.fn(), errorReporter: jest.fn(), dataView: mockDataView, throwError},
                'searchType',
                mockFilters,
                10,
                {}
            );

            expect(mockServiceCaller).toHaveBeenCalledWith(
                expect.objectContaining({
                    elasticSearchUrl: context.elasticSearchUrl,
                }),
                expect.objectContaining({
                    method: 'POST',
                    url: 'https://es-cluster.local/index1/_search',
                    headers: {'Content-Type': 'application/json'},
                })
            );
            expect(result).toEqual({value: {data: [{title: 'Test'}], paging: undefined}});
        });

        test('returns errors from serviceCaller', async () => {
            const mockError = {
                errors: ['Service unavailable']
            };
            mockServiceCaller.mockResolvedValueOnce(mockError);

            const errorReporter = jest.fn().mockResolvedValue(mockError);

            const result = await fetch(
                {debug: jest.fn(), errorReporter, dataView: mockDataView, throwError},
                'searchType',
                mockFilters,
                10,
                {}
            );

            expect(isErrors(result)).toBe(true);
            expect(errorReporter).toHaveBeenCalledWith(mockError);
        });
    });

    describe('processResponse', () => {
        test('transforms hits into data array', () => {
            const mockResponse: ServiceResponse<any> = {
                body: {
                    hits: {
                        total: {value: 2},
                        hits: [
                            {_source: {title: 'First'}, _id: '1'},
                            {_source: {title: 'Second'}, _id: '2'}
                        ]
                    }
                }
            } as any;

            const result = processResponse(mockResponse, throwError);

            expect(result).toEqual({
                value: {
                    data: [
                        {title: 'First', _id: '1'},
                        {title: 'Second', _id: '2'}
                    ],
                    paging: undefined
                }
            });
        });

        test('throws error if no hits are found', () => {
            const mockResponse: ServiceResponse<any> = {
                body: {
                    hits: {
                        total: {value: 0},
                        // No hits
                    }
                }
            } as any;

            expect(() => processResponse(mockResponse, throwError)).toThrow('No hits in elastic search response');
        });
    });
});
