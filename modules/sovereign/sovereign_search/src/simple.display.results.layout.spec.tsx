import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {SimpleDisplayResultsLayout} from './simple.display.results.layout';

// Helper to generate child components for testing
const MockChild = ({ text }: { text: string }) => (
    <div data-testid="mock-child">{text}</div>
);

describe('SimpleDisplayResultsLayout', () => {
    beforeAll(() => {
        // Mock resizeTo method if not present
        window.resizeTo = (width, height) => {
            Object.assign(window, { innerWidth: width, innerHeight: height });
            window.dispatchEvent(new Event('resize'));
        };
    });

    it('renders single child centered', () => {
        render(
            <SimpleDisplayResultsLayout>
                <MockChild text="Child 1" />
            </SimpleDisplayResultsLayout>
        );

        // Find the child, then traverse up to the grid container
        const childElement = screen.getByText('Child 1');
        const container = childElement.closest('.search-results');

        expect(container).toHaveStyle('justify-content: center');
        expect(container).toHaveStyle('grid-template-columns: 1fr');
    });

    it('renders multiple children in grid layout', () => {
        render(
            <SimpleDisplayResultsLayout>
                <MockChild text="Child 1" />
                <MockChild text="Child 2" />
            </SimpleDisplayResultsLayout>
        );

        const container = screen.getByText('Child 1').parentElement?.parentElement;
        expect(container).not.toHaveStyle('grid-template-columns: 1fr');
        expect(container).toHaveClass('search-results');
        expect(screen.getAllByTestId('mock-child')).toHaveLength(2);
    });

    it('applies responsive styles for smaller screens', () => {
        render(
            <SimpleDisplayResultsLayout>
                <MockChild text="Child 1" />
                <MockChild text="Child 2" />
            </SimpleDisplayResultsLayout>
        );

        const container = screen.getByText('Child 1').parentElement?.parentElement;
        expect(container).toHaveClass('search-results');

        // Simulate resize to a smaller width
        act(() => {
            window.resizeTo(700, 800);
        });

        waitFor(() => {
            expect(screen.getByText('Child 1').parentElement?.parentElement).toHaveStyle('grid-template-columns: 1fr');
        });
    });


});
