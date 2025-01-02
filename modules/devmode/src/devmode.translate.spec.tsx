import React from 'react';
import {render, screen} from '@testing-library/react';
import {TranslationUsedAndNotFoundProvider} from '@enterprise_search/translation';
import {act} from 'react-dom/test-utils';
import {allRenderers} from "@enterprise_search/all_renderers";
import {DevModeTranslate} from "./devmode.translate";
import '@testing-library/jest-dom';
import {AttributeValueProvider, SimpleAttributeValueLayout, SimpleDataLayout} from "@enterprise_search/renderers";

//needed to allow jest to mock react-markdown otherwise it will throw an error
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);

// Create a wrapper provider that includes both the translation and renderer context
function TestProvider({children, initialState}: { children: React.ReactNode; initialState: any }) {
    return (
        <AttributeValueProvider renderers={allRenderers} AttributeValueLayout={SimpleAttributeValueLayout} DataLayout={SimpleDataLayout}>
            <TranslationUsedAndNotFoundProvider usedAndNotFound={initialState}>
                {children}
            </TranslationUsedAndNotFoundProvider>
        </AttributeValueProvider>
    );
}

describe('DevModeTranslate Component', () => {
    const initialState = {
        used: new Set(['key1', 'key2']),
        notFound: new Set(['missingKey']),
        errors: new Set(['errorKey']),
    };

    test('renders JSON values for used, notFound, and errors when provider is available', async () => {
        await act(async () => {
            render(
                <TestProvider initialState={initialState}>
                    <DevModeTranslate/>
                </TestProvider>
            );
        });

        // Verify 'used' translations are rendered
        const usedElement = screen.getByTestId('dev-mode-translate-devmode.Translate.used');
        expect(usedElement).toHaveTextContent('[ "key1", "key2" ]');

        // Verify 'notFound' translations are rendered
        const notFoundElement = screen.getByTestId('dev-mode-translate-devmode.Translate.notFound');
        expect(notFoundElement).toHaveTextContent('[ "missingKey" ]');

        // Verify 'errors' translations are rendered
        const errorsElement = screen.getByTestId('dev-mode-translate-devmode.Translate.errors');
        expect(errorsElement).toHaveTextContent('[ "errorKey" ]');
    });

    test('renders fallback message when provider is missing', () => {
        render(<AttributeValueProvider renderers={allRenderers} AttributeValueLayout={SimpleAttributeValueLayout} DataLayout={SimpleDataLayout}><DevModeTranslate/></AttributeValueProvider>);

        const fallbackMessage = screen.getByText(/The TranslationUsedAndNotFoundProvider is not in used/i);
        expect(fallbackMessage).toBeInTheDocument();
    });

    test('renders empty sets correctly', async () => {
        const emptyState = {
            used: new Set(),
            notFound: new Set(),
            errors: new Set(),
        };

        await act(async () => {
            render(
                <TestProvider initialState={emptyState}>
                    <DevModeTranslate/>
                </TestProvider>
            );
        });

        const usedElement = screen.getByTestId('dev-mode-translate-devmode.Translate.used');
        expect(usedElement).toHaveTextContent(JSON.stringify([], null, 2));

        const notFoundElement = screen.getByTestId('dev-mode-translate-devmode.Translate.notFound');
        expect(notFoundElement).toHaveTextContent(JSON.stringify([], null, 2));

        const errorsElement = screen.getByTestId('dev-mode-translate-devmode.Translate.errors');
        expect(errorsElement).toHaveTextContent(JSON.stringify([], null, 2));
    });
});
