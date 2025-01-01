import {DataPlugin, DisplayData, DisplayDataWidget} from "@enterprise_search/react_data/src/react.data";
import {SimplePeopleDisplay, SimplePeopleWidget, SimpleOneLinePeopleDisplay} from "./simple.people.display";
import {SimpleDisplayDataArray} from "@enterprise_search/react_data";

export const PeopleDataName = 'people'

//garbage at the mo,emt
export type PeopleData = {
    url: string;
    type: string
    status: string
    summary: string
    issue: string
    description: string
    last_updated: string
}

export function peopleDataPlugin(
    DisplayData: DisplayData<PeopleData> = SimplePeopleDisplay,
    OneLineDisplayData: DisplayData<PeopleData> = SimpleOneLinePeopleDisplay,
    DisplayDataWidget: DisplayDataWidget<PeopleData> = SimplePeopleWidget): DataPlugin<PeopleData> {
    return {
        plugin: 'data',
        type: PeopleDataName,
        DisplayDataArray: SimpleDisplayDataArray,
        DisplayData,
        OneLineDisplayData,
        DisplayDataWidget
    }
}
