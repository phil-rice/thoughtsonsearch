import React from "react";
import { Render } from "../renderers";

function formatJson(value: string): string {
    try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        return `invalid json: ${value}`;
    }
}

export const SimpleJsonRenderer: Render = ({ id, value }) => {
    const formattedValue = formatJson(value);
    return <span id={`${id}-value`}>{formattedValue}</span>;
};
