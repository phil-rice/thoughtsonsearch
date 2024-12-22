import React from "react";
import {GetterSetter} from "@enterprise_search/react_utils";


/** We display the filters on the gui. And then copy them to the search area when we want a search done
 *
 * We can have many searches but that is handled by the search state. This is just the gui for configuring the search
 *
 * Now we have mul
 * */
export type SovereignSearchState<Filters> = {
    searchQuery: string
    filters: Filters
}

export type DataView = {}
