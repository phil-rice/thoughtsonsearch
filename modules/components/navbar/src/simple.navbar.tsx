import React, {CSSProperties} from "react";
import {NavBar, NavBarItem, NavBarLayout, NavBarProps} from "./navbar";
import {DefaultNavItem} from "./simple.navbar.item";
import {defaultNavBarLayoutStyle, SimpleNavbarLayout} from "./simple.navbar.layout";

export const makeNavBar = (items: string[], NavBarItem: NavBarItem, NavBarLayout: NavBarLayout): NavBar =>
    (props: NavBarProps) =>
        <NavBarLayout>
            {items.map(item => <NavBarItem key={item} value={item} selectedOps={props.selectedOps}/>)}
        </NavBarLayout>

export function makeSimpleNavBar<T extends any>(prefix: string, items: string[], navLayoutStyles: CSSProperties = defaultNavBarLayoutStyle): NavBar {
    return makeNavBar(items, DefaultNavItem(prefix), SimpleNavbarLayout(navLayoutStyles, prefix));

}