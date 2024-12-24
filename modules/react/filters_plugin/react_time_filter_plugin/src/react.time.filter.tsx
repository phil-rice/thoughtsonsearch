import {ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleTimeDisplay} from "./simpleTimeFilter";


export const timefilterPluginName = 'time';
export type TimeFilters = {
    [timefilterPluginName]: string
}
export const exampleTimeFilterPlugin: ReactFiltersPlugin<TimeFilters, 'time'> = {
    plugin: 'filter',
    type: timefilterPluginName,
    DefaultDisplay: SimpleTimeDisplay,
    PurposeToDisplay: {} //happy with defaults
}