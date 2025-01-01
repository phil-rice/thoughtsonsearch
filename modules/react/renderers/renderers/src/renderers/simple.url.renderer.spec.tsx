import {render, screen} from "@testing-library/react";
import React from "react";
import {SimpleUrlRenderer} from "./simple.url.renderer";
import {ellipsesInMiddle} from "@enterprise_search/recoil_utils";
import '@testing-library/jest-dom';
// No mock for ellipsesInMiddle – use the real implementation

describe("SimpleUrlRenderer", () => {
    it("renders a valid URL as a link", () => {
        render(<SimpleUrlRenderer id="test" value="https://example.com" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveTextContent("https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("truncates long URLs with ellipses in the middle", () => {
        const longUrl = "https://averylongexample.com/some/deep/path/resource/file.html";
        const expectedText = ellipsesInMiddle(longUrl, 70);

        render(<SimpleUrlRenderer id="long-url" value={longUrl} />);
        const link = screen.getByRole("link");

        expect(link).toHaveTextContent(expectedText);
    });

    it("falls back to # for invalid URLs", () => {
        render(<SimpleUrlRenderer id="invalid-url" value="invalid-url" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "#");
        expect(link).toHaveTextContent("invalid-url");
    });

    it("renders empty string as invalid URL", () => {
        render(<SimpleUrlRenderer id="empty-url" value="" />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("href", "#");
        expect(link).toBeEmptyDOMElement();
    });

    it("provides full URL in aria-label and title", () => {
        const testUrl = "https://example.com/path";
        render(<SimpleUrlRenderer id="aria-label" value={testUrl} />);
        const link = screen.getByRole("link");

        expect(link).toHaveAttribute("aria-label", testUrl);
        expect(link).toHaveAttribute("title", testUrl);
    });
});
