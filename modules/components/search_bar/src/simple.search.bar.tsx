import React, {useEffect, useMemo, useRef} from "react";
import {useSearchResultsByStateType} from "@enterprise_search/react_search_state";
import {SearchBarProps} from "./search.bar";
import {useGuiFilters, useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {defaultSimpleSearchBarStyles} from "./search.bar.styles";

export function SimpleSearchBar({
                                    mainSearch,
                                    escapePressed,
                                    styles = {},
                                }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useGuiSearchQuery();

    const inputRef = useRef<HTMLInputElement>(null);

    const mergedStyles = useMemo(() => ({...defaultSimpleSearchBarStyles, ...styles}), [styles]);

    // Autofocus on mount
    useEffect(() => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }, []);

    return (
        <div style={mergedStyles.container}>
            <input
                id="search-input"
                ref={inputRef}
                type="text"
                value={searchQuery}
                autoComplete="off"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search input"
                style={mergedStyles.input}
                onKeyUp={(e) => {
                    if (e.key === "Enter") return mainSearch?.();
                    if (e.key === "Escape") return escapePressed?.();
                }}
                onFocus={(e) =>
                    Object.assign(e.target.style, mergedStyles.inputFocus)
                }
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
            <button
                type="button"
                aria-label="Search"
                onClick={() => mainSearch?.()}
                disabled={!searchQuery?.trim()}
                style={mergedStyles.searchButton}
            >Search
            </button>

        </div>
    );
}
