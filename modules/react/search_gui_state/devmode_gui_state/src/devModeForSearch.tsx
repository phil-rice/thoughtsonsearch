import React from "react";
import {useDevModeComponents, useDevModeSelected} from "./devmode.search";

export function DevModeForSearch() {
    const {DevModeNavBar, components} = useDevModeComponents()
    const selectedOps = useDevModeSelected()
    const [selected] = selectedOps
    const Component = components[selected] || (() => <></>)
    return <div className='dev-mode'>
        <hr/>
        <DevModeNavBar selectedOps={selectedOps}/>
        <Component/>
    </div>
}