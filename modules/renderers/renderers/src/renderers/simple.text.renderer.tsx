import React from "react";
import {idFrom, Render} from "../renderers";

export const SimpleTextRenderer: Render = ({attribute, rootId, value}) => {
    const isEmpty = !value || value.trim() === "";
    const id = idFrom(rootId, attribute);
    return (
        <span
            id={id}
            data-testid={id}
            aria-label={isEmpty ? "Not available" : undefined}
            aria-live="polite"
        >{isEmpty ? "" : value}</span>
    );
};
