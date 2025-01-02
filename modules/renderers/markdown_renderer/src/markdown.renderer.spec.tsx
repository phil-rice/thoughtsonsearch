import React from "react";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import {MarkdownRenderer} from "./markdown.renderer";

// Mock react-markdown globally for this test suite
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);

describe("MarkdownRenderer", () => {
    it("renders markdown content inside CleanHeaders", () => {
        render(<MarkdownRenderer rootId={"root"} attribute={"test"} value="**Bold Text**" />);

        // Assert that the cleaned markdown is rendered
        expect(screen.getByText("**Bold Text**")).toBeInTheDocument();

        // Assert that it is wrapped in CleanHeaders' div
        const container = screen.getByText("**Bold Text**").closest(".clean-headers");
        expect(container).toBeInTheDocument();
    });

    it("trims excessive newlines in markdown", () => {
        render(<MarkdownRenderer rootId={"root"} attribute={"test"} value={`\n\nHeading\n\n\nContent`} />);

        const rootElement = screen.getByTestId(`root-test`);
        expect(rootElement.textContent).toBe("Heading\n\nContent");
    });

    it("renders with the correct ID based on rootId and attribute", () => {
        render(<MarkdownRenderer rootId={"root"} attribute={"test"} value="Some Text" />);

        const container = screen.getByTestId(`root-test`);
        expect(container).toBeInTheDocument();
    });
});
