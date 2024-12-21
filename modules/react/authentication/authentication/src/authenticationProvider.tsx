import React, {createContext, useContext} from "react";
import {LoginOps} from "./login.ops";
import {UserData, UserDataGetter} from "./userData";

export type LoginOutFn = (callback: () => void) => Promise<void>
export type LoginConfig = {
    refeshLogin: () => Promise<void>
    login: LoginOutFn
    logout: LoginOutFn
    isLoggedIn: () => boolean
    userData: UserDataGetter

}

export function defaultMakeSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export type LoginProviderProps = {
    makeSessionId?: () => string
    loginConfig: LoginConfig
    children: React.ReactNode
}


export type AuthenticateContextData = {
    sessionId: string
    loginOps: LoginOps
    userData: UserDataGetter

}

export const LoginContext = createContext<AuthenticateContextData | undefined>(undefined)


export function AuthenticationProvider({loginConfig, children, makeSessionId = defaultMakeSessionId}: LoginProviderProps) {
    const [data, setData] = React.useState<AuthenticateContextData>(makeAuthenticateContextData(loginConfig))

    function makeAuthenticateContextData(config: LoginConfig): AuthenticateContextData {
        const {userData, logout, isLoggedIn, refeshLogin, login} = config
        const loginOps: LoginOps = {
            refeshLogin,
            login: async () => login(() => {setData(makeAuthenticateContextData(config))}),
            logout: async () => logout(() => {setData(makeAuthenticateContextData(config))}),
            isLoggedIn
        };
        return {loginOps, userData, sessionId: makeSessionId()}
    }

    return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>
}

export function useLogin(): LoginOps {
    const login = useContext(LoginContext)
    if (!login) throw new Error('useLogin must be used within a LoginProvider')
    return login.loginOps
}

export function useUserData(): UserData {
    const login = useContext(LoginContext)
    if (!login) throw new Error('useUserData must be used within a LoginProvider')
    return login.userData()
}


export function useSessionId() {
    const login = useContext(LoginContext)
    if (!login) throw new Error('useSessionId must be used within a LoginProvider')
    return login.sessionId
}