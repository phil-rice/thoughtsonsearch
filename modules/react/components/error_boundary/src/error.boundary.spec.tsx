// ErrorBoundary.test.tsx

import React, {ReactNode} from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

import {ErrorReporter, ErrorReporterProvider} from "@enterprise_search/react_utils";
import {UserData,} from "@enterprise_search/authentication";
import {TranslationContext, TranslationFn} from "@enterprise_search/translation";

import {ErrorBoundary, makeErrorBoundary, SimpleErrorBoundary} from "./error.boundary";
import {ErrorBoundaryStyles} from "./defaultErrorBoundaryStyles";
import {UserDataProvider} from "@enterprise_search/react_login_component"

// 1. Problematic Component that throws an error
const ProblemChild: () => ReactNode = () => {
    throw new Error('Test error');
};

// 2. Mock UserDataAccessor
const MockUserDataAccessor = ({
                                  children,
                                  isDev,
                              }: {
    children: ReactNode;
    isDev: boolean;
}) => {
    const mockUserData: UserData = {
        email: isDev ? 'me@example.com' : 'user@example.com',
        isDev: isDev,
        isAdmin: false,
        loggedIn: true,
    };
    return <UserDataProvider userData={mockUserData}>{children}</UserDataProvider>;
};

// 3. Simple translation function
const mockTranslation: TranslationFn = (key: string) => `${key}_translated`;

// 4. Helper functions for ErrorReporter
const successfulErrorReporter: ErrorReporter = (errors: any) => {
    return Promise.resolve({errors, reference: 'ABC123'});
};

const failedErrorReporter: ErrorReporter = (errors: any) => {
    return Promise.reject(new Error('Reporting failed'));
};

const neverResolvingErrorReporter: ErrorReporter = (errors: any) => {
    return new Promise(() => {}); // Promise that never resolves
};

// 5. Define the userData for developer users
const devUserData: UserData = {
    email: 'me@example.com',
    isDev: true,
    isAdmin: false,
    loggedIn: true,
};

// 6. Define the userData for non-developer users
const nonDevUserData: UserData = {
    email: 'user@example.com',
    isDev: false,
    isAdmin: false,
    loggedIn: true,
};

