import { useDebugState } from "@enterprise_search/react_utils";
import React, { CSSProperties, ChangeEvent } from "react";

const containerStyle: CSSProperties = {
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
};

const checkboxContainerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
};

const labelStyle: CSSProperties = {
    fontSize: "16px",
    marginLeft: "10px",
};

const checkboxStyle: CSSProperties = {
    transform: "scale(1.2)",
};

const headingStyle: CSSProperties = {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
};

const debugInfoStyle: CSSProperties = {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "4px",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
};

export function DevModeDebug() {
    const [debug, setDebug] = useDebugState();

    const handleCheckboxChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setDebug({ ...debug, [key]: e.target.checked });
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
