import {DisplaySovereignPageProps, useSelectedSovereign, useSovereignStatePlugins} from "./sovereign.selection.state";
import React from "react";
import {useReportError} from "@enterprise_search/react_error";


export function DisplaySelectedSovereignPage(props: DisplaySovereignPageProps) {
    const [selected] = useSelectedSovereign()
    const reportError = useReportError()
    const plugins = useSovereignStatePlugins()
    const plugin = plugins[selected];
    if (!plugin) reportError('s/w', `No plugin for sovereign ${selected}. Legal plugins are ${Object.keys(plugins).join(", ")}`)
    const Display = plugin.display
    return <Display {...props}/>
}

// export const SelectedSovereignPagePlugin = makeSovereignStatePlugin(DisplaySelectedSovereignPage)