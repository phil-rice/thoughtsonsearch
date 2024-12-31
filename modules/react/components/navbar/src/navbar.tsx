import React from "react";
import {GetterSetter} from "@enterprise_search/react_utils";




export type NavBarItemProps = {  value: string, selectedOps: GetterSetter<string>,sideEffectOnSelect?: (value: string) => void }
export type NavBarItem = (props: NavBarItemProps) => React.ReactElement;
export type NavbarLayoutProps = { children: React.ReactNode }
export type NavBarLayout = (props: NavbarLayoutProps) => React.ReactElement;
export type NavBarProps = { selectedOps: GetterSetter<string> , sideEffectOnSelect?: (value: string) => void}
export type NavBar = (props: NavBarProps) => React.ReactElement;


