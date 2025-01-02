const excludes: readonly string[] = [
    "full_text_embeddings",
    "full_text",
    "file",
    "pdf file path",
    "pdf",
];

export type ESQuery = {
    query?: object;
    aggs?: object;
    [key: string]: any;
};

export type ESRequestBody = {
    size: number;
    _source: {
        excludes: readonly string[];
    };
    sort: object[];
    aggregations: {
        count: {
            terms: {
                field: string;
            };
        };
    };
    [key: string]: any;
};

export type MakeBodyFromQuery = (resultSize: number, query: ESQuery) => ESRequestBody;
export const makeBodyFromQuery: MakeBodyFromQuery = (resultSize, query) => ({
    size: resultSize,
    _source: {
        excludes,
    },
    ...query,
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
