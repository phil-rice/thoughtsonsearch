import React from "react";

export type SearchBarStyles = {
    container: React.CSSProperties;
    input: React.CSSProperties;
    searchButton: React.CSSProperties;
    searchButtonHover: React.CSSProperties;
    inputFocus: React.CSSProperties;
    liveRegion: React.CSSProperties;
};
export const defaultSimpleSearchBarStyles: SearchBarStyles = {
    container: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "8px",
        boxSizing: "border-box",
    },
    input: {
        flexGrow: 1,
        width: "100%",
        padding: "10px 12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px 0 0 4px",
        outline: "none",
        transition: "border-color 0.2s ease-in-out",
    },
    inputFocus: {
        borderColor: "#0078d7",
    },
    searchButton: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#0078d7",
        color: "white",
        border: "1px solid #0078d7",
        borderRadius: "0 4px 4px 0",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
    },
    searchButtonHover: {
        backgroundColor: "#005bb5",
        borderColor: "#005bb5",
    },
    liveRegion: {
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clipPath: "inset(100%)",
        whiteSpace: "nowrap",
    }
};