import {DataPlugin, DisplayData} from "@enterprise_search/react_data/src/react.data";
import {SimpleConfluenceDisplay, SimpleConfluenceOneLineDisplay} from "./simple.confluence.display";

export const ConfluenceDataName = 'confluence'

export type ConfluenceData = {
    type: string
    title: string
    body: string
    last_updated: string
    last_update_date: string
}

export function ConfluenceDataPlugin(
    DisplayData: DisplayData<ConfluenceData> = SimpleConfluenceDisplay,
    OneLineDisplayData: DisplayData<ConfluenceData> = SimpleConfluenceOneLineDisplay): DataPlugin<ConfluenceData> {
    return {
        plugin: 'data',
        type: ConfluenceDataName,
        DisplayData,
        OneLineDisplayData
    }
}

