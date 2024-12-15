import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {atom, RecoilRoot} from 'recoil';
import '@testing-library/jest-dom';
import {EditStringDropdown} from "./edit.string.dropdown";
import {TranslationProvider} from "@enterprise_search/recoil_translation";

// Define test atom
type TestState = {
    country: string | undefined;
};

const testAtom = atom<TestState>({
    key: 'testAtom',
    default: {
        country: '',
    },
});

describe('DropdownValue Component', () => {
    it('renders with translated label', () => {
        const customTranslationFn = (key: string) => `Translated: ${key}`;

        render(
            <RecoilRoot>
                <TranslationProvider value={customTranslationFn}>
                    <EditStringDropdown
                        rootId="user"
                        atom={testAtom}
                        atomKey="country"
                        options={['USA', 'Canada', 'Mexico']}
                    />
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(screen.getByLabelText('Translated: user.country')).toBeInTheDocument();
    });

    it('renders all options with translations', () => {
        const customTranslationFn = (key: string) => `Translated: ${key}`;

        render(
            <RecoilRoot>
                <TranslationProvider value={customTranslationFn}>
                    <EditStringDropdown
                        rootId="user"
                        atom={testAtom}
                        atomKey="country"
                        options={['USA', 'Canada', 'Mexico']}
                    />
                </TranslationProvider>
            </RecoilRoot>
        );

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('Translated: user.country.USA');
        expect(options[1]).toHaveTextContent('Translated: user.country.Canada');
        expect(options[2]).toHaveTextContent('Translated: user.country.Mexico');
    });

    it('updates the atom value on selection', () => {
        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringDropdown
                        rootId="user"
                        atom={testAtom}
                        atomKey="country"
                        options={['USA', 'Canada', 'Mexico']}
                    />
                </TranslationProvider>
            </RecoilRoot>
        );

        const select = screen.getByLabelText('user.country') as HTMLSelectElement;
        fireEvent.change(select, {target: {value: 'Canada'}});
        expect(select.value).toBe('Canada');
    });

    it('logs debug information during development', () => {
        process.env.NODE_ENV = 'development';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringDropdown
                        rootId="user"
                        atom={testAtom}
                        atomKey="country"
                        options={['USA', 'Canada', 'Mexico']}
                    />
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(consoleSpy).toHaveBeenCalledWith('rerendering dropdown', 'user.country', 'user.country');
        consoleSpy.mockRestore();
    });

    it('does not log debug information in production', () => {
        process.env.NODE_ENV = 'production';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(
            <RecoilRoot>
                <TranslationProvider value={(key) => key}>
                    <EditStringDropdown
                        rootId="user"
                        atom={testAtom}
                        atomKey="country"
                        options={['USA', 'Canada', 'Mexico']}
                    />
                </TranslationProvider>
            </RecoilRoot>
        );

        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
