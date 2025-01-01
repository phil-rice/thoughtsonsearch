import {act, renderHook} from "@testing-library/react";
import React, {ReactNode} from "react";
import {SearchGuiData, SearchGuiStateProvider, useGuiFilter, useGuiFilters, useGuiSearchQuery} from "./search.gui.state";

type SearchGuiTestFilter = { test: string };
const initialState: SearchGuiData<SearchGuiTestFilter> = {
    searchQuery: '',
    filters: {test: 'all'}
};

// Mock Provider Wrapper for Testing
const wrapper = ({children}: { children: ReactNode }) => (
    <SearchGuiStateProvider searchGuiState={initialState}>
        {children}
    </SearchGuiStateProvider>
);

describe("SearchGuiState - useGuiSearchQuery", () => {
    it("should get and update the search query", () => {
        const {result} = renderHook(() => useGuiSearchQuery(), {wrapper});

        expect(result.current[0]).toBe('');  // Initial state

        act(() => {
            result.current[1]("new search");
        });

        expect(result.current[0]).toBe("new search");
    });
});

describe("SearchGuiState - useGuiFilters", () => {
    it("should retrieve and update filters", () => {
        const {result} = renderHook(() => useGuiFilters(), {wrapper});

        expect(result.current[0]).toEqual({test: 'all'});

        act(() => {
            result.current[1]((prev) => ({...prev, test: 'books'}));
        });

        expect(result.current[0]).toEqual({test: 'books'});
    });
});

describe("SearchGuiState - useGuiFilter", () => {
    it("should update the 'test' filter by key", () => {
        const {result} = renderHook(() => useGuiFilter<SearchGuiTestFilter, 'test'>('test'), {wrapper});

        const [value, setValue] = result.current;

        expect(value).toBe('all');  // Initial filter value

        act(() => {
            setValue('electronics');
        });

        const [updatedValue] = result.current;

        expect(updatedValue).toBe('electronics');
    });


});
