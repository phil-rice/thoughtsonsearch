import {NavBarItemProps} from "./navbar";
import React, {CSSProperties} from "react";
import {useTranslation} from "@enterprise_search/translation";

export const CommonNavBarStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s, border-color 0.3s',
}
const DefaultNavBarSelectedStyle: CSSProperties = {
    ...CommonNavBarStyle,
    border: '2px solid #0056b3',  // Darker blue border
    backgroundColor: '#0056b3',    // Darker blue background
    color: '#fff',
}

export const DefaultNavBarUnselectedStyle: CSSProperties = {
    ...CommonNavBarStyle,
    border: '1px solid #000',
    backgroundColor: '#fff',
    color: '#000',
}

export type NavItemStyles = {
    selectedStyle: CSSProperties
    unselectedStyle: CSSProperties
}
export const DefaultNavItemStyles: NavItemStyles = {
    selectedStyle: DefaultNavBarSelectedStyle,
    unselectedStyle: DefaultNavBarUnselectedStyle
}
export const SimpleNavItem = ({selectedStyle, unselectedStyle}: NavItemStyles = DefaultNavItemStyles) =>
    ({value, selectedOps}: NavBarItemProps) => {
        const [selected, setSelected] = selectedOps
        const translate = useTranslation()
        return <button style={selected === value ? selectedStyle : unselectedStyle} onClick={() => setSelected(value)}>{translate(value)}</button>;
    };


