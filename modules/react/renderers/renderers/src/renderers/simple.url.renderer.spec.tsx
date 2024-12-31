import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SimpleUrlRenderer } from "./simple.url.renderer";
import { ellipsesInMiddle } from "@enterprise_search/recoil_utils";

describe("SimpleUrlRenderer component", () => {
    const validUrl = "https://www.example.com/path/to/resource";
    const longUrl = "https://www.superlongexample.com/some/very/long/path/to/resource/that/never/ends";
    const truncatedUrl = ellipsesInMiddle(longUrl, 50);

    test("renders valid URL without truncation if short enough", () => {
        render(<SimpleUrlRenderer id="test" value={validUrl} />);

        const link = screen.getByRole('link', { name: validUrl });
        expect(link).toHaveAttribute('href', validUrl);
        expect(link).toHaveTextContent(validUrl);
    });

    test("truncates long URLs with ellipses in the middle", () => {
        render(<SimpleUrlRenderer id="test" value={longUrl} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', longUrl);
        expect(link).toHaveTextContent(truncatedUrl);
    });

    test("falls back to '#' if URL is invalid", () => {
        const invalidUrl = "not-a-valid-url";
        render(<SimpleUrlRenderer id="test" value={invalidUrl} />);

        const link = screen.getByRole('link', { name: invalidUrl });
        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveTextContent(invalidUrl);
    });

    test("renders empty href for empty string value", () => {
        render(<SimpleUrlRenderer id="test" value="" />);

        const link = screen.getByRole('link', { name: "" });
        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveTextContent('');
    });

    test("handles extremely long URLs", () => {
        const extremeUrl = "https://www.example.com/" + "a".repeat(200);
        render(<SimpleUrlRenderer id="test" value={extremeUrl} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', extremeUrl);
        expect(link).toHaveTextContent(ellipsesInMiddle(extremeUrl, 50));
    });
});
