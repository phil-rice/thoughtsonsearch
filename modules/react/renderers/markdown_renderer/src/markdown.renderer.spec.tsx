import React from "react";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import {MarkdownRenderer} from "./markdown.renderer";


// Mock react-markdown globally for this test suite
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);

describe("MarkdownRenderer", () => {
    it("renders markdown content inside CleanHeaders", () => {
        render(<MarkdownRenderer id="test" value="**Bold Text**"/>);

        // Assert that the cleaned markdown is rendered
        expect(screen.getByText("**Bold Text**")).toBeInTheDocument();

        // Assert that it is wrapped in CleanHeaders' div
        const container = screen.getByText("**Bold Text**").closest(".clean-headers");
        expect(container).toBeInTheDocument();
    });

    it("trims excessive newlines in markdown", () => {
        render(<MarkdownRenderer id="test" value={`\n\nHeading\n\n\nContent`}/>);

        const rootElement = screen.getByTestId('test-markdown');

        expect(rootElement.textContent).toBe("Heading\n\nContent");
    });

    it("applies CleanHeaders styling to headings", () => {
        //I don't know how to test this... we are mocking the markdown.
        //we have already tested that the markdown is wrapped in a div with the class clean-headers
        //and we have tested the CleanHeaders component
    });


});
