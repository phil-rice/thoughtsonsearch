import React, {CSSProperties} from 'react';
import {SearchDropDown, SearchDropDownProps} from "./search.drop.down";
import {searchResultsToErrors, searchResultsToInterleavedData, SearchType} from "@enterprise_search/search_state";
import {useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {useUserData} from "@enterprise_search/authentication";


export const SimpleSearchDropdown: SearchDropDown = ({st}: SearchDropDownProps) => {
    const [searchResults] = useSearchResultsByStateType(st);
    const [searchQuery, setSearchQuery] = useGuiSearchQuery();
    const data = searchResultsToInterleavedData(searchResults.dataSourceToSearchResult, 6);
    const srToError = searchResultsToErrors(searchResults.dataSourceToSearchResult);
    const userData = useUserData();
    if (Object.keys(srToError).length > 0 || data.length > 0) {
        return (
            <div style={styles.dropdown}>
                {data.map((data, index) => (
                    <div key={index} style={styles.suggestion} onClick={() => setSearchQuery(JSON.stringify(data))}>
                        {JSON.stringify(data)}
                    </div>
                ))}
                {data.length === 0 && <div style={styles.suggestion}>...</div>}
                {userData.isDev ? (
                    <div style={styles.errors}>
                        {Object.entries(srToError).map(([source, error]) => (
                            <div key={source} style={styles.error}>
                                {source}: {JSON.stringify(error)}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
    return <></>
}

// Styles for dropdown and suggestions
const styles: Record<string, CSSProperties> = {
    dropdown: {
        position: 'absolute',
        top: '40px',  // Adjust to match search bar height
        width: '100%',
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        zIndex: 1000,
        borderRadius: '4px',
    },
    suggestion: {
        padding: '10px',
        cursor: 'pointer',
    },
    errors: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#ffe6e6',
        border: '1px solid #ffb3b3',
        borderRadius: '4px',
    },
    error: {
        padding: '5px 0',
        color: '#d8000c',
        fontWeight: 'bold',
    },
};

