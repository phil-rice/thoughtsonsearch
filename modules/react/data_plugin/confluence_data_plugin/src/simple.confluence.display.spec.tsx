import React from 'react';
import {render, screen} from '@testing-library/react';
import {ConfluenceData} from './confluence.data';
import {AllRenderersSimpleProvider} from "@enterprise_search/all_renderers";
import {SimpleConfluenceDisplay, SimpleConfluenceOneLineDisplay} from "./simple.confluence.display";
import '@testing-library/jest-dom';

jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);
// Mock Confluence Data
const mockConfluenceData: ConfluenceData = {
    title: 'Confluence Page 1',
    body: '<p>This is a <strong>test</strong> body</p>',
    space: 'Engineering',
    last_updated: '2024-01-01T12:00:00Z',
    url: 'https://example.com/confluence/page1',
    type: 'Page',
};


function ConfluenceTestProvider({children}: { children: React.ReactNode }) {
    return (
        <AllRenderersSimpleProvider>
            {children}
        </AllRenderersSimpleProvider>
    );
}

describe('SimpleConfluenceDisplay', () => {
    it('renders confluence page data correctly', () => {
        render(
            <AllRenderersSimpleProvider>
                <SimpleConfluenceDisplay id="confluence-1" data={mockConfluenceData}/>
            </AllRenderersSimpleProvider>
        );

        expect(screen.getByText('Confluence Page 1')).toBeInTheDocument();
        expect(screen.getByText('Engineering')).toBeInTheDocument();
        expect(screen.getByText(/2024/i)).toBeInTheDocument();
        const urlElement = screen.getByRole('link', {name: /confluence/i});
        expect(urlElement).toHaveAttribute('href', 'https://example.com/confluence/page1');
    });

});
describe('SimpleConfluenceOneLineDisplay', () => {
    it('renders confluence data in one line format', () => {
        render(
            <SimpleConfluenceOneLineDisplay id='someId' data={mockConfluenceData}/>
        );

        expect(screen.getByText('Page Confluence Page 1')).toBeInTheDocument();
    });

});

