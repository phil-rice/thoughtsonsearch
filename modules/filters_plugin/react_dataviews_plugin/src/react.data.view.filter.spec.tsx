import React from "react";
import {render, screen} from "@testing-library/react";
import {WindowUrlData} from "@enterprise_search/routing";
import '@testing-library/jest-dom';
import {DebugLog} from "@enterprise_search/recoil_utils";
import {SimpleDataViewFilterDisplay} from "./simple.data.view.filter.display";
import {dataViewFilter, DataViewFilterData} from "./react.data.view.filter";

const mockDebug: DebugLog = jest.fn() as any;

// Helper to generate mock WindowUrlData
const createMockWindowUrlData = (urlString: string): WindowUrlData => ({
    url: new URL(urlString),
    parts: []
});

// Mock DisplayFilter component
const MockDisplayFilter = ({ filterOps }: { filterOps: [DataViewFilterData, any] }) => {
    const [filter] = filterOps;
    return <div data-testid="filter-display">{filter.selected}</div>;
};

// Mock Data
const mockFilterData: DataViewFilterData = {
    selected: 'infra',
    allowedNames: ['infra', 'dev', 'prod'],
    selectedNames: ['infra', 'dev']
};

// Create the plugin
const plugin = dataViewFilter(MockDisplayFilter);

describe("dataViewFilter Plugin", () => {
    it("returns correct plugin structure", () => {
        expect(plugin.plugin).toBe('filter');
        expect(plugin.type).toBe('dataviews');
        expect(plugin.DefaultDisplay).toBe(MockDisplayFilter);
    });

    it("parses selected filter from URL correctly", () => {
        const mockUrlData = createMockWindowUrlData("https://example.com?selected=infra+prod");
        const result = plugin.fromUrl(mockDebug, mockUrlData, mockFilterData);

        expect(result.selectedNames).toEqual(['infra','prod']);
        expect(mockDebug).toHaveBeenCalledWith('dataViewFilter fromUrl', 'selected=', 'infra prod');
        expect(mockDebug).toHaveBeenCalledWith('dataViewFilter fromUrl', 'allowed=', ['infra', 'dev', 'prod']);
    });

    it("returns default data if no filter is in URL", () => {
        const mockUrlData = createMockWindowUrlData("https://example.com");
        const result = plugin.fromUrl(mockDebug, mockUrlData, mockFilterData);

        expect(result).toEqual(mockFilterData);
    });

    it("adds selected filter to URL", () => {
        const searchParams = new URLSearchParams();
        plugin.addToUrl(mockDebug, searchParams, mockFilterData);

        expect(searchParams.toString()).toBe("selected=infra+dev");
        expect(mockDebug).toHaveBeenCalledWith('dataViewFilter addToUrl', 'selected=', 'infra dev', '');

    });

    it("removes filter from URL if empty", () => {
        const searchParams = new URLSearchParams("selected=infra");
        const emptyFilterData: DataViewFilterData = {
            selected: '',
            allowedNames: [],
            selectedNames: []
        };

        plugin.addToUrl(mockDebug, searchParams, emptyFilterData);
        expect(searchParams.has('selected')).toBe(false);
    });
});
