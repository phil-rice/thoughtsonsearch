import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import React, { useState } from "react";

import { TranslationProvider } from "@enterprise_search/translation";
import '@testing-library/jest-dom';
import {DefaultNavItemStyles, SimpleNavItem} from "./simple.navbar.item";

// Test wrapper component to manage selection state
const TestNavBar = () => {
    const [selected, setSelected] = useState<string>("home");
    const NavItem = SimpleNavItem('test',DefaultNavItemStyles);

    return (
        <TranslationProvider value={(key) => `${key}-trans`}>
            <div>
                <NavItem value="home" selectedOps={[selected, setSelected]} />
                <NavItem value="profile" selectedOps={[selected, setSelected]} />
                <NavItem value="settings" selectedOps={[selected, setSelected]} />
            </div>
        </TranslationProvider>
    );
};

describe("SimpleNavItem with TranslationProvider", () => {
    it("renders nav items with translation", () => {
        render(<TestNavBar />);

        expect(screen.getByText("test.home-trans")).toBeInTheDocument();
        expect(screen.getByText("test.profile-trans")).toBeInTheDocument();
        expect(screen.getByText("test.settings-trans")).toBeInTheDocument();
    });

    it("applies selected style to the selected nav item", () => {
        render(<TestNavBar />);

        const homeButton = screen.getByText("test.home-trans");
        const profileButton = screen.getByText("test.profile-trans");

        expect(homeButton).toHaveStyle(DefaultNavItemStyles.selectedStyle as any);
        expect(profileButton).toHaveStyle(DefaultNavItemStyles.unselectedStyle as any);
    });

    it("changes selection on click", async () => {
        render(<TestNavBar />);

        const homeButton = screen.getByText("test.home-trans");
        const profileButton = screen.getByText("test.profile-trans");


        // Initially, home is selected (background is blue)
        expect(homeButton).toHaveStyle('background-color: rgb(0, 86, 179)');
        expect(profileButton).toHaveStyle('background-color: rgb(255, 255, 255)');

        // Click profile
        fireEvent.click(profileButton);

        // Use waitFor to wait for the DOM to update
        await waitFor(() => {
            const updatedProfileButton = screen.getByText("test.profile-trans");
            const updatedHomeButton = screen.getByText("test.home-trans");
            expect(updatedProfileButton).toHaveStyle('background-color: rgb(0, 86, 179)');
            expect(updatedHomeButton).toHaveStyle('background-color: rgb(255, 255, 255)');
        });
    });
});
