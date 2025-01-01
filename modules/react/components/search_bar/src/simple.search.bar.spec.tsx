import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import {SimpleSearchBar} from "./simple.search.bar";

import {SearchState} from "@enterprise_search/search_state";
import {SearchGuiData, SearchGuiStateProvider} from "@enterprise_search/search_gui_state";
import {SearchInfoProviderUsingUseState} from "@enterprise_search/react_search_state";
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {input} from "@testing-library/user-event/event/input";

// Mock functions
const mockImmediateSearch = jest.fn();
const mockMainSearch = jest.fn();
const mockEscapePressed = jest.fn();

// Mock search state
const mockSearchState: SearchState<any> = {
    searches: {
        main: {
            count: 0,
            filters: {},
            dataSourceToSearchResult: {},
        },
        immediate: {
            count: 0,
            filters: {},
            dataSourceToSearchResult: {},
        },
    },
};

const mockGuiState: SearchGuiData<any> = {
    searchQuery: '',
    filters: {}
}
// Utility to render with providers
const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <SearchGuiStateProvider searchGuiState={mockGuiState}>
            <SearchInfoProviderUsingUseState allSearchState={mockSearchState}>
                {ui}
            </SearchInfoProviderUsingUseState>
        </SearchGuiStateProvider>
    );
};

describe("SimpleSearchBar Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders input and search button", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        expect(screen.getByRole('textbox', {name: /search input/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
    });

    it("autofocuses on the input field when mounted", async () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );
        await waitFor(() => {
            const input = screen.getByRole('textbox', {name: /search input/i});
            expect(input).toHaveFocus();
        });
    });

    it("updates search query on input change", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const input = screen.getByRole('textbox', {name: /search input/i});
        fireEvent.change(input, {target: {value: 'test query'}});

        expect(input).toHaveValue('test query');
        expect(mockImmediateSearch).toHaveBeenCalledWith('test query');
    });

    it("clears search when input is empty", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const input = screen.getByRole('textbox', {name: /search input/i});
        fireEvent.change(input, {target: {value: 'test'}});
        fireEvent.change(input, {target: {value: ''}});

        expect(input).toHaveValue('');
        // Ensure immediateSearch wasn't triggered again after clearing
        expect(mockImmediateSearch).toHaveBeenCalledTimes(1);
        expect(mockImmediateSearch).toHaveBeenCalledWith('test');
    });

    it("disables search button when query is empty", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const button = screen.getByRole('button', {name: /search/i});
        expect(button).toBeDisabled();
    });

    it("enables search button when query is present", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const input = screen.getByRole('textbox', {name: /search input/i});
        const button = screen.getByRole('button', {name: /search/i});

        fireEvent.change(input, {target: {value: 'query'}});
        expect(button).toBeEnabled();
    });

    it("triggers main search on Enter key press", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const input = screen.getByRole('textbox', {name: /search input/i});
        fireEvent.keyUp(input, {key: 'Enter'});

        expect(mockMainSearch).toHaveBeenCalled();
    });

    it("triggers escapePressed callback on Escape key press", () => {
        renderWithProviders(
            <SimpleSearchBar
                immediateSearch={mockImmediateSearch}
                mainSearch={mockMainSearch}
                escapePressed={mockEscapePressed}
            />
        );

        const input = screen.getByRole('textbox', {name: /search input/i});
        fireEvent.keyUp(input, {key: 'Escape'});

        expect(mockEscapePressed).toHaveBeenCalled();
    });
});
