import {render, screen} from "@testing-library/react";
import React from "react";
import {AttributeValueProvider, useAttributeValueComponents} from "./attribute.value";

import '@testing-library/jest-dom';
import {SimpleTextRenderer} from "./renderers/simple.text.renderer";

// Mock translation hook
jest.mock("@enterprise_search/translation", () => ({
    useTranslation: () => (key: string) => key + "-translated",
}));

const renderers: any = {
    Text: SimpleTextRenderer,
};

const TestComponent = () => {
    const {Text} = useAttributeValueComponents();
    return <Text rootId="root" attribute="Name" value="John Doe"/>;
};
const TestComponentEmpty = () => {
    const {Text} = useAttributeValueComponents();
    return <Text rootId="root" attribute="Name" value=""/>;
};
describe("AttributeValueProvider", () => {
    it("renders an attribute-value pair with translation and correct ID", () => {
        render(
            <AttributeValueProvider
                renderers={renderers}
                AttributeValueLayout={({children}) => <div>{children}</div>}
                DataLayout={() => <div/>}
            >
                <TestComponent/>
            </AttributeValueProvider>
        );

        const label = screen.getByText("root.Name-translated:");
        const value = screen.getByText("John Doe");

        expect(label).toBeInTheDocument();
        expect(value).toBeInTheDocument();
        expect(value).toHaveAttribute("id", "root-Name-value");
    });

    it("renders empty string for missing values", () => {
        render(
            <AttributeValueProvider
                renderers={renderers}
                AttributeValueLayout={({children}) => <div>{children}</div>}
                DataLayout={() => <div/>}
            >
                <TestComponentEmpty/>
            </AttributeValueProvider>
        );

        const label = screen.getByText("root.Name-translated:");
        const value = screen.getByLabelText("Not available");  // Directly select by aria-label

        expect(label).toBeInTheDocument();
        expect(value).toBeEmptyDOMElement();  // Still checks DOM emptiness
    });


    it("throws error if used outside of provider", () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        try {
            expect(() => render(<TestComponent/>)).toThrow(
                "useAttributeValueComponents must be used inside an AttributeValueProvider"
            );
        } finally {
            consoleErrorMock.mockRestore();
        }
    });

});
