import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
// Mock translation and state
import {DebugStateProvider, GetterSetter} from '@enterprise_search/react_utils';
import {ReactFiltersContextData, ReactFiltersPlugins, ReactFiltersProvider} from "./react.filters.plugin";
import {SimpleDisplayFilters} from "./simple.display.filters";
import {UserDataProvider} from "@enterprise_search/react_login_component";

// Mock Filter Plugin
const MockFilterComponent = ({id}: { id?: string }) => (
    <div data-testid={id}>Mock Filter {id}</div>
);

// Create mock plugins
const mockPlugins: ReactFiltersPlugins<any> = {
    time: {
        plugin: 'filter',
        type: 'time',
        DefaultDisplay: MockFilterComponent,
        PurposeToDisplay: {
        },
    },
    location: {
        plugin: 'filter',
        type: 'location',
        DefaultDisplay: MockFilterComponent,
        PurposeToDisplay: {
            'filters.withoutlocation.purpose': null
        },
    },
};

// Create a mock layout
const MockFilterLayout = ({id, children}: { id: string; children: React.ReactNode }) => (
    <div data-testid={id}>{children}</div>
);

// Mock Context Data
const mockContextData: ReactFiltersContextData<any> = {
    plugins: mockPlugins,
    PurposeToFilterLayout: {
        'filters.display.purpose': MockFilterLayout,
        'filters.withoutlocation.purpose': MockFilterLayout,
    },
};

// Provider Setup
type MockProviderWrapperProps = {
    plugins?: ReactFiltersContextData<any>;
    children: (filterOps: GetterSetter<any>) => React.ReactNode;

}
const MockProviderWrapper = ({children, plugins = mockContextData}: MockProviderWrapperProps) => {
    const initialFilters = {
        time: 'now',
        location: 'NYC',
    };
    const filtersOps: GetterSetter<typeof initialFilters> = React.useState(initialFilters);
    return (
        <DebugStateProvider debugState={{}}>
            <UserDataProvider userData={{}as any}>
            <ReactFiltersProvider reactFilters={plugins}>
                {children(filtersOps)}
            </ReactFiltersProvider>
            </UserDataProvider>
        </DebugStateProvider>
    );
};

describe('SimpleDisplayFilters', () => {
    it('renders filters with correct layout', () => {
        const Display = SimpleDisplayFilters('filters.display.purpose')
        render(
            <MockProviderWrapper>
                {filterOps => <Display filtersOps={filterOps} id="test-filters"/>}
            </MockProviderWrapper>
        );

        // Assert layout is rendered
        expect(screen.getByTestId('test-filters')).toBeInTheDocument();

        // Assert individual filters are rendered
        expect(screen.getByTestId('test-filters.time')).toHaveTextContent('Mock Filter');
    });
    it('skips filters without display in the current purpose', () => {
        const Display = SimpleDisplayFilters('filters.withoutlocation.purpose');
        render(
            <MockProviderWrapper>
                {(filterOps) => <Display filtersOps={filterOps} id="test-filters"/>}
            </MockProviderWrapper>
        );

        // Filter with no PurposeToDisplay should not render
        expect(screen.queryByTestId('test-filters.location')).not.toBeInTheDocument();
    });

    it('throws error if no layout exists for the purpose', () => {
        const faultyContext = {
            ...mockContextData,
            PurposeToFilterLayout: {},
        };
        const Display = SimpleDisplayFilters('filters.display.purpose');

        expect(() =>
            render(
                <MockProviderWrapper plugins={faultyContext}>{
                    filterOps => <Display filtersOps={filterOps} id="test-filters"/>
                }</MockProviderWrapper>
            )
        ).toThrow(/No FilterLayout for purpose 'filters.display.purpose'/);
    });

    it('renders errors inside the error boundary if filter fails', () => {
        const FailingFilterComponent = () => {
            throw new Error('Failed filter');
        };

        const errorPlugins: ReactFiltersPlugins<any> = {
            time: {
                plugin: 'filter',
                type: 'time',
                DefaultDisplay: FailingFilterComponent,
                PurposeToDisplay: {
                    'filters.display.purpose': FailingFilterComponent,
                },
            },
        };

        const errorContext: ReactFiltersContextData<any> = {
            plugins: errorPlugins,
            PurposeToFilterLayout: {
                'filters.display.purpose': MockFilterLayout,
            },
        };

        const Display = SimpleDisplayFilters('filters.display.purpose');
        render(
            <MockProviderWrapper plugins={errorContext}>
                {filterOps => <Display filtersOps={filterOps} id="test-filters"/>}
            </MockProviderWrapper>
        );

        expect(screen.getByText(/error.filter.time/i)).toBeInTheDocument();
    });
});
