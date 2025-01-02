import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {DataViewFilterData} from "./react.data.view.filter";
import '@testing-library/jest-dom';
import {TranslationFn, TranslationProvider} from "@enterprise_search/translation";
import {SimpleDataViewFilterDisplay} from "./simple.data.view.filter.display";
import {GetterSetter} from "@enterprise_search/react_utils";

// Mock translation function
const mockTranslation: TranslationFn = (key) => `${key}-translated`;

// Mock Data
const mockFilterData: DataViewFilterData = {
    selected: 'infra',
    allowedNames: ['infra', 'dev', 'prod'],
    selectedNames: ['infra']
};

// Utility to render the component with translation
const renderWithProviders = (filterData: DataViewFilterData) => {
    const setFilterData = jest.fn();
    const filterOps: GetterSetter<DataViewFilterData> = [filterData, setFilterData];

    return render(
        <TranslationProvider value={mockTranslation}>
            <SimpleDataViewFilterDisplay filterOps={filterOps} id="test-filter" />
        </TranslationProvider>
    );
};

describe("SimpleDataViewFilterDisplay", () => {
    it("renders TranslatedLabel and TranslatedMultiSelect", () => {
        renderWithProviders(mockFilterData);

        expect(screen.getByText('filter.data-view.select-data-sources-translated')).toBeInTheDocument();
        expect(screen.getByLabelText('filter.data-view.select-data-sources-translated')).toBeInTheDocument();
        expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("displays all allowed names with checkboxes", () => {
        renderWithProviders(mockFilterData);

        expect(screen.getByRole("checkbox", { name: "infra-translated" })).toBeChecked();
        expect(screen.getByRole("checkbox", { name: "dev-translated" })).not.toBeChecked();
        expect(screen.getByRole("checkbox", { name: "prod-translated" })).not.toBeChecked();
    });

    it("calls setFilterData when selection changes", () => {
        const setFilterData = renderWithProviders(mockFilterData);

        fireEvent.click(screen.getByRole("checkbox", { name: "dev-translated" }));

        expect(setFilterData).toHaveBeenCalledWith({
            ...mockFilterData,
            selectedNames: ['infra', 'dev']
        });
    });

    it("removes selection when checkbox is unchecked", () => {
        const setFilterData = renderWithProviders({
            ...mockFilterData,
            selectedNames: ['infra', 'dev']
        });

        fireEvent.click(screen.getByRole("checkbox", { name: "dev-translated" }));

        expect(setFilterData).toHaveBeenCalledWith({
            ...mockFilterData,
            selectedNames: ['infra']
        });
    });

    it("renders no items message if no allowed names", () => {
        renderWithProviders({
            ...mockFilterData,
            allowedNames: []
        });

        expect(screen.getByText("filter.data-view.no-data-sources-translated")).toBeInTheDocument();
    });

    it("associates label with the select dropdown", () => {
        renderWithProviders(mockFilterData);

        const label = screen.getByText('filter.data-view.select-data-sources-translated');
        const listbox = screen.getByRole("listbox");
        expect(label).toHaveAttribute('for', 'test-filter');
        expect(listbox).toHaveAttribute('id', 'test-filter');
    });
});
