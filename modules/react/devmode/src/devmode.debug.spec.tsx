import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DebugStateProvider } from "@enterprise_search/react_utils";

import '@testing-library/jest-dom';
import {DevModeDebug} from "./devmode.debug";
describe("DevModeDebug Component", () => {
    it("renders checkboxes for each debug state", () => {
        const initialState = {
            search: true,
            state: false,
            login: true,
        };

        render(
            <DebugStateProvider debugState={initialState}>
                <DevModeDebug />
            </DebugStateProvider>
        );

        // Check for all debug keys and their initial states
        expect(screen.getByLabelText("search")).toBeChecked();
        expect(screen.getByLabelText("state")).not.toBeChecked();
        expect(screen.getByLabelText("login")).toBeChecked();
    });

    it("updates debug state when checkboxes are toggled", () => {
        const initialState = {
            search: false,
            state: true,
            login: false,
        };

        render(
            <DebugStateProvider debugState={initialState}>
                <DevModeDebug />
            </DebugStateProvider>
        );

        const searchCheckbox = screen.getByLabelText("search");
        const stateCheckbox = screen.getByLabelText("state");
        const loginCheckbox = screen.getByLabelText("login");

        // Toggle checkboxes
        fireEvent.click(searchCheckbox);
        fireEvent.click(stateCheckbox);
        fireEvent.click(loginCheckbox);

        expect(searchCheckbox).toBeChecked();
        expect(stateCheckbox).not.toBeChecked();
        expect(loginCheckbox).toBeChecked();
    });

    it("displays raw debug state in the preformatted section", () => {
        const initialState = {
            search: true,
            state: true,
            login: false,
        };

        render(
            <DebugStateProvider debugState={initialState}>
                <DevModeDebug />
            </DebugStateProvider>
        );

        const rawDebugOutput = screen.getByText(/"search": true/);
        expect(rawDebugOutput).toBeInTheDocument();
        expect(screen.getByText(/"state": true/)).toBeInTheDocument();
        expect(screen.getByText(/"login": false/)).toBeInTheDocument();
    });
});
