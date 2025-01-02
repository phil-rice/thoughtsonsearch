import {ReactFiltersPlugin} from "@enterprise_search/react_filters_plugin";
import {SimpleTimeDisplay} from "./simple.time.filter";


export const timefilterPluginName = 'time';
export type TimeString = 'yesterday' | 'lastWeek' | 'lastMonth' | 'lastYear'
export const timeStrings: TimeString[] = ['yesterday', 'lastWeek', 'lastMonth', 'lastYear']
export type TimeFilters = {
    [timefilterPluginName]: TimeString | undefined
}
export const exampleTimeFilterPlugin: ReactFiltersPlugin<TimeFilters, 'time'> = {
    plugin: 'filter',
    type: timefilterPluginName,
    DefaultDisplay: SimpleTimeDisplay,
    PurposeToDisplay: {}, //happy with defaults
    fromUrl: (debug, urlData, def) => {
        const time = urlData.url.searchParams.get(timefilterPluginName)
        if (!timeStrings.includes(time as TimeString)) return def
        debug('timeFilter fromUrl', 'time=', time)
        return time as TimeString || def
    },
    addToUrl: (debug, sp, time) => {
        debug('timeFilter addToUrl', 'time=', time)
        if (time)
            sp.set(timefilterPluginName, time)
        else
            sp.delete(timefilterPluginName)
    }
}