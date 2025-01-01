import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import {SimpleH1Renderer, SimpleH2Renderer, SimpleH3Renderer} from "./simple.headers.renderer";

describe("Simple Heading Renderers", () => {

    it("renders an h1 element with the correct text and ID", () => {
        render(<SimpleH1Renderer id="title" value="Main Title" />);
        const heading = screen.getByRole("heading", { level: 1 });

        expect(heading).toHaveTextContent("Main Title");
        expect(heading).toHaveAttribute("id", "title-value");
    });

    it("renders an h2 element with the correct text and ID", () => {
        render(<SimpleH2Renderer id="subtitle" value="Subsection Title" />);
        const heading = screen.getByRole("heading", { level: 2 });

        expect(heading).toHaveTextContent("Subsection Title");
        expect(heading).toHaveAttribute("id", "subtitle-value");
    });

    it("renders an h3 element with the correct text and ID", () => {
        render(<SimpleH3Renderer id="detail" value="Detail Title" />);
        const heading = screen.getByRole("heading", { level: 3 });

        expect(heading).toHaveTextContent("Detail Title");
        expect(heading).toHaveAttribute("id", "detail-value");
    });

    it("ensures headings are correctly hierarchical", () => {
        render(
            <>
                <SimpleH1Renderer id="main" value="Main Section" />
                <SimpleH2Renderer id="sub" value="Sub Section" />
                <SimpleH3Renderer id="detail" value="Detail Section" />
            </>
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main Section");
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Sub Section");
        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Detail Section");
    });

    it("renders empty headings if value is not provided", () => {
        render(<SimpleH1Renderer id="empty" value="" />);
        const heading = screen.getByRole("heading", { level: 1 });

        expect(heading).toBeEmptyDOMElement();
    });
});
