import {DisplaySovereignPageProps, useSelectedSovereign, useSovereignStatePlugins} from "./sovereign.selection.state";
import React from "react";


export function DisplaySelectedSovereignPage(props: DisplaySovereignPageProps) {
    const [selected] = useSelectedSovereign()
    const plugins = useSovereignStatePlugins()
    const plugin = plugins[selected];
    if (!plugin) throw new Error(`No plugin for sovereign ${selected}. Legal plugins are ${Object.keys(plugins).join(", ")}`)
    const Display = plugin.display
    return <Display {...props}/>
}
// export const SelectedSovereignPagePlugin = makeSovereignStatePlugin(DisplaySelectedSovereignPage)