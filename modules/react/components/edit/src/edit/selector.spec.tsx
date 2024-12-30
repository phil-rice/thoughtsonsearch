import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecoilRoot, atom, useRecoilValue, useSetRecoilState } from 'recoil';
import {keySelector} from "./selector";

type TestAtomState = {
    firstName: string;
    lastName: string;
};

// Create a test atom
const testAtom = atom<TestAtomState>({
    key: 'testAtom',
    default: {
        firstName: 'John',
        lastName: 'Doe',
    },
});

// Test component for reading a key
const ReadTestComponent = ({ keyName }: { keyName: keyof TestAtomState }) => {
    const value = useRecoilValue(keySelector({ atom: testAtom, key: keyName }));
    return <div data-testid={`value-${keyName}`}>{value}</div>;
};

// Test component for writing to a key
const WriteTestComponent = ({ keyName }: { keyName: keyof TestAtomState }) => {
    const setValue = useSetRecoilState(keySelector({ atom: testAtom, key: keyName }));
    return (
        <button data-testid={`update-${keyName}`} onClick={() => setValue('Updated')}>
            Update {keyName}
        </button>
    );
};


describe('keySelector', () => {
    it('reads the correct value for a given key', () => {
        render(
            <RecoilRoot>
                <ReadTestComponent keyName="firstName" />
            </RecoilRoot>
        );

        const value = screen.getByTestId('value-firstName');
        expect(value.textContent).toBe('John');
    });

    it('updates the correct value for a given key', () => {
        render(
            <RecoilRoot>
                <ReadTestComponent keyName="firstName" />
                <WriteTestComponent keyName="firstName" />
            </RecoilRoot>
        );

        const valueBefore = screen.getByTestId('value-firstName');
        expect(valueBefore.textContent).toBe('John');

        const updateButton = screen.getByTestId('update-firstName');
        fireEvent.click(updateButton);

        const valueAfter = screen.getByTestId('value-firstName');
        expect(valueAfter.textContent).toBe('Updated');
    });

    it('does not affect other keys when updating one key', () => {
        render(
            <RecoilRoot>
                <ReadTestComponent keyName="firstName" />
                <ReadTestComponent keyName="lastName" />
                <WriteTestComponent keyName="firstName" />
            </RecoilRoot>
        );

        const firstNameBefore = screen.getByTestId('value-firstName');
        const lastNameBefore = screen.getByTestId('value-lastName');

        expect(firstNameBefore.textContent).toBe('John');
        expect(lastNameBefore.textContent).toBe('Doe');

        const updateButton = screen.getByTestId('update-firstName');
        fireEvent.click(updateButton);

        const firstNameAfter = screen.getByTestId('value-firstName');
        const lastNameAfter = screen.getByTestId('value-lastName');

        expect(firstNameAfter.textContent).toBe('Updated');
        expect(lastNameAfter.textContent).toBe('Doe');
    });
});
