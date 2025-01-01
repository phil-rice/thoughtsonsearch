import React, {ChangeEvent} from "react";
import {clearAllFeatureFlags, FeatureFlags, updateFeatureFlagsFromHRef, useFeatureFlagsState, useOriginalFeatureFlags} from "@enterprise_search/react_utils";
import {lensBuilder} from "@enterprise_search/optics";
import {debugStyles} from "./dev.mode.styles";
import {useWindowUrlData} from "@enterprise_search/routing";

export function DevModeFeatureFlags() {
    const [featureFlags, setFeatureFlags] = useFeatureFlagsState();
    const original = useOriginalFeatureFlags()
    const [winUrlData] = useWindowUrlData()
    const {
        containerStyle,
        headingStyle,
        checkboxContainerStyle,
        labelStyle,
        checkboxStyle,
        debugInfoStyle,
        fromUrlButtonStyle,
        buttonContainerStyle,
        clearButtonStyle,
        resetButtonStyle
    } = debugStyles;

    const handleCheckboxChange = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const lens = lensBuilder<FeatureFlags>().focusOn(key).focusOn("value");
        setFeatureFlags(lens.set(featureFlags, e.target.checked));
    };

    return (
        <div style={containerStyle}>
            <div style={buttonContainerStyle}>
                <button style={resetButtonStyle} onClick={() => setFeatureFlags(original)}>Reset</button>
                <button style={fromUrlButtonStyle} onClick={() => setFeatureFlags(updateFeatureFlagsFromHRef(winUrlData.url, original))}>From Url</button>
                <button style={clearButtonStyle} onClick={() => setFeatureFlags(clearAllFeatureFlags(featureFlags))}>Clear</button>
            </div>
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
