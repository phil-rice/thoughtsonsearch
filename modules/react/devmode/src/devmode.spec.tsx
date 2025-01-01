import React from "react";
import {screen, fireEvent, render} from "@testing-library/react";
import {DevMode} from "./devmode";
import {DevModeFixture} from "./devmode.fixture";
import '@testing-library/jest-dom';

// Utility to render DevMode with fixture and selected item
const renderDevModeWithSelection = (url: string, selected: string) => {
    return render(
        <DevModeFixture url={url} selected={selected}>
            <DevMode/>
        </DevModeFixture>
    );
};

describe("DevMode Component (with initial selection)", () => {
    it("renders DevMode and selects correct initial component", () => {
        renderDevModeWithSelection("http://localhost?devMode=true", "name1");

        // Verifies that 'name1' component is initially selected
        expect(screen.getByText("Dev Mode 1 Component")).toBeInTheDocument();
    });

    it("renders navbar but no component if selected item doesn't match", () => {
        renderDevModeWithSelection("http://localhost?devMode=true", "invalidSelection");

        // Navbar should still be present
        expect(screen.getByText("Name 1")).toBeInTheDocument();
        expect(screen.getByText("Name 2")).toBeInTheDocument();

        // No component should render if 'invalidSelection' is not a valid key
        expect(screen.queryByText("Dev Mode 1 Component")).not.toBeInTheDocument();
        expect(screen.queryByText("Dev Mode 2 Component")).not.toBeInTheDocument();
    });

    it("renders correct component when switching navbar items", () => {
        renderDevModeWithSelection("http://localhost?devMode=true", "name1");

        expect(screen.getByText("Dev Mode 1 Component")).toBeInTheDocument();

        // Click to switch to second component
        fireEvent.click(screen.getByText("Name 2"));
        expect(screen.getByText("Dev Mode 2 Component")).toBeInTheDocument();
        expect(screen.queryByText("Dev Mode 1 Component")).not.toBeInTheDocument();
    });

    it("does not render DevMode if 'devMode' is not in URL", () => {
        renderDevModeWithSelection("http://localhost", "name1");

        // DevMode should not render at all if URL lacks devMode param
        expect(screen.queryByText("Name 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Dev Mode 1 Component")).not.toBeInTheDocument();
    });

    it("does not render if user is not dev or admin", () => {

        render(
            <DevModeFixture
                url="http://localhost?devMode=true"
                userData={{
                    email: "user@example.com",
                    isDev: false,
                    isAdmin: false,
                    loggedIn: true
                }}
                selected="name1"
            >
                <DevMode/>
            </DevModeFixture>
        );

        expect(screen.queryByText("name1")).not.toBeInTheDocument();
        expect(screen.queryByText("Dev Mode 1 Component")).not.toBeInTheDocument();
    });

    it("renders DevMode navbar but no component if nothing is selected", () => {
        renderDevModeWithSelection("http://localhost?devMode=true", "");

        // Navbar is present
        expect(screen.getByText("Name 1")).toBeInTheDocument();
        expect(screen.getByText("Name 2")).toBeInTheDocument();

        // No component should render
        expect(screen.queryByText("Dev Mode 1 Component")).not.toBeInTheDocument();
        expect(screen.queryByText("Dev Mode 2 Component")).not.toBeInTheDocument();
    });
});
