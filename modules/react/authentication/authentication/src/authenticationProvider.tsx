import React, {createContext, useContext, useMemo} from "react";
import {LoginOps} from "./login.ops";
import {emptyUserData, UserData, UserDataGetter} from "./userData";
import {DebugLog, makeContextForState, useDebug} from "@enterprise_search/react_utils";
import {useReportError} from "@enterprise_search/react_error";

export const authenticateDebug = 'authenticate'
export type LoginOutFn = (callback: () => void, debugLog: DebugLog) => Promise<void>
export type LoginConfig = {
    refeshLogin: LoginOutFn
    login: LoginOutFn
    logout: LoginOutFn
    userDataGetter: UserDataGetter

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
    userDataGetter: UserDataGetter
}

const {use: useUserDataFull, Provider: UserDataProviderPrivate} = makeContextForState<UserData, 'userData'>('userData')
export const UserDataProvider = UserDataProviderPrivate

export function useUserData() {
    const ops = useUserDataFull()
    return ops[0]
}

export const LoginContext = createContext<AuthenticateContextData | undefined>(undefined)

export function AuthenticationProvider({loginConfig, children, makeSessionId = defaultMakeSessionId}: LoginProviderProps) {
    return <UserDataProvider userData={emptyUserData}>
        <JustAuthenticationProvider loginConfig={loginConfig} makeSessionId={makeSessionId}>
            {children}
        </JustAuthenticationProvider></UserDataProvider>
}

export function JustAuthenticationProvider({loginConfig, children, makeSessionId = defaultMakeSessionId}: LoginProviderProps) {
    const [userData, setUserData] = useUserDataFull()
    const debug = useDebug(authenticateDebug)
    const {userDataGetter, logout, refeshLogin, login} = loginConfig

    //problem is the useMemo before we have the userDataGetter

    const contextData = useMemo(() => {
        const updateUserData = (reason: string,) => () => {
            const userData = userDataGetter();
            debug('updateUserData', reason, userData)
            setUserData(userData)
        };

        const loginOps: LoginOps = {
            refeshLogin: async () => refeshLogin(updateUserData('refresh'), debug),
            login: async () => login(updateUserData('login'), debug),
            logout: async () => logout(updateUserData('logout'), debug),

        };
        return {loginOps, sessionId: makeSessionId(), userDataGetter}
    }, [login, logout, refeshLogin, debug.debug])
    debug('AuthenticationProvider', contextData)
    return <LoginContext.Provider value={contextData}>
        {children}
    </LoginContext.Provider>

}

export function useLogin(): LoginOps {
    const login = useContext(LoginContext)
    const reportError = useReportError()
    if (!login) reportError('s/w', 'useLogin must be used within a LoginProvider')
    return login.loginOps
}


export function useSessionId() {
    const login = useContext(LoginContext)
    const reportError = useReportError()
    if (!login) reportError('s/w', 'useSessionId must be used within a LoginProvider')
    return login.sessionId
}

