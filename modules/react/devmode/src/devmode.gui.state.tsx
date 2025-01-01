import {useSearchGuiState} from "@enterprise_search/search_gui_state";
import React from "react";

export function DevModeGuiState() {
    const [searchState] = useSearchGuiState()
    return <pre>{JSON.stringify(searchState, null, 2)}</pre>
}