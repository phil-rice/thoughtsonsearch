import {CSSProperties} from "react";

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

export const checkboxStyles = {
    containerStyle,
    checkboxContainerStyle,
    labelStyle,
    checkboxStyle,
    headingStyle,
    debugInfoStyle,
}
