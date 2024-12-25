import React from "react";
import {useDevModeComponents, useDevModeSelected} from "./devmode.search";
import {useUserData} from "@enterprise_search/authentication";

export function DevMode() {
    const userData = useUserData()
    const {DevModeNavBar, components} = useDevModeComponents()
    const selectedOps = useDevModeSelected()
    const allowed = userData.isDev || userData.isAdmin
    if (!allowed || window.location.href.indexOf('devMode') === -1) return <></>
    const [selected] = selectedOps
    const Component = components[selected] || (() => <></>)
    return <div className='dev-mode'>
        <hr/>
        <DevModeNavBar selectedOps={selectedOps}/>
        <Component/>
    </div>
}