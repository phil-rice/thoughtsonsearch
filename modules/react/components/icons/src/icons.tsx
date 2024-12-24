import React from "react";
import {Errors} from "@enterprise_search/errors";
import {makeContextFor} from "@enterprise_search/react_utils";

export type IconFn = (name: string) => Icon
export type Icon = () => React.ReactElement

export type IconContextData = {
    iconFn: IconFn
    errorHandler: (e: Errors) => Icon
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
export const {Provider: IconProvider, use: useIcon} = makeContextFor('icons', simpleIconContext)