// 7. Suppress console.error during tests to prevent Jest from failing on intentional errors
beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('ErrorBoundary', () => {
    /**
     * Test Case 1: Successful Error Reporting
     * - Ensures that when an error occurs, the ErrorReporter is called successfully.
     * - A reference number is displayed.
     * - Developer-specific error details are visible.
     */
    it('catches errors and displays reference number on successful reporting', async () => {
        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <MockUserDataAccessor isDev={true}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Check for the reference number's label
        const referenceLabel = screen.getByText('errors.reference.message_translated:');
        expect(referenceLabel).toBeInTheDocument();

        // Check for the reference number value
        const referenceNumber = screen.getByText('ABC123');
        expect(referenceNumber).toBeInTheDocument();

        // Check for the developer details summary
        const detailsSummary = screen.getByText('View Details');
        expect(detailsSummary).toBeInTheDocument();

        // Expand the details to view error extras
        fireEvent.click(detailsSummary);
        expect(screen.getByText(/Test error/)).toBeInTheDocument();
        expect(screen.getByText(/extras/)).toBeInTheDocument(); // Assuming 'extras' is part of the error details
    });

    /**
     * Test Case 2: Failed Error Reporting
     * - Ensures that when the ErrorReporter fails, the failure message is displayed.
     * - No reference number or developer details should be visible.
     */
    it('displays failure message when error reporting fails', async () => {
        render(
            <ErrorReporterProvider errorReporter={failedErrorReporter}>
                <MockUserDataAccessor isDev={false}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Wait for the failure message to appear
        expect(await screen.findByText('errors.reference.failure_translated')).toBeInTheDocument();

        // Ensure that reference number and developer details are not present
        expect(screen.queryByText('errors.reference.message_translated:')).not.toBeInTheDocument();
        expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.viewDetails_translated')).not.toBeInTheDocument();
    });

    /**
     * Test Case 3: Error Reporting Pending (Never Resolving)
     * - Ensures that when the ErrorReporter promise never resolves, the loading message is displayed.
     * - No reference number or failure message should be visible.
     */
    it('displays loading message when error reporting is pending', async () => {
        render(
            <ErrorReporterProvider errorReporter={neverResolvingErrorReporter}>
                <MockUserDataAccessor isDev={false}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Check for the loading message
        expect(screen.getByText('errors.reference.loading_translated')).toBeInTheDocument();

        // Ensure that reference number and failure message are not present
        expect(screen.queryByText('errors.reference.message_translated:')).not.toBeInTheDocument();
        expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.reference.failure_translated')).not.toBeInTheDocument();
    });

    /**
     * Test Case 4: Non-Developer Users
     * - Ensures that non-developer users do not see detailed error information.
     * - Reference number is displayed upon successful error reporting.
     */
    it('does not display detailed error information for non-developer users', async () => {
        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <MockUserDataAccessor isDev={false}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Check for the reference number's label
        const referenceLabel = screen.getByText('errors.reference.message_translated:');
        expect(referenceLabel).toBeInTheDocument();

        // Check for the reference number value
        const referenceNumber = screen.getByText('ABC123');
        expect(referenceNumber).toBeInTheDocument();

        // Ensure that developer details are not present
        expect(screen.queryByText('errors.viewDetails_translated')).not.toBeInTheDocument();
    });

    /**
     * Test Case 5: Custom Fallback UI
     * - Ensures that when a custom fallback UI is provided, it is rendered instead of the default error messages.
     */
    it('renders custom fallback UI when provided', async () => {
        const customFallback = <div data-testid="custom-fallback">Custom Fallback UI</div>;

        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <UserDataProvider userData={nonDevUserData}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary
                            message="errors.mainErrorMessage"
                            fallback={customFallback}
                        >
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </UserDataProvider>
            </ErrorReporterProvider>
        );

        // Wait for the custom fallback to appear
        expect(await screen.findByTestId('custom-fallback')).toBeInTheDocument();

        // Ensure that default error messages are not present
        expect(screen.queryByText('errors.mainErrorMessage_translated')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.reference.message_translated:')).not.toBeInTheDocument();
        expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
    });

    /**
     * Test Case 6: Custom Styling
     * - Ensures that custom styles injected via makeErrorBoundary are applied correctly.
     */
    it('applies custom styles when provided via makeErrorBoundary', async () => {
        // Define custom styles
        const customStyles: ErrorBoundaryStyles = {
            containerStyle: {
                border: '2px dashed blue',
                padding: '20px',
                backgroundColor: '#e0f7fa',
            },
            strongStyle: {
                color: 'blue',
            },
            referenceStyle: {
                marginTop: '20px',
            },
            reportingFailedStyle: {
                marginTop: '20px',
            },
            detailsStyle: {
                whiteSpace: 'pre-wrap',
                marginTop: '20px',
            },
        };

        // Create a custom ErrorBoundary with custom styles
        const CustomErrorBoundary: ErrorBoundary = makeErrorBoundary(customStyles);

        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <MockUserDataAccessor isDev={true}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <CustomErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </CustomErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Check for the reference number's label
        const referenceLabel = screen.getByText('errors.reference.message_translated:');
        expect(referenceLabel).toBeInTheDocument();

        // Check for the reference number value
        const referenceNumber = screen.getByText('ABC123');
        expect(referenceNumber).toBeInTheDocument();

        // Check for custom styles on the container
        const container = referenceNumber.closest('div[role="alert"]');
        expect(container).toHaveStyle('border: 2px dashed blue');
        expect(container).toHaveStyle('background-color: #e0f7fa');

        // Check for custom strong style
        const strongElement = screen.getByText('Error:');
        expect(strongElement).toHaveStyle('color: blue');
    });

    /**
     * Test Case 7: Accessibility Compliance
     * - Ensures that the ErrorBoundary renders with correct ARIA attributes for accessibility.
     */
    it('has correct ARIA attributes for accessibility', async () => {
        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <MockUserDataAccessor isDev={true}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the error message to appear
        const alertDiv = await screen.findByRole('alert');
        expect(alertDiv).toHaveAttribute('aria-live', 'assertive');
    });
    /**
     * Test Case 8: Display Stack Trace in Dev Mode
     * - Ensures that the "Stack" option is available in dev mode.
     * - Clicking the "Stack" option reveals the componentStack.
     */
    it('allows developer to view component stack when "Stack" is clicked', async () => {
        render(
            <ErrorReporterProvider errorReporter={successfulErrorReporter}>
                <MockUserDataAccessor isDev={true}>
                    <TranslationContext.Provider value={mockTranslation}>
                        <SimpleErrorBoundary message="errors.mainErrorMessage">
                            <ProblemChild/>
                        </SimpleErrorBoundary>
                    </TranslationContext.Provider>
                </MockUserDataAccessor>
            </ErrorReporterProvider>
        );

        // Wait for the main error message to appear
        expect(await screen.findByText('errors.mainErrorMessage_translated')).toBeInTheDocument();

        // Check for the "Show Stack" button
        const stackButton = screen.getByText('Show Stack');
        expect(stackButton).toBeInTheDocument();

        // Click the "Show Stack" button
        fireEvent.click(stackButton);

        // Check that the stack trace is displayed
        expect(screen.getByText(/componentStack/)).toBeInTheDocument(); // Adjust the regex based on your componentStack content

        // Optionally, click again to hide the stack
        fireEvent.click(stackButton);
        expect(screen.queryByText(/componentStack/)).not.toBeInTheDocument();
    });

});
