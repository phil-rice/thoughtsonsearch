import React, {createContext, useContext, useMemo} from "react";
import {LoginOps} from "./login.ops";
import {UserData, UserDataGetter} from "./userData";
import {useReportError} from "@enterprise_search/react_error";

export type LoginOutFn = (callback: () => void, debug: boolean) => Promise<void>
export type LoginConfig = {
    refeshLogin: LoginOutFn
    login: LoginOutFn
    logout: LoginOutFn
    userDataGetter: UserDataGetter
    debug: boolean

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

export const LoginContext = createContext<AuthenticateContextData | undefined>(undefined)
export const UserDataContext = createContext<UserData | undefined>(undefined)

export function UserDataProvider({userDataGetter, children}: { userDataGetter: UserDataGetter, children: React.ReactNode }) {

}

export function AuthenticationProvider({loginConfig, children, makeSessionId = defaultMakeSessionId}: LoginProviderProps) {
    const [userData, setUserData] = React.useState<UserData>({loggedIn: false, email: '', isDev: false, isAdmin: false})
    const {userDataGetter, logout, refeshLogin, login, debug} = loginConfig

    //problem is the useMemo before we have the userDataGetter

    const contextData = useMemo(() => {
        const updateUserData = (reason: string,) => () => {
            const userData = userDataGetter();
            if (debug) console.log('updateUserData', reason, userData)
            setUserData(userData)
        };

        const loginOps: LoginOps = {
            refeshLogin: async () => refeshLogin(updateUserData('refresh'), debug),
            login: async () => login(updateUserData('login'), debug),
            logout: async () => logout(updateUserData('logout'), debug),

        };
        return {loginOps, sessionId: makeSessionId(), userDataGetter}
    }, [login, logout, refeshLogin, debug])
    if (debug) console.log('AuthenticationProvider', contextData)
    return <LoginContext.Provider value={contextData}>
        <UserDataContext.Provider value={userData}>
            {children}
        </UserDataContext.Provider>
    </LoginContext.Provider>
}

export function useLogin(): LoginOps {
    const login = useContext(LoginContext)
    const reportError = useReportError()
    if (!login) reportError('s/w', 'useLogin must be used within a LoginProvider')
    return login.loginOps
}

export function useUserData(): UserData | undefined {
    const userData = useContext(UserDataContext)
    return userData
}


export function useSessionId() {
    const login = useContext(LoginContext)
    const reportError = useReportError()
    if (!login) reportError('s/w', 'useSessionId must be used within a LoginProvider')
    return login.sessionId
}