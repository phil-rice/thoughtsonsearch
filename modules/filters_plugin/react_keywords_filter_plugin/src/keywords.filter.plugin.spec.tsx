import React from "react";
import {render, screen} from "@testing-library/react";
import {keywordsFilterPlugin, SimpleKeywordsDisplay} from "./keywords.filter.plugin";
import {filtersDisplayPurpose} from "@enterprise_search/react_filters_plugin/src/react.filters.plugin";
import {WindowUrlData} from "@enterprise_search/routing";
import '@testing-library/jest-dom';
import {DebugLog} from "@enterprise_search/recoil_utils";

// Mock Debug Function
const mockDebug = jest.fn() as any as DebugLog;

// Helper to generate mock WindowUrlData
const createMockWindowUrlData = (urlString: string): WindowUrlData => ({
    url: new URL(urlString),
    parts: []
});

// Mock DisplayFilterProps
const mockFilterOps = ["search-term", jest.fn()];

// Utility to render SimpleKeywordsDisplay
const renderSimpleDisplay = (filter = "default-term") => {
    render(<SimpleKeywordsDisplay filterOps={[filter, jest.fn()]} id="keywords-display"/>);
};

// Tests
describe("keywordsFilterPlugin", () => {
    const plugin = keywordsFilterPlugin(SimpleKeywordsDisplay);

    it("returns the correct plugin structure", () => {
        expect(plugin.plugin).toBe('filter');
        expect(plugin.type).toBe('keywords');
        expect(plugin.DefaultDisplay).toBe(SimpleKeywordsDisplay);
        expect(plugin.PurposeToDisplay[filtersDisplayPurpose]).toBeNull();
    });

    it("parses filter from URL correctly", () => {
        const mockUrlData = createMockWindowUrlData("https://example.com?keywords=devops");
        const filter = plugin.fromUrl(mockDebug, mockUrlData, "default");

        expect(filter).toBe("devops");
        expect(mockDebug).toHaveBeenCalledWith("keywordsFilter fromurl", "keywords=", "devops", "devops");
    });

    it("returns default if no filter in URL", () => {
        const mockUrlData = createMockWindowUrlData("https://example.com");
        const filter = plugin.fromUrl(mockDebug, mockUrlData, "default");

        expect(filter).toBe("default");
    });

    it("adds filter to URL search params", () => {
        const searchParams = new URLSearchParams();
        plugin.addToUrl(mockDebug, searchParams, "infra");

        expect(searchParams.toString()).toBe("keywords=infra");
        expect(mockDebug).toHaveBeenCalledWith('keywordsFilter addToUrl', 'keywords=', 'infra');
    });

    it("removes filter from URL if empty", () => {
        const searchParams = new URLSearchParams("keywords=infra");
        plugin.addToUrl(mockDebug, searchParams, "");

        expect(searchParams.has('keywords')).toBe(false);
    });
});

describe("SimpleKeywordsDisplay", () => {
    it("renders the filter value", () => {
        renderSimpleDisplay("React Testing");

        expect(screen.getByText("React Testing")).toBeInTheDocument();
    });

    it("renders default filter value if none is provided", () => {
        renderSimpleDisplay();

        expect(screen.getByText("default-term")).toBeInTheDocument();
    });
});
