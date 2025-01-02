import React from "react";
import {render, screen} from "@testing-library/react";
import {JiraData} from "./jira.data";
import {ClipHeight} from "@enterprise_search/react_utils";
import {AllRenderersSimpleProvider} from "@enterprise_search/all_renderers";
import {SimpleJiraDisplay, SimpleOneLineJiraDisplay} from "./simple.jira.display";
import '@testing-library/jest-dom';
// Mock data
const mockJiraData: JiraData = {
    issue: "JIRA-123",
    summary: "Fix critical bug",
    description: "Detailed description of the bug...",
    status: "In Progress",
    last_updated: "2024-01-01:00:00:00",
    url: "https://jira.example.com/browse/JIRA-123",
    type: "Bug",
};

jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);

function JiraTestProvider({children}: { children: React.ReactNode }) {
    return (
        <AllRenderersSimpleProvider>
            {children}
        </AllRenderersSimpleProvider>
    );
}


describe("SimpleJiraDisplay", () => {
    it("renders Jira issue, summary, and status correctly", () => {
        render(<JiraTestProvider><SimpleJiraDisplay id="jira1" data={mockJiraData}/></JiraTestProvider>);

        // Verify key rendered elements
        expect(screen.getByTestId("jira1-data.summary").textContent).toEqual("JIRA-123: Fix critical bug")
        expect(screen.getByTestId("jira1-data.status").textContent).toEqual("In Progress")
        expect(screen.getByTestId("jira1-data.description").textContent).toEqual("Detailed description of the bug...")
        expect(screen.getByTestId("jira1-data.lastUpdated").textContent).toEqual("01/Jan/2024")

        const link = screen.getByTestId("jira1-data.url") as HTMLAnchorElement;
        expect(link).toHaveAttribute("href", mockJiraData.url);
    });

});

describe("SimpleOneLineJiraDisplay", () => {
    it("renders Jira type and summary in one line", () => {
        render(<SimpleOneLineJiraDisplay id='someid' data={mockJiraData}/>);
        expect(screen.getByText("Bug Fix critical bug")).toBeInTheDocument();
    });
});
