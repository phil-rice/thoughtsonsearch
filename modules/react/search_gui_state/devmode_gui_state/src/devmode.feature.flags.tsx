import {FeatureFlags, useDebugState, useFeatureFlag, useFeatureFlags} from "@enterprise_search/react_utils";
import React, {CSSProperties, ChangeEvent} from "react";
import {checkboxStyles} from "./dev.mode.checkbox.styles";
import {lensBuilder} from "@enterprise_search/optics";


export function DevModeFeatureFlags() {
    const [featureFlags, setFeatureFlags] = useFeatureFlags();
    const {containerStyle, headingStyle, checkboxContainerStyle, labelStyle, checkboxStyle, debugInfoStyle} = checkboxStyles
    const handleCheckboxChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const lens = lensBuilder<FeatureFlags>().focusOn(key).focusOn("value");
        setFeatureFlags(lens.set(featureFlags, e.target.checked));
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Feature flags</h2>
            {Object.keys(featureFlags).map((key) => (
                <div key={key} style={checkboxContainerStyle}>
                    <label style={labelStyle}>
                        <input
                            type="checkbox"
                            checked={featureFlags[key].value}
                            onChange={handleCheckboxChange(key)}
                            style={checkboxStyle}
                        />
                        {key}: {featureFlags[key].description}
                    </label>
                </div>
            ))}
            <div style={debugInfoStyle}>
                <strong>Raw Featureflags State:</strong>
                <pre>{JSON.stringify(featureFlags, null, 2)}</pre>
            </div>
        </div>
    );
}
