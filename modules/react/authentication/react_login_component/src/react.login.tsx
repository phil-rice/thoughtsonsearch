import React from "react";
import {SimpleDisplayLogin} from "./simple.login";


export type DisplayLoginProps = {}
export type DisplayLogin = (props: DisplayLoginProps) => React.ReactElement

export const DisplayLoginContext = React.createContext<DisplayLogin>(SimpleDisplayLogin)

export type LoginProviderProps = {
    displayLogin: DisplayLogin
    children: React.ReactNode
}

export function LoginProvider({displayLogin, children}: LoginProviderProps) {
    return <DisplayLoginContext.Provider value={displayLogin}>{children}</DisplayLoginContext.Provider>
}

export type DisplayLoginOps = {
    DisplayLogin: DisplayLogin
}

export function useDisplayLogin(): DisplayLoginOps {
    const DisplayLogin = React.useContext(DisplayLoginContext)
    return {DisplayLogin}
}