import React from "react";
import {renderHook} from "@testing-library/react";
import {ErrorsOr} from "@enterprise_search/errors";
import {DataSourcePlugin, DataSourcePluginProvider, useDataSourcePlugins, validateDataSourcePlugins} from "./react.data.source.plugin";

// Mock types
type MockFilters = { term: string };
type MockPaging = { page: number };
type MockDetails = { type: string; names: string[] };

// Mock Fetch Implementation
const mockFetch: any = async (): Promise<ErrorsOr<any>> => ({
    value: {
        data: [{id: 1, name: "Result 1"}],
        paging: {page: 1},
    },
});

// Mock Valid Plugin
const validPlugin: DataSourcePlugin<MockDetails, MockFilters, MockPaging> = {
    plugin: "datasource",
    datasourceName: "mockSource",
    validate: function () {
        return [];
    },
    fetch: mockFetch,
};

// Mock Invalid Plugin
const invalidPlugin: DataSourcePlugin<MockDetails, MockFilters, MockPaging> = {
    plugin: "datasource",
    datasourceName: "invalidSource",
    validate: function () {
        return ["Missing configuration", "Invalid schema"];
    },
    fetch: mockFetch,
};

// Test Suite
describe("DataSourcePlugin", () => {
    it("validates a correct plugin without throwing", () => {
        const plugins = {mockSource: validPlugin};
        expect(() => validateDataSourcePlugins(plugins)).not.toThrow();
    });

    it("throws an error for invalid plugins during validation", () => {
        const plugins = {invalidSource: invalidPlugin};
        expect(() => validateDataSourcePlugins(plugins)).toThrow(
            "Plugin invalidSource has errors: Missing configuration, Invalid schema"
        );
    });

    it("validates multiple plugins, throwing only for invalid ones", () => {
        const plugins = {
            mockSource: validPlugin,
            invalidSource: invalidPlugin,
        };

        expect(() => validateDataSourcePlugins(plugins)).toThrow(
            "Plugin invalidSource has errors: Missing configuration, Invalid schema"
        );
    });
});

describe("DataSourcePluginProvider and Context", () => {
    it("provides plugins via context and retrieves them with useDataSourcePlugins", () => {
        const wrapper = ({children}: { children: React.ReactNode }) => (
            <DataSourcePluginProvider plugins={{mockSource: validPlugin}}>
                {children}
            </DataSourcePluginProvider>
        );

        const {result} = renderHook(() => useDataSourcePlugins(), {wrapper});
        expect(result.current).toHaveProperty("mockSource");
        expect(result.current.mockSource).toEqual(validPlugin);
    });

    it("throws when useDataSourcePlugins is called without provider", () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        try {

            let caughtError: Error | null = null;

            try {
                renderHook(() => useDataSourcePlugins());
            } catch (error) {
                caughtError = error as Error;
            }

            expect(caughtError).toBeInstanceOf(Error);
            expect(caughtError?.message).toEqual('s/w: usePlugins must be used within a PluginsProvider');
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });


});
