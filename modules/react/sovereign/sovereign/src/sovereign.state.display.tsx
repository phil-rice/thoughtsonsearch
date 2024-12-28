import {DisplaySovereignPageProps, useSelectedSovereign, useSovereignStatePlugins} from "./sovereign.selection.state";
import React from "react";
import {useThrowError} from "@enterprise_search/react_utils";


export function DisplaySelectedSovereignPage(props: DisplaySovereignPageProps) {
    const [selected] = useSelectedSovereign()
    const reportError = useThrowError()
    const plugins = useSovereignStatePlugins()
    const plugin = selected ? plugins[selected] : Object.values(plugins)[0];
    if (!plugin) reportError('s/w', `No plugin for sovereign ${selected}. Legal plugins are ${Object.keys(plugins).join(", ")}`)
    const Display = plugin.display
    return <Display {...props}/>
}

// export const SelectedSovereignPagePlugin = makeSovereignStatePlugin(DisplaySelectedSovereignPage)