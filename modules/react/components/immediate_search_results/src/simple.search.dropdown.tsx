import React, {useMemo} from 'react';
import {
    DisplaySearchDropDownErrors,
    DisplaySearchDropDownErrorsProps,
    DisplaySearchDropDownResults,
    DisplaySearchDropDownResultsProps,
    SearchDropDown,
    SearchDropDownProps
} from "./search.drop.down";
import {useOneLineDisplayDataComponent} from "@enterprise_search/react_data/src/react.data";
import {useUserData} from "@enterprise_search/react_login_component";
import {useDropdownData} from "./use.dropdown.data";
import {defaultSearchDropDownStyles} from "./search.drop.down.styles";

// Main Dropdown Component
export const SimpleSearchDropdown: SearchDropDown = ({
                                                         st,
                                                         onSelect,
                                                         styles = defaultSearchDropDownStyles,
                                                         DisplaySearchDropDownResults = SimpleDisplaySearchDropDownResults,
                                                         DisplaySearchDropDownErrors = SimpleDisplaySearchDropDownErrors
                                                     }: SearchDropDownProps) => {
    const {dataAndDs, srToError} = useDropdownData(st);
    const userData = useUserData();
    const mergedStyles = useMemo(() => ({...defaultSearchDropDownStyles, ...styles}), [styles]);

    if (Object.keys(srToError).length > 0 || dataAndDs.length > 0) {
        return (
            <div
                style={mergedStyles.dropdown}
                aria-hidden="true"  // Completely hides the dropdown from screen readers
            >
                <DisplaySearchDropDownResults dataAndDs={dataAndDs} onSelect={onSelect} st={st} styles={mergedStyles}/>
                {dataAndDs.length === 0 && (
                    <div style={mergedStyles.suggestion}>
                        No results found
                    </div>
                )}
                {userData.isDev && <DisplaySearchDropDownErrors srToError={srToError} styles={mergedStyles}/>}
            </div>
        );
    }
    return <></>;
};

// Results Component (No Change)
export const SimpleDisplaySearchDropDownResults: DisplaySearchDropDownResults = <Data, >({
                                                                                             dataAndDs,
                                                                                             onSelect,
                                                                                             st,
                                                                                             styles
                                                                                         }: DisplaySearchDropDownResultsProps) => {
    const displayOneLine = useOneLineDisplayDataComponent();

    return (
        <>
            {dataAndDs.map(({data, dataSourceName}, index) => (
                <div
                    key={index}
                    style={styles.suggestion}
                    onClick={() => onSelect(data, dataSourceName)}
                >
                    {displayOneLine((data as any).type)({data, id: `${st}-dropdown-${index}`})}
                </div>
            ))}
        </>
    );
};

// Error Display Component (No Change)
export const SimpleDisplaySearchDropDownErrors: DisplaySearchDropDownErrors =
    ({srToError, styles}: DisplaySearchDropDownErrorsProps) =>
        (Object.keys(srToError).length > 0 && <div style={styles.errors}>
            {Object.entries(srToError).map(([source, error]) => (
                <div key={source} style={styles.error}>
                    {source}: {JSON.stringify(error)}
                </div>
            ))}
        </div>);
