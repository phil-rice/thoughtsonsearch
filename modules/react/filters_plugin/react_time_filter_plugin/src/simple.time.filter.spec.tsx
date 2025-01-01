import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { GetterSetter } from "@enterprise_search/react_utils";
import { SimpleTimeDisplay } from "./simple.time.filter";

// Wrapper to provide filterOps for the component
export function TimeDisplayWrapper({ children }: { children: (filterOps: GetterSetter<string>) => React.ReactNode }) {
    const filterOps = useState<string>('');
    return children(filterOps);
}

describe('SimpleTimeDisplay', () => {
    it('renders select element with correct options', () => {
        render(
            <TimeDisplayWrapper>
                {ops => (
                    <>
                        <SimpleTimeDisplay filterOps={ops} id="time-filter" />
                        <span data-testid="time-filter-value">{ops[0]}</span>
                    </>
                )}
            </TimeDisplayWrapper>
        );

        const selectElement = screen.getByLabelText('Time filter');
        expect(selectElement).toBeInTheDocument();
        expect(selectElement).toHaveValue('');

        // Assert options are present
        expect(screen.getByText('Yesterday')).toBeInTheDocument();
        expect(screen.getByText('Last Week')).toBeInTheDocument();
        expect(screen.getByText('Last Month')).toBeInTheDocument();
        expect(screen.getByText('Clear filter')).toBeInTheDocument();
        expect(screen.getByText('Select time...')).toBeInTheDocument();
    });

    it('updates the filter state when a time option is selected', () => {
        render(
            <TimeDisplayWrapper>
                {ops => (
                    <>
                        <SimpleTimeDisplay filterOps={ops} id="time-filter" />
                        <span data-testid="time-filter-value">{ops[0]}</span>
                    </>
                )}
            </TimeDisplayWrapper>
        );

        const selectElement = screen.getByLabelText('Time filter');

        fireEvent.change(selectElement, { target: { value: 'yesterday' } });
        expect(selectElement).toHaveValue('yesterday');
        expect(screen.getByTestId('time-filter-value')).toHaveTextContent('yesterday');
    });

    it('clears the filter when "Clear filter" is selected', () => {
        render(
            <TimeDisplayWrapper>
                {ops => (
                    <>
                        <SimpleTimeDisplay filterOps={ops} id="time-filter" />
                        <span data-testid="time-filter-value">{ops[0]}</span>
                    </>
                )}
            </TimeDisplayWrapper>
        );

        const selectElement = screen.getByLabelText('Time filter');

        // Select a filter first
        fireEvent.change(selectElement, { target: { value: 'lastweek' } });
        expect(screen.getByTestId('time-filter-value')).toHaveTextContent('lastweek');

        // Now clear the filter
        fireEvent.change(selectElement, { target: { value: '' } });
        expect(selectElement).toHaveValue('');
        expect(screen.getByTestId('time-filter-value')).toHaveTextContent('');
    });

    it('renders the separator option as disabled', () => {
        render(
            <TimeDisplayWrapper>
                {ops => (
                    <>
                        <SimpleTimeDisplay filterOps={ops} id="time-filter" />
                    </>
                )}
            </TimeDisplayWrapper>
        );

        const separatorOption = screen.getByText('----');
        expect(separatorOption).toBeDisabled();
    });
});
