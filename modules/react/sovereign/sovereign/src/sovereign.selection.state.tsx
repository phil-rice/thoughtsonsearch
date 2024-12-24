import React, {ReactElement, useContext, useState} from "react";
import {GetterSetter, makeContextFor, makeContextForState} from "@enterprise_search/react_utils";
import {NameAnd} from "@enterprise_search/recoil_utils";


//It feels that this will grow and become more of a plugin
//At the moment it's just a display sovereign page so not that needed
//However by making it a plugin it is consistant with the others
//We should monitor this

export type SovereignSelectionState = {
    /* The name of the sovereign selected */
    selected: string
}
/** This is the list of all of the sovereign pages that we have. The 'selected' in the above state is for this */
export type SovereignStatePlugins = NameAnd<SovereignStatePlugin>
export type SovereignStatePlugin = {
    plugin: 'sovereign'
    display: DisplaySovereignPage
}

export type DisplaySovereignPage = (props: DisplaySovereignPageProps) => ReactElement
export type DisplaySovereignPageProps = {}

export function makeSovereignStatePlugin(display: DisplaySovereignPage): SovereignStatePlugin {
    return {plugin: 'sovereign', display}
}

export const {use: useSovereignStatePlugins, Provider: SovereignStatePluginsProvider} = makeContextFor<SovereignStatePlugins, 'plugins'>('plugins', undefined)

// export const { } = makeContextForState<string, 'initial'>('initial')

const sContext = React.createContext<GetterSetter<string> | undefined>(undefined)
export function useSelectedSovereign(): GetterSetter<string> {
    const selected = useContext(sContext)
    return selected!
}
export function SovereignStateProvider({initial, children}: { initial: string, children: ReactElement }) {
    const ops = useState(initial)
    return <sContext.Provider value={ops}>{children}</sContext.Provider>

}


