import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { FeatureFlagsProvider } from "@enterprise_search/react_utils";
import {WindowUrlContext} from "@enterprise_search/routing";
import {DevModeFeatureFlags} from "./devmode.feature.flags";
import '@testing-library/jest-dom';

describe("DevModeFeatureFlags Component", () => {
    const initialFeatureFlags = {
        darkMode: { value: true, description: "Enable dark mode" },
        betaFeatures: { value: false, description: "Enable beta features" },
        logging: { value: true, description: "Enable verbose logging" },
    };

    const renderWithProviders = (ui: React.ReactNode, url: URL = new URL("https://example.com/")) => {
        return render(
            <WindowUrlContext.Provider value={ [{ url, parts: ["ignored"] }, () => {}] }>
                <FeatureFlagsProvider featureFlags={initialFeatureFlags}>
                    {ui}
                </FeatureFlagsProvider>
            </WindowUrlContext.Provider>
        );
    };

    it("renders feature flags with correct initial state", () => {
        renderWithProviders(<DevModeFeatureFlags />);

        expect(screen.getByLabelText("darkMode: Enable dark mode")).toBeChecked();
        expect(screen.getByLabelText("betaFeatures: Enable beta features")).not.toBeChecked();
        expect(screen.getByLabelText("logging: Enable verbose logging")).toBeChecked();
    });

    it("updates feature flags when toggled", () => {
        renderWithProviders(<DevModeFeatureFlags />);

        const betaCheckbox = screen.getByLabelText("betaFeatures: Enable beta features");
        expect(betaCheckbox).not.toBeChecked();

        fireEvent.click(betaCheckbox);

        expect(betaCheckbox).toBeChecked();
    });

    it("resets feature flags on Reset button click", () => {
        renderWithProviders(<DevModeFeatureFlags />);

        const betaCheckbox = screen.getByLabelText("betaFeatures: Enable beta features");
        fireEvent.click(betaCheckbox); // Enable beta features
        expect(betaCheckbox).toBeChecked();

        fireEvent.click(screen.getByText("Reset"));

        expect(betaCheckbox).not.toBeChecked();
    });

    it("clears all feature flags on Clear button click", () => {
        renderWithProviders(<DevModeFeatureFlags />);

        fireEvent.click(screen.getByText("Clear"));

        expect(screen.getByLabelText("darkMode: Enable dark mode")).not.toBeChecked();
        expect(screen.getByLabelText("betaFeatures: Enable beta features")).not.toBeChecked();
        expect(screen.getByLabelText("logging: Enable verbose logging")).not.toBeChecked();
    });

    it("updates feature flags from URL on 'From Url' button click", () => {
        const testUrl = new URL("https://example.com/?betaFeatures=true&darkMode=false");

        renderWithProviders(<DevModeFeatureFlags />, testUrl);
        expect(screen.getByLabelText("betaFeatures: Enable beta features")).toBeChecked();

        fireEvent.click(screen.getByText("Clear"));
        expect(screen.getByLabelText("betaFeatures: Enable beta features")).not.toBeChecked();

        // Click 'From Url' button
        fireEvent.click(screen.getByText("From Url"));

        // BetaFeatures should now be enabled (from URL)
        expect(screen.getByLabelText("betaFeatures: Enable beta features")).toBeChecked();

        // DarkMode should be disabled (from URL)
        expect(screen.getByLabelText("darkMode: Enable dark mode")).not.toBeChecked();
    });
});
