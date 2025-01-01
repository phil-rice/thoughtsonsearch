import {DataPlugin, DisplayData, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {SimpleConfluenceDisplay, SimpleConfluenceOneLineDisplay, SimpleConfluenceWidget} from "./simple.confluence.display";
import {SimpleDisplayDataArray} from "@enterprise_search/react_data";

export const ConfluenceDataName = 'confluence'

export type ConfluenceData = {
    url: string;
    space: string;
    type: string
    title: string
    body: string
    last_updated: string

}

export function ConfluenceDataPlugin(
    DisplayData: DisplayData<ConfluenceData> = SimpleConfluenceDisplay,
    OneLineDisplayData: DisplayData<ConfluenceData> = SimpleConfluenceOneLineDisplay,
    DisplayDataWidget: DisplayDataWidget<ConfluenceData> = SimpleConfluenceWidget): DataPlugin<ConfluenceData> {
    return {
        plugin: 'data',
        type: ConfluenceDataName,
        DisplayDataArray: SimpleDisplayDataArray,
        DisplayData,
        OneLineDisplayData,
        DisplayDataWidget
    }
}

