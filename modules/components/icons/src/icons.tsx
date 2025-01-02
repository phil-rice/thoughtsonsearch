import React from "react";
import {Errors} from "@enterprise_search/errors";
import {makeContextFor} from "@enterprise_search/react_utils";
import {useTranslation} from "@enterprise_search/translation";

// Types for decorative and meaningful icons
export type DecorativeIconFn = (name: string) => Icon;
export type MeaningfulIconFn = (name: string, purpose: string) => Icon;
export type Icon = () => React.ReactElement;

// Icon context type to manage both types of icons
export type IconContextData = {
    DecorativeIcon: DecorativeIconFn;
    MeaningfulIcon: MeaningfulIconFn;
};

// Accessible descriptions for meaningful icons

// Decorative icons (non-interactive)
export const decorativeIconFn: DecorativeIconFn = (name: string): Icon =>
    () => (
        <img
            src={`icons/${name}.svg`}
            alt=""
            role="presentation"
        />
    );

// Meaningful icons (interactive or informative)
export const meaningfulIconFn: MeaningfulIconFn = (name: string, purpose: string): Icon =>
    () => {
        const translation = useTranslation()
        return (
            <img
                src={`icons/${name}.svg`}
                alt={translation(purpose)}
            />
        );
    };

// Error handling for missing icons
export const simpleRecover = (e: Errors): Icon => {
    throw new Error(`Icon not found:\n${e.errors.join("\n")}`);
};

// Default context values for icons
export const simpleIconContext: IconContextData = {
    DecorativeIcon: decorativeIconFn,
    MeaningfulIcon: meaningfulIconFn,
};

// Context provider and hook for icons
export const {Provider: IconProvider, use: useIcon} = makeContextFor('icons', simpleIconContext);
