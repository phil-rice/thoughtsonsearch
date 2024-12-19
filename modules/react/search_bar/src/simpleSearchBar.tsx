// Define a type for the CSS variables
import React, {useEffect} from "react";
import {useAllSearches, useOneFilter, useSearchQuery} from "@enterprise_search/react_search_state";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter";


type CSSVariables = {
    container: React.CSSProperties;
    input: React.CSSProperties;
    clearButton: React.CSSProperties;
    clearButtonHover: React.CSSProperties;
    inputFocus: React.CSSProperties;
};
// CSS variables
const cssVariables: CSSVariables = {
    container: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "800px",
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
        borderRadius: "4px",
        outline: "none",
        transition: "border-color 0.2s ease-in-out",
    },
    inputFocus: {
        borderColor: "#0078d7",
    },
    clearButton: {
        background: "none",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
        marginLeft: "8px",
        color: "#555",
    },
    clearButtonHover: {
        color: "#000",
    },
};

export function SimpleSearchBar() {
    const {searchQuery, setSearchQuery} = useSearchQuery()
    const {setFilter} = useOneFilter<KeywordsFilter, 'keywords'>('keywords')
    const {allSearches, setAllSearches} = useAllSearches()
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchQuery(e.target.value);
    useEffect(() => setFilter(searchQuery));

    function search() {
        const immediateFilters = allSearches.immediate.filters
        const mainSearch = allSearches.main
        const newMain = {...mainSearch, filters: immediateFilters, count: mainSearch.count + 1}
        setAllSearches({...allSearches, main: newMain})
    }

    return (
        <div style={cssVariables.container}>
            <input
                type="text"
                value={searchQuery}
                onChange={onChange}
                placeholder="Search..."
                aria-label="Search input"
                style={cssVariables.input}
                onFocus={(e) =>
                    Object.assign(e.target.style, cssVariables.inputFocus)
                }
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
            <button
                type="button"
                aria-label="Clear search"
                onClick={search}
                style={cssVariables.clearButton}
                onMouseOver={(e) =>
                    Object.assign(e.currentTarget.style, cssVariables.clearButtonHover)
                }
                onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
            >Search
            </button>
        </div>
    );
}