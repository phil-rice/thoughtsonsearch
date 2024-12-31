import React from "react";
import {useSelectedSovereign} from "@enterprise_search/sovereign";
import {useWindowUrlData} from "@enterprise_search/routing";
import {useGuiSelectedDataView} from "@enterprise_search/search_gui_state";
import {useAttributeValueComponents} from "@enterprise_search/renderers";

export function DevModeSovereignState<Filters, >() {
    const [selected] = useSelectedSovereign()
    const [urlData] = useWindowUrlData()
    const {url, parts} = urlData
    const [guiSelected] = useGuiSelectedDataView()
    const {Text, Json, DataLayout} = useAttributeValueComponents()

    return <DataLayout className='dev-mode-search-state' layout={[1, 1, 1]}>
        <Text rootId='devmode-selected-sovereign' attribute='selected' value={selected}/>
        <Text rootId='devmode-selected-sovereign' attribute='urldata - url' value={url.toString()}/>
        <Text rootId='devmode-selected-sovereign' attribute='urldata - parts' value={JSON.stringify(parts)}/>
    </DataLayout>
}
