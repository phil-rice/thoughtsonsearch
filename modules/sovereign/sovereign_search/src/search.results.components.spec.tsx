import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

import {ErrorInDataSource, ErrorInDataSourceProps, SearchResultsComponents, SearchResultsComponentsProvider, SimpleErrorInDataSource} from './search.results.components';
import {UserDataProvider} from '@enterprise_search/react_login_component';

// Mock components for ErrorInDataSourceDev and ErrorInDataSourceNormal
const MockErrorInDataSourceDev = (props: ErrorInDataSourceProps) => (
    <span data-testid="error-dev">Dev Error: {props.dataSourceName}</span>
);

const MockErrorInDataSourceNormal = (props: ErrorInDataSourceProps) => (
    <span data-testid="error-normal">Normal Error: {props.dataSourceName}</span>
);

// Mock providers for testing
const MockSearchResultsComponentsProvider = ({ children }: { children: React.ReactNode }) => {
    const mockComponents: SearchResultsComponents = {
        ErrorInDataSourceDev: MockErrorInDataSourceDev,
        ErrorInDataSourceNormal: MockErrorInDataSourceNormal
    };
    return (
        <SearchResultsComponentsProvider searchResultsComponents={mockComponents}>
            {children}
        </SearchResultsComponentsProvider>
    );
};

const MockUserDataProvider = ({
                                  isDev,
                                  children
                              }: {
    isDev: boolean;
    children: React.ReactNode;
}) => {
    const userData = { isDev };
    return <UserDataProvider userData={userData as any}>{children}</UserDataProvider>;
};

// Test cases
describe('ErrorInDataSource', () => {
    const errorProps: ErrorInDataSourceProps = {
        dataSourceName: 'TestDataSource',
        errors: {
            reference: '12345',
            errors: ['Something went wrong'],
            extras: { key: 'value' }
        }
    };

    it('renders ErrorInDataSourceDev when isDev is true', () => {
        render(
            <MockUserDataProvider isDev={true}>
                <MockSearchResultsComponentsProvider>
                    <SimpleErrorInDataSource {...errorProps} />
                </MockSearchResultsComponentsProvider>
            </MockUserDataProvider>
        );

        expect(screen.getByTestId('error-dev')).toBeInTheDocument();
        expect(screen.getByText(/Dev Error: TestDataSource/i)).toBeInTheDocument();
    });

    it('renders ErrorInDataSourceNormal when isDev is false', () => {
        render(
            <MockUserDataProvider isDev={false}>
                <MockSearchResultsComponentsProvider>
                    <SimpleErrorInDataSource {...errorProps} />
                </MockSearchResultsComponentsProvider>
            </MockUserDataProvider>
        );

        expect(screen.getByTestId('error-normal')).toBeInTheDocument();
        expect(screen.getByText(/Normal Error: TestDataSource/i)).toBeInTheDocument();
    });
});
