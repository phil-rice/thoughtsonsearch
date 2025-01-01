import {
    searchResultsToDataAndDataSource,
    searchResultsToInterleavedData,
    searchResultsToErrors,
    DatasourceToSearchResult,
    SearchResult,
} from "./search.state";
import { Errors } from "@enterprise_search/errors";

describe("search.utilities", () => {
    const sampleSearchResult: SearchResult<any, any> = {
        datasourceName: "test-source",
        count: 5,
        data: [{ type: "project", name: "Project A" }, { type: "project", name: "Project B" }],
    };

    const sampleErrors: Errors = {
        errors: ["Error occurred"],
    };

    const validResults: DatasourceToSearchResult = {
        source1: { value: sampleSearchResult },
        source2: { value: { ...sampleSearchResult, data: [{ type: "task", name: "Task 1" }] } },
    };

    const mixedResults: DatasourceToSearchResult = {
        source1: { value: sampleSearchResult },
        source2: sampleErrors,
    };

    it("extracts data and groups by type from valid search results", () => {
        const result = searchResultsToDataAndDataSource(validResults);

        expect(result.project).toHaveLength(2);
        expect(result.task).toHaveLength(1);
        expect(result.project[0].data.name).toBe("Project A");
    });

    it("returns empty object for undefined results", () => {
        const result = searchResultsToDataAndDataSource(undefined as any);
        expect(result).toEqual({});
    });

    it("interleaves data from multiple sources", () => {
        const interleaved = searchResultsToInterleavedData(validResults, 2);
        expect(interleaved).toHaveLength(2);
        expect(interleaved[0].data.type).toBe("project");
        expect(interleaved[1].data.type).toBe("task");
    });

    it("limits interleaved data to max `n` entries", () => {
        const interleaved = searchResultsToInterleavedData(validResults, 1);
        expect(interleaved).toHaveLength(1);
    });

    it("extracts errors from search results", () => {
        const errors = searchResultsToErrors(mixedResults);
        expect(errors.source2.errors).toContain("Error occurred");
    });

    it("returns empty object for undefined results when extracting errors", () => {
        const errors = searchResultsToErrors(undefined as any);
        expect(errors).toEqual({});
    });

    it("does not include valid results when extracting errors", () => {
        const errors = searchResultsToErrors(validResults);
        expect(errors).toEqual({});
    });
});
