import {render, renderHook} from "@testing-library/react";
import '@testing-library/jest-dom';
import {consoleErrorReporter, NonFunctionalsProvider, useThrowError} from "@enterprise_search/react_utils";
import React, {act} from "react";
import {DataPlugin, DataPluginProvider, DataPlugins, useOneLineDisplayDataComponent} from "./react.data";
import {WindowUrlProviderForTests} from "@enterprise_search/routing";

const mockPlugin: DataPlugin<any> = {
    OneLineDisplayData: jest.fn(() => <div>One Line Display</div>),
    plugin: 'data',
    type: 'mockType'
} as any;

const dataPlugins: DataPlugins = {
    mockType: mockPlugin,
};

const wrapper = (plugins = dataPlugins) => ({children}: { children: React.ReactNode }) => (
    <WindowUrlProviderForTests initialUrl={'http://any'}>
        <NonFunctionalsProvider debugState={{}} errorReporter={consoleErrorReporter} featureFlags={{}}>
            <DataPluginProvider dataPlugins={plugins}>
                {children}
            </DataPluginProvider>
        </NonFunctionalsProvider>
    </WindowUrlProviderForTests>

)


describe("useOneLineDisplayDataComponent", () => {

    it("returns OneLineDisplayData component when plugin exists", () => {
        const {result} = renderHook(() => useOneLineDisplayDataComponent(), {wrapper: wrapper()});

        const Component = result.current("mockType");
        const {container} = render(<Component data={{}} id="test"/>);

        expect(container).toHaveTextContent("One Line Display");
        expect(mockPlugin.OneLineDisplayData).toHaveBeenCalled();
    });

    it("throws an error if no plugin exists for the type", () => {
        const {result} = renderHook(() => useOneLineDisplayDataComponent(), {wrapper: wrapper()});

        expect(() => result.current("unknownType")).toThrowError("s/w: No plugin found for data type unknownType. Legal values are mockType");

    });

    it("throws an error if plugin exists but OneLineDisplayData is missing", () => {
        const faultyPlugins = {
            mockType: {
                ...mockPlugin,
                OneLineDisplayData: undefined,
            },
        };
        const {result} = renderHook(() => useOneLineDisplayDataComponent(), {wrapper: wrapper(faultyPlugins)});
        expect(() => result.current("mockType")).toThrowError("s/w: No one line display data found for data type mockType");

    });
});
