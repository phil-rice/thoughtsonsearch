import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { SearchBarAndImmediateSearchLayoutProps } from "./search.drop.down";
import {SimpleSearchBarAndImmediateSearchLayout} from "./simple.searchbar.and.immediate.search.layout";

// Mock children for testing
const FirstChild = () => <div data-testid="child-1">First Child</div>;
const SecondChild = () => <div data-testid="child-2">Second Child</div>;

describe('SimpleSearchBarAndImmediateSearchLayout', () => {
    it('renders both children inside the container', () => {
        const props: SearchBarAndImmediateSearchLayoutProps = {
            children: [<FirstChild key="1" />, <SecondChild key="2" />]
        };

        render(<SimpleSearchBarAndImmediateSearchLayout {...props} />);

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('applies correct container styles', () => {
        const props: SearchBarAndImmediateSearchLayoutProps = {
            children: [<FirstChild key="1" />, <SecondChild key="2" />]
        };

        render(<SimpleSearchBarAndImmediateSearchLayout {...props} />);

        const container = screen.getByTestId('child-1').parentElement;
        expect(container).toHaveStyle({
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
        });
    });
});
