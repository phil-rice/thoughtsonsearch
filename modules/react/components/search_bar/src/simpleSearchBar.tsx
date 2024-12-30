import React, {useEffect, useRef} from "react";
import {useFiltersByStateType, useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";
import {SearchBarProps} from "./search.bar";
import {KeywordsFilter, keywordsFilterName} from "@enterprise_search/react_keywords_filter_plugin";
import {emptySearchGuiState, useGuiFilters, useGuiSearchQuery, useSearchGuiState} from "@enterprise_search/search_gui_state";
import {useDebug} from "@enterprise_search/react_utils";
import {searchDebug} from "@enterprise_search/search";

type CSSVariables = {
    container: React.CSSProperties;
    input: React.CSSProperties;
    clearButton: React.CSSProperties;
    clearButtonHover: React.CSSProperties;
    inputFocus: React.CSSProperties;
};

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
        borderRadius: "4px 0 0 4px",
        outline: "none",
        transition: "border-color 0.2s ease-in-out",
    },
    inputFocus: {
        borderColor: "#0078d7",
    },
    clearButton: {
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#0078d7",
        color: "white",
        border: "1px solid #0078d7",
        borderRadius: "0 4px 4px 0",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
    },
    clearButtonHover: {
        backgroundColor: "#005bb5",
        borderColor: "#005bb5",
    },
};

export function SimpleSearchBar<Filters extends KeywordsFilter>({immediateSearch, mainSearch, escapePressed}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useGuiSearchQuery();
    const [guiFilters] = useGuiFilters();
    const [immediate, setImmediate] = useSearchResultsByStateType('immediate');

    // Create ref for the input field
    const inputRef = useRef<HTMLInputElement>(null);


    //Autofocus on mount
    useEffect(() => {
        if (inputRef.current)
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        if (searchQuery?.trim()) setImmediate(old => ({...old, dataSourceToSearchResult: {}}));
        setSearchQuery(searchQuery);
    };

    useEffect(() => {
        if (searchQuery?.trim()) immediateSearch?.(searchQuery);
    }, [guiFilters, searchQuery]);

    return (
        <div style={cssVariables.container}>
            <input
                ref={inputRef}  // Attach ref to the input
                type="text"
                value={searchQuery}
                onChange={onChange}
                placeholder="Search..."
                aria-label="Search input"
                style={cssVariables.input}
                onKeyUp={(e) => {
                    if (e.key === "Enter") return mainSearch?.();
                    if (e.key === "Escape") return escapePressed?.();
                }}
                onFocus={(e) =>
                    Object.assign(e.target.style, cssVariables.inputFocus)
                }
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
            <button
                type="button"
                aria-label="Clear search"
                onClick={() => mainSearch?.()}
                style={cssVariables.clearButton}
                onMouseOver={(e) =>
                    Object.assign(e.currentTarget.style, cssVariables.clearButtonHover)
                }
                onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
            >
                Search
            </button>
        </div>
    );
}
