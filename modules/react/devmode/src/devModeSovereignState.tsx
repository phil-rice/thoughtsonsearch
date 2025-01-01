import React from "react";
import {useSelectedSovereign} from "@enterprise_search/sovereign";
import {useWindowUrlData} from "@enterprise_search/routing";
import {useAttributeValueComponents} from "@enterprise_search/renderers";

export function DevModeSovereignState<Filters, >() {
    const [urlData] = useWindowUrlData()
    const [selected] = useSelectedSovereign()
    const {url, parts} = urlData
    const {Text, DataLayout} = useAttributeValueComponents()

    return <DataLayout className='dev-mode-search-state' layout={[1, 1, 1]}>
        <Text rootId='devmode-selected-sovereign' attribute='selected' value={selected}/>
        <Text rootId='devmode-selected-sovereign' attribute='urldata - url' value={url.toString()}/>
        <Text rootId='devmode-selected-sovereign' attribute='urldata - parts' value={JSON.stringify(parts)}/>
    </DataLayout>
}
