import React from 'react';
import {renderHook} from '@testing-library/react';
import {SearchParserProvider, useSearchParser} from "./search.parser";
import {simpleSearchParser} from "./simple.search.parser";
import {renderHookShouldThrowError} from "@enterprise_search/react_utils/src/render.hook.utils";


// Mock data
const mockFilters = {keywords: 'test'};

// Helper to render the hook inside the provider
const renderWithProvider = (hook: () => any) => {
    return renderHook(hook, {
        wrapper: ({children}) => (
            <SearchParserProvider searchParser={simpleSearchParser}>
                {children}
            </SearchParserProvider>
        ),
    });
};

// Test cases
describe('SearchParser Context', () => {
    it('returns the default parser when used outside of the provider', () => {
        const { result } = renderHook(() => useSearchParser());
        expect(result.current).toEqual(simpleSearchParser);
    });

    it('provides the default search parser when used within the provider', () => {
        const {result} = renderWithProvider(() => useSearchParser());
        expect(result.current).toEqual(simpleSearchParser);
    });

    it('parses filters correctly with the default parser', () => {
        const {result} = renderWithProvider(() => useSearchParser());

        const parser = result.current;
        const parsedFilters = parser(mockFilters, {keywords: 'existing'});

        expect(parsedFilters).toEqual(mockFilters);
    });

    it('returns existing filters if no new filters are applied', () => {
        const {result} = renderWithProvider(() => useSearchParser());

        const parser = result.current;
        const parsedFilters = parser({}, mockFilters);

        expect(parsedFilters).toEqual({});
    });
});
