import React, {ReactNode} from "react";
import {Authenticate, useLoginComponents} from "@enterprise_search/react_login_component";
import {useSovereignAppComponents} from "./sovereign.app.components";
import {DisplaySelectedSovereignPage} from "@enterprise_search/sovereign";

export type SearchAppProps = { children: ReactNode }

export function SovereignApp({children}: SearchAppProps) {

    const {SovereignAppLayout, SovereignHeader, SovereignFooter} = useSovereignAppComponents()
    return <SovereignAppLayout>
        <SovereignHeader/>
        {children}
        <SovereignFooter/>
    </SovereignAppLayout>
}

