import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {atom, RecoilRoot} from 'recoil';

import {EditStringInput} from './edit.string';
import "@testing-library/jest-dom";
import {TranslationProvider} from "@enterprise_search/translation";

// Define test atom
type TestState = {
    firstName: string | undefined;
    lastName: string | undefined;
};

const testAtom = atom<TestState>({
    key: 'testAtom',
    default: {
        firstName: '',
        lastName: '',
    },
});

describe('StringValue Component', () => {
    it('renders with a translated label', () => {
        const customTranslationFn = (key: string) => `Translated: ${key}`;

        render(
            <RecoilRoot>
                <TranslationProvider value={customTranslationFn}>
                    <EditStringInput rootId="test" atom={testAtom} atomKey="firstName"/>
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(screen.getByLabelText('Translated: test.firstName')).toBeInTheDocument();
    });

    it('updates the atom value on input change', () => {
        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringInput rootId="test" atom={testAtom} atomKey="firstName"/>
                </TranslationProvider>
            </RecoilRoot>
        );

        const input = screen.getByLabelText('test.firstName') as HTMLInputElement;
        fireEvent.change(input, {target: {value: 'John'}});
        expect(input.value).toBe('John');
    });

    it('logs debug information during development', () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringInput rootId="test" atom={testAtom} atomKey="firstName"/>
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(consoleSpy).toHaveBeenCalledWith('rerendering attribute value', 'test.firstName', 'test.firstName');
        consoleSpy.mockRestore();
    });

    it('does not log debug information in production', () => {
        process.env.NODE_ENV = 'production';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringInput rootId="test" atom={testAtom} atomKey="firstName"/>
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('handles undefined values gracefully', () => {
        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringInput rootId="test" atom={testAtom} atomKey="firstName"/>
                </TranslationProvider>
            </RecoilRoot>
        );

        const input = screen.getByLabelText('test.firstName') as HTMLInputElement;
        expect(input.value).toBe('');
    });
});
