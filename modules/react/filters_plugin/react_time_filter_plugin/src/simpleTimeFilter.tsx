// Define a type for CSS styles
import React from "react";
import {DisplayFilterProps} from "@enterprise_search/react_filters_plugin";

type CSSVariables = {
    container: React.CSSProperties;
    select: React.CSSProperties;
    button: React.CSSProperties;
    buttonHover: React.CSSProperties;
};
// Extracted CSS variables
const cssVariables: CSSVariables = {
    container: {},
    select: {
        flexGrow: 1,
        padding: "8px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
    },
    button: {
        padding: "8px 12px",
        fontSize: "16px",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    buttonHover: {
        backgroundColor: "#e0e0e0",
    },
};

export function SimpleTimeDisplay({filterOps, id}: DisplayFilterProps<string>) {

    const [time, setTime] = filterOps;

    return (
        <div id={id} style={cssVariables.container}>
            <select
                value={time||''}
                onChange={e => setTime(e.target.value)}
                aria-label="Time filter"
                style={cssVariables.select}
            >
                <option value="" disabled>
                    Select time...
                </option>
                <option value="yesterday">Yesterday</option>
                <option value="lastweek">Last Week</option>
                <option value="lastmonth">Last Month</option>
                <option disabled aria-hidden="true">
                    ----
                </option>
                <option value="" aria-label="Clear all filters">
                    Clear filter
                </option>
            </select>
        </div>
    );
}