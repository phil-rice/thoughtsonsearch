import {useDebugState} from "@enterprise_search/react_utils";
import React, {CSSProperties, ChangeEvent} from "react";
import {debugStyles} from "./dev.mode.styles";


export function DevModeDebug() {
    const [debug, setDebug] = useDebugState();
    const {containerStyle, headingStyle, checkboxContainerStyle, labelStyle, checkboxStyle, debugInfoStyle} = debugStyles
    const handleCheckboxChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setDebug({...debug, [key]: e.target.checked});
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Debug</h2>
            {Object.keys(debug).map((key) => (
                <div key={key} style={checkboxContainerStyle}>
                    <label style={labelStyle}>
                        <input
                            type="checkbox"
                            checked={debug[key]}
                            onChange={handleCheckboxChange(key)}
                            style={checkboxStyle}
                        />
                        {key}
                    </label>
                </div>
            ))}
            <div style={debugInfoStyle}>
                <strong>Raw Debug State:</strong>
                <pre>{JSON.stringify(debug, null, 2)}</pre>
            </div>
        </div>
    );
}
