import { makeBodyFromQuery, ESQuery } from './elastic.search.body';

describe('makeBodyFromQuery', () => {
    const baseQuery: ESQuery = {
        query: {
            match: {
                title: 'test',
            },
        },
    };

    test('returns the correct structure for a basic query', () => {
        const result = makeBodyFromQuery(10, baseQuery);

        expect(result).toEqual({
            size: 10,
            _source: {
                excludes: [
                    "full_text_embeddings",
                    "full_text",
                    "file",
                    "pdf file path",
                    "pdf",
                ],
            },
            query: {
                match: {
                    title: 'test',
                },
            },
            sort: [
                { _score: { order: "desc" } },
                { _id: { order: "asc" } },
            ],
            aggregations: {
                count: {
                    terms: {
                        field: "_index",
                    },
                },
            },
        });
    });

    test('overrides the query while preserving the structure', () => {
        const customQuery: ESQuery = {
            query: {
                match: {
                    description: 'override',
                },
            },
        };

        const result = makeBodyFromQuery(5, customQuery);

        expect(result.query).toEqual({
            match: {
                description: 'override',
            },
        });
        expect(result.size).toBe(5);
        expect(result.sort).toEqual([
            { _score: { order: "desc" } },
            { _id: { order: "asc" } },
        ]);
    });

    test('merges additional fields in the query', () => {
        const extendedQuery: ESQuery = {
            query: {
                term: {
                    status: 'active',
                },
            },
            track_total_hits: true,
        };

        const result = makeBodyFromQuery(20, extendedQuery);

        expect(result.track_total_hits).toBe(true);
        expect(result.query).toEqual({
            term: {
                status: 'active',
            },
        });
    });

    test('ensures the excludes list is properly set', () => {
        const result = makeBodyFromQuery(15, baseQuery);

        expect(result._source.excludes).toEqual([
            "full_text_embeddings",
            "full_text",
            "file",
            "pdf file path",
            "pdf",
        ]);
    });


    test('aggregations are always applied', () => {
        const result = makeBodyFromQuery(25, {});

        expect(result.aggregations).toEqual({
            count: {
                terms: {
                    field: "_index",
                },
            },
        });
    });

    test('handles an empty query gracefully', () => {
        const result = makeBodyFromQuery(5, {});

        expect(result.query).toBeUndefined();
        expect(result.size).toBe(5);
    });
});
