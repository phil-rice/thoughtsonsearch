// Define a type for the CSS variables
import React, {useEffect} from "react";
import {useFiltersByStateType} from "@enterprise_search/react_search_state";
import {useSearchParser} from "@enterprise_search/react_search_parser";
import {SearchBarProps} from "./search.bar";
import {KeywordsFilter} from "@enterprise_search/react_keywords_filter_plugin";
import {useGuiSearchQuery} from "@enterprise_search/search_gui_state";

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


/* The logic for this method is mainly about the difference between 'main' and 'immediate' searches.
  The main filters are the main gui driven ones, and keyword is updated when the user presses enter or clicks the search button.
  The immediate filters are the ones that are updated as the user types in the search bar. So every time we type we copy the main filters to the immediate filters.
  And this can be part of the parse filter...
  When we search we just copy the immediate filters to the main filters.

  Count is probably handled by the search logic
 */
export function SimpleSearchBar<Filters extends KeywordsFilter>({onSearch}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useGuiSearchQuery()
    const [mainFilters, setMainFilters] = useFiltersByStateType<Filters>('main')
    const [immediateFilters, setImmediateFilters] = useFiltersByStateType<Filters>('immediate')
    const parser = useSearchParser()
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)
    useEffect(() => setImmediateFilters(parser(searchQuery, mainFilters)), [searchQuery]);

    const search = () => {
        setMainFilters(immediateFilters);
        onSearch?.()
    };

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