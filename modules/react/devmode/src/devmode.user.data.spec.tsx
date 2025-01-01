import React from "react";
import {render, screen} from "@testing-library/react";
import {UserDataProvider} from "@enterprise_search/react_login_component";
import {DevModeUserData} from "./devMode.user.data";
import '@testing-library/jest-dom';
import {UserData} from "@enterprise_search/authentication";

// Mock user data
const mockUserData = {
    email: "test@example.com",
    isDev: true,
    isAdmin: false,
    loggedIn: true
};

// Utility to render the component with a UserDataProvider
const renderWithUserData = (userData: any) =>
    render(
        <UserDataProvider userData={userData}>
            <DevModeUserData/>
        </UserDataProvider>
    );

describe("DevModeUserData Component", () => {
    it("renders user data correctly", () => {
        const { container } = renderWithUserData(mockUserData);

        // Get the entire rendered text content
        const renderedText = container.textContent;

        expect(renderedText).not.toBeNull();
        expect(renderedText).toEqual(JSON.stringify(mockUserData, null, 2));
    });

    it("renders empty object when no user data is provided", () => {
        renderWithUserData({});

        const emptyData = JSON.stringify({}, null, 2);
        expect(screen.getByText(emptyData)).toBeInTheDocument();
    });

});
