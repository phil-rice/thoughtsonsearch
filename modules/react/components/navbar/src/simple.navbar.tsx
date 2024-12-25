import React, {CSSProperties, useCallback} from "react";
import {NavBar, NavBarItem, NavBarProps, NavBarLayout} from "./navbar";
import {DefaultNavItemStyles, NavItemStyles, SimpleNavItem} from "./simple.navbar.item";
import {defaultNavBarLayoutStyle, SimpleNavbarLayout} from "./simple.navbar.layout";

export const makeNavBar = (items: string[], NavBarItem: NavBarItem, NavBarLayout: NavBarLayout): NavBar =>
    (props: NavBarProps) =>
        <NavBarLayout>
            {items.map(item => <NavBarItem key={item} value={item} selectedOps={props.selectedOps}/>)}
        </NavBarLayout>

export function makeSimpleNavBar<T extends any>(purpose: string, items:  string[], navItemStyles: NavItemStyles = DefaultNavItemStyles, navLayoutStyles: CSSProperties = defaultNavBarLayoutStyle): NavBar {
    return makeNavBar(items, SimpleNavItem(navItemStyles), SimpleNavbarLayout(navLayoutStyles, purpose));

}