import React, {CSSProperties} from "react";
import {DataViewNavBarLayout} from "@enterprise_search/data_views";
import {camelCase} from "@enterprise_search/recoil_utils";

export const defaultNavBarLayoutStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    gap: '1rem',
    flexWrap: 'wrap', // Allow items to wrap on smaller screens

}
export const SimpleNavbarLayout = (style: CSSProperties = defaultNavBarLayoutStyle, purpose: string): DataViewNavBarLayout => ({children}) => {

    return (
        <nav
            role="navigation"
            aria-label={purpose}
            className={camelCase(purpose)}
            style={style}
        >{children}
        </nav>
    );
};