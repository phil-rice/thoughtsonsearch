import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {OneSearch, SearchState} from "@enterprise_search/search_state";
import {SearchInfoProviderUsingUseState, useAllSearches, useFiltersByStateType, useOneFilterBySearchType, useSearchResultsByStateType, useSearchState} from "./react.search.state";
import {renderHookShouldThrowError} from "@enterprise_search/react_utils/src/render.hook.utils";

// Mock search state
const mockSearchState: SearchState<any> = {
    searches: {
        main: {
            count: 1,
            filters: { space: ['infra'], time: 'last 3 hours' },
            dataSourceToSearchResult: {},
        },
        immediate: {
            count: 2,
            filters: { space: ['dev'], time: 'last 24 hours' },
            dataSourceToSearchResult: {},
        },
    },
};

// Utility to render providers for tests
const renderWithProvider = (ui: React.ReactNode, state = mockSearchState) => {
    return render(
        <SearchInfoProviderUsingUseState allSearchState={state}>
            {ui}
        </SearchInfoProviderUsingUseState>
    );
};

describe('SearchState Context', () => {
    it('throws an error when useSearchState is called outside of the provider', () => {
        renderHookShouldThrowError(
            () => useSearchState(),
            's/w: useSearchState must be used within a SearchStateProvider or SearchInfoProviderUsingUseState'
        );
    });

    it('throws an error when useAllSearches is called outside of the provider', () => {
        renderHookShouldThrowError(
            () => useAllSearches(),
            's/w: useAllSearches must be used within a SearchStateProvider or SearchInfoProviderUsingUseState'
        );
    });

    it('throws an error when useSearchResultsByStateType is called outside of the provider', () => {
        renderHookShouldThrowError(
            () => useSearchResultsByStateType('main'),
            's/w: useSearchResultsByStateType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState'
        );
    });

    it('throws an error when useFiltersByStateType is called outside of the provider', () => {
        renderHookShouldThrowError(
            () => useFiltersByStateType('main'),
            's/w: useFiltersByStateType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState'
        );
    });

    it('throws an error when useOneFilterBySearchType is called outside of the provider', () => {
        renderHookShouldThrowError(
            () => useOneFilterBySearchType('main'),
            's/w: useOneFilterBySearchType must be used within a SearchStateProvider or SearchInfoProviderUsingUseState'
        );
    });

    it('provides search state through useSearchState within provider', () => {
        const { result } = renderHook(() => useSearchState(), {
            wrapper: ({ children }) => (
                <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                    {children}
                </SearchInfoProviderUsingUseState>
            ),
        });

        expect(result.current[0]).toEqual(mockSearchState);
    });

    it('updates search state through useSearchState', () => {
        const { result } = renderHook(() => useSearchState<any>(), {
            wrapper: ({ children }) => (
                <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                    {children}
                </SearchInfoProviderUsingUseState>
            ),
        });

        const newState:SearchState<any> = {
            searches: {
                main: {
                    count: 3,
                    filters: { space: ['prod'] },
                    dataSourceToSearchResult: {},
                },
                immediate:{
                    count: 4,
                    filters: { space: ['dev'] },
                    dataSourceToSearchResult: {},
                }
            },
        };

        act(() => {
            result.current[1](newState);
        });

        expect(result.current[0]).toEqual(newState);
    });

    it('returns the correct one search state using useSearchResultsByStateType', () => {
        const { result } = renderHook(() => useSearchResultsByStateType('main'), {
            wrapper: ({ children }) => (
                <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                    {children}
                </SearchInfoProviderUsingUseState>
            ),
        });

        expect(result.current[0]).toEqual(mockSearchState.searches.main);
    });

    it('updates one search state correctly using useSearchResultsByStateType', () => {
        const { result } = renderHook(() => useSearchResultsByStateType('main'), {
            wrapper: ({ children }) => (
                <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                    {children}
                </SearchInfoProviderUsingUseState>
            ),
        });

        const updatedMainSearch: OneSearch<any> = {
            count: 5,
            filters: { space: ['new-space'] },
            dataSourceToSearchResult: {},
        };

        act(() => {
            result.current[1](updatedMainSearch);
        });

        expect(result.current[0]).toEqual(updatedMainSearch);
    });

    it('filters state by search type using useFiltersByStateType', () => {
        const { result } = renderHook(() => useFiltersByStateType('immediate'), {
            wrapper: ({ children }) => (
                <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                    {children}
                </SearchInfoProviderUsingUseState>
            ),
        });

        expect(result.current[0]).toEqual({ space: ['dev'], time: 'last 24 hours' });
    });
});
