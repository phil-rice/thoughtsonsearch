import React, {createContext, useContext} from "react";
import {Errors} from "@enterprise_search/errors";

export type IconFn = (name: string) => Icon
export type Icon = () => React.ReactElement

export type IconContextData = {
    iconFn: IconFn
    errorHandler: (e: Errors) => Icon
}

export const IconContext = createContext<IconFn | undefined>(undefined)
export type IconProviderProps = {
    iconFn: IconFn
    children: React.ReactNode
}

export function IconProvider({iconFn, children}: IconProviderProps) {
    return <IconContext.Provider value={iconFn}>{children}</IconContext.Provider>
}

export const useIcon = (): IconFn => {
    const iconFn = useContext(IconContext)
    if (!iconFn) throw new Error("useIcon must be used within an IconProvider")
    return iconFn
}


export const simpleIconFn: IconFn = (name: string): Icon =>
    () => <img src={`icons/${name}.svg`} alt={name}/>

export const simpleRecover = (e: Errors) => {
    throw new Error(`Icon not found]${e.errors.join("\n")}`)
}

export const simpleIconContext: IconContextData = {
    iconFn: simpleIconFn,
    errorHandler: simpleRecover
}