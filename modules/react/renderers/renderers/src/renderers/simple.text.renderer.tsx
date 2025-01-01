import React from "react";
import { Render } from "../renderers";

export const SimpleTextRenderer: Render = ({ id, value }) => {
    const isEmpty = !value || value.trim() === "";

    const thisId = `${id}-value`;
    return (
        <span
            id={thisId}
            data-testid={thisId}
            aria-label={isEmpty ? "Not available" : undefined}
            aria-live="polite"
        >{isEmpty ? "" : value}</span>
    );
};
