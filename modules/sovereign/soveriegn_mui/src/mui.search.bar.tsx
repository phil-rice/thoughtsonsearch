// MuiSearchBar.tsx
import React, { useEffect, useMemo, useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useGuiSearchQuery} from "@enterprise_search/search_gui_state";
import {defaultSimpleSearchBarStyles, SearchBarProps} from "@enterprise_search/search_bar";
import {Box} from "@mui/material";

export function MuiSearchBar({
                                 mainSearch,
                                 escapePressed,
                                 styles = {},
                             }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useGuiSearchQuery();

    const inputRef = useRef<HTMLInputElement>(null);

    const mergedStyles = useMemo(
        () => ({ ...defaultSimpleSearchBarStyles, ...styles }),
        [styles]
    );

    // Autofocus on mount
    useEffect(() => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }, []);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            mainSearch?.();
        } else if (e.key === "Escape") {
            escapePressed?.();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "100%", // Ensure the container takes full width
                ...mergedStyles.container,
            }}
        >
            <TextField
                id="search-input"
                inputRef={inputRef}
                type="text"
                value={searchQuery}
                autoComplete="off"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search input"
                variant="outlined"
                size="small"
                onKeyUp={handleKeyUp}
                sx={{
                    width: {
                        xs: "80%", // 80% width on extra-small screens
                        sm: "60%", // 60% width on small and larger screens
                    },
                    marginRight: 1,
                    ...mergedStyles.input,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#ccc",
                        },
                        "&:hover fieldset": {
                            borderColor: "#888",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#3f51b5",
                        },
                    },
                }}
            />
            <Button
                variant="contained"
                color="primary"
                aria-label="Search"
                onClick={() => mainSearch?.()}
                disabled={!searchQuery?.trim()}
                sx={{
                    flexShrink: 0, // Prevent the button from shrinking
                    ...mergedStyles.searchButton,
                }}
            >
                Search
            </Button>
        </Box>
    );
}
