import React, {useMemo} from "react";
import {SimpleDisplayLogin} from "./simple.login";


export type DisplayLoginProps = {}
export type DisplayLogin = (props: DisplayLoginProps) => React.ReactElement

export type DisplayLoginContextData = {
    DisplayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
}
export const DisplayLoginContext = React.createContext<DisplayLoginContextData>({DisplayLogin: SimpleDisplayLogin})

export type LoginProviderProps = {
    displayLogin: DisplayLogin
    NotLoggedIn?: () => React.ReactElement
    children: React.ReactNode
}

export function LoginProvider({displayLogin, NotLoggedIn, children}: LoginProviderProps) {
    const data = useMemo(() =>
        ({DisplayLogin: displayLogin, NotLoggedIn}), [displayLogin, NotLoggedIn])
    return <DisplayLoginContext.Provider value={data}>{children}</DisplayLoginContext.Provider>
}

export type DisplayLoginOps = {
    DisplayLogin: DisplayLogin
}

export function useDisplayLogin(): DisplayLoginOps {
    const {DisplayLogin} = React.useContext(DisplayLoginContext)
    return {DisplayLogin}
}

export function useNotLoggedIn() {
    const {NotLoggedIn} = React.useContext(DisplayLoginContext)
    return {NotLoggedIn}
}