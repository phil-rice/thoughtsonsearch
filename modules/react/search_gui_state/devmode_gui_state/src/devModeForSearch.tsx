import React from "react";
import {useDevModeComponents, useDevModeSelected} from "./devmode.search";

export function DevModeForSearch() {
    const {DevModeNavBar, components} = useDevModeComponents()
    const [selected] = useDevModeSelected()
    const Component = components[selected] || (() => <></>)
    return <div className='dev-mode'>
        <hr/>
        <DevModeNavBar/>
        <Component/>
    </div>
}