import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ErrorInDataSourceProps } from './search.results.components';
import {SimpleErrorInDataSourceDev, SimpleErrorInDataSourceNormal} from "./simple.error.in.data.source";

// Mock Error Props
const mockErrorProps: ErrorInDataSourceProps = {
    dataSourceName: 'SearchAPI',
    errors: {
        reference: 'REF12345',
        errors: ['Timeout occurred', 'Invalid response format'],
        extras: {
            stack: 'Error: Failed at line 45',
            status: 500,
        },
    },
};

describe('SimpleErrorInDataSourceDev', () => {
    it('renders detailed error list for dev mode', () => {
        render(<SimpleErrorInDataSourceDev {...mockErrorProps} />);

        expect(screen.getByText('Error in SearchAPI')).toBeInTheDocument();
        expect(screen.getByText('Reference number: REF12345')).toBeInTheDocument();
        expect(screen.getByText('Timeout occurred')).toBeInTheDocument();
        expect(screen.getByText('Invalid response format')).toBeInTheDocument();
        expect(screen.getByText('stack: "Error: Failed at line 45"')).toBeInTheDocument();
        expect(screen.getByText('status: 500')).toBeInTheDocument();
    });

    it('handles missing extras gracefully', () => {
        const propsWithoutExtras = {
            ...mockErrorProps,
            errors: {
                ...mockErrorProps.errors,
                extras: undefined,
            },
        };

        render(<SimpleErrorInDataSourceDev {...propsWithoutExtras} />);
        expect(screen.getByText('Error in SearchAPI')).toBeInTheDocument();
        expect(screen.queryByText('stack')).not.toBeInTheDocument();
    });
});

describe('SimpleErrorInDataSourceNormal', () => {
    it('renders minimal error message for normal users', () => {
        render(<SimpleErrorInDataSourceNormal {...mockErrorProps} />);

        expect(screen.getByText('Unexpected error in SearchAPI')).toBeInTheDocument();
        expect(screen.getByText('This has been reported to the devs')).toBeInTheDocument();
        expect(screen.getByText('Reference number REF12345')).toBeInTheDocument();
        expect(screen.queryByText('Timeout occurred')).not.toBeInTheDocument();
        expect(screen.queryByText('stack')).not.toBeInTheDocument();
    });
});
