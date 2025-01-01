import {ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleTimeDisplay} from "./simple.time.filter";


export const timefilterPluginName = 'time';
export type TimeFilters = {
    [timefilterPluginName]: string
}
export const exampleTimeFilterPlugin: ReactFiltersPlugin<TimeFilters, 'time'> = {
    plugin: 'filter',
    type: timefilterPluginName,
    DefaultDisplay: SimpleTimeDisplay,
    PurposeToDisplay: {}, //happy with defaults
    fromUrl: (debug, urlData, def) => {
        const time = urlData.url.searchParams.get(timefilterPluginName)
        debug('timeFilter fromUrl', 'time=', time)
        return time || def
    },
    addToUrl: (debug, sp, time) => {
        debug('timeFilter addToUrl', 'time=', time)
        if (time)
            sp.set(timefilterPluginName, time)
        else
            sp.delete(timefilterPluginName)
    }
}