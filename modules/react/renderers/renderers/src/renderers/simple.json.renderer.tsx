import React from "react";
import { Render } from "../renderers";

function formatJson(value: string): string {
    try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed, null, 2);  // Pretty print
    } catch (e) {
        return `invalid json: ${value}`;
    }
}

export const SimpleJsonRenderer: Render = ({ id, value }) => {
    const formattedValue = formatJson(value);
    const isError = formattedValue.startsWith("invalid json");

    return (
        <pre
            id={`${id}-value`}
            aria-label={isError ? "Invalid JSON data" : "Formatted JSON"}
            aria-live={isError ? "polite" : undefined} // Announce errors dynamically
            role="code"
            style={{
                whiteSpace: 'pre-wrap', // Preserve formatting
                backgroundColor: isError ? '#ffe6e6' : '#f5f5f5',
                color: isError ? '#d32f2f' : '#000',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
            }}
        >
            {formattedValue}
        </pre>
    );
};
