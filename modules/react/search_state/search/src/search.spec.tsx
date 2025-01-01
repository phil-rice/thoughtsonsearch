import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {Errors} from "@enterprise_search/errors";
import {SearchState} from "@enterprise_search/search_state";
import '@testing-library/jest-dom';
import {jiraConflFiltersForTest, ProviderForSearchTests, TestFilters, TestSearchStateDisplay} from "./search.fixture";
import {jest} from "@jest/globals";
import {DoTheSearching} from "./search";

describe("DoTheSearching Component", () => {
    it("performs fetch and updates state", async () => {
        const reportedErrors: Errors[] = [];

        const state: SearchState<TestFilters> = {
            searches: {
                main: {
                    count: 0, filters: jiraConflFiltersForTest, dataSourceToSearchResult: {}
                },
                immediate: {count: 0, filters: undefined, dataSourceToSearchResult: {}},
            },
        };

        const mockFetch = jest.fn(async () => {
            return ({
                value: {
                    data: [{type: "resultType", name: "Item 1"}],
                    aggregates: {},
                    paging: {},
                },
            });
        });

        // Render with the test state display component
        render(
            <ProviderForSearchTests
                fetch={mockFetch}
                reportedErrors={reportedErrors}
                state={state}
                dataViews={{}} // Mock data views
                url="http://localhost/all/jira"
            >
                <DoTheSearching resultSize={10}>
                    <TestSearchStateDisplay/>
                </DoTheSearching>
            </ProviderForSearchTests>
        );

        // Ensure initial state is rendered
        // Wait for fetch to complete and state to update
        await waitFor(() => expect(mockFetch).toHaveBeenCalled());
        expect(await screen.findByLabelText("search-state")).toBeInTheDocument();


        // Validate the state now contains the new search results
        const stateText = await screen.findByLabelText("search-state");
        const updatedState = JSON.parse(stateText.textContent || "{}");

        expect(updatedState.searches.main.dataSourceToSearchResult).toMatchObject({
            test: {
                value: {
                    data: [{type: "resultType", name: "Item 1"}],
                },
            },
        });

        // Confirm no errors were reported during the process
        expect(reportedErrors.length).toBe(0);
    });
});
