import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RenderProvider } from "@enterprise_search/renderers";
import { SearchInfoProviderUsingUseState } from "@enterprise_search/react_search_state";
import { SearchState } from "@enterprise_search/search_state";
import '@testing-library/jest-dom';
import { DevModeSearchState } from "./devmode.search.state";

// Mock SearchState
const mockSearchState: SearchState<any> = {
    searches: {
        main: {
            count: 1,
            filters: { space: ['infra'], time: 'last 3 hours' },
            dataSourceToSearchResult: {}
        },
        immediate: {
            count: 2,
            filters: { space: ['dev'], time: 'last 24 hours' },
            dataSourceToSearchResult: {}
        }
    }
};

// Mock Json Renderer
const testJsonRenderers = {
    Json: ({ id, value }: { id: string; value: string }) => (
        <pre id={id} data-testid={id}>
            {JSON.stringify(value, null, 2)}
        </pre>
    )
} as any;

// Utility to render DevModeSearchState with mock providers
const renderWithSearchState = (searchState: SearchState<any>) => {
    render(
        <RenderProvider renderers={testJsonRenderers}>
            <SearchInfoProviderUsingUseState allSearchState={searchState}>
                <DevModeSearchState />
            </SearchInfoProviderUsingUseState>
        </RenderProvider>
    );
};

// Test Suite
describe("DevModeSearchState", () => {
    it("renders full search state by default", () => {
        renderWithSearchState(mockSearchState);

        const preElement = screen.getByTestId('dev-mode-search-state');
        const jsonText = preElement.textContent;

        // Parse and compare JSON
        const parsedJson = JSON.parse(JSON.parse(jsonText || 'null'));
        expect(parsedJson).toEqual(mockSearchState);
    });

    it("switches to 'main' search state when 'Main' is clicked", () => {
        renderWithSearchState(mockSearchState);

        fireEvent.click(screen.getByText("Main"));

        const preElement = screen.getByTestId('dev-mode-search-state');
        const jsonText = preElement.textContent;

        // Extract and verify 'main' search state
        const parsedJson = JSON.parse(JSON.parse(jsonText || 'null'));
        expect(parsedJson).toEqual(mockSearchState.searches.main);

        // Ensure 'immediate' state data isn't present
        expect(jsonText).not.toContain('dev');
        expect(jsonText).toContain('infra');
    });

    it("switches to 'immediate' search state when 'Immediate' is clicked", () => {
        renderWithSearchState(mockSearchState);

        fireEvent.click(screen.getByText("Immediate"));

        const preElement = screen.getByTestId('dev-mode-search-state');
        const jsonText = preElement.textContent;

        // Extract and verify 'immediate' search state
        const parsedJson = JSON.parse(JSON.parse(jsonText || 'null'));
        expect(parsedJson).toEqual(mockSearchState.searches.immediate);

        // Ensure 'main' state data isn't present
        expect(jsonText).not.toContain('infra');
        expect(jsonText).toContain('dev');
    });


});
