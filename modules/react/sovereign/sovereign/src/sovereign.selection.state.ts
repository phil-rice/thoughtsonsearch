import React from "react";
import {GetterSetter} from "@enterprise_search/react_utils";


/** Sovereign state is a generic that is a record from the soverign name to the state of that sovereign
 * At the moment we operate on the assumption they are not reentrant*/
export type SovereignSelectionState<SovereignState> = {
    /* The name of the sovereign selected */
    selected: keyof SovereignState
    state: SovereignState
}

