import React from "react";
import { Render } from "../renderers";

export const SimpleTextRenderer: Render = ({ id, value }) => {
    const isEmpty = !value || value.trim() === "";

    return (
        <span
            id={`${id}-value`}
            aria-label={isEmpty ? "Not available" : undefined}
            aria-live="polite"
        >
            {isEmpty ? "" : value}
        </span>
    );
};
