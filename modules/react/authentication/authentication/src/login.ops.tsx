//These may never return as it may cause a reload of the gui...
import React, {createContext, useContext, useEffect, useMemo} from "react";

export type LoginOutListener = (loggedInNotOut: boolean) => void

export type CommonLoginOps = {
    //Doesn't pop open a new window, but logs in if it can
    refeshLogin: () => Promise<void>
    //what you should call when the user clicks 'login'
    login: () => Promise<void>
    logout: () => Promise<void>
    isLoggedIn: () => boolean
}


export type LoginOps = CommonLoginOps & {
    email: string | undefined
}
export type RawLoginOps = CommonLoginOps & {
    findEmail: () => string | undefined
}

export const LoginContext = createContext<LoginOps | undefined>(undefined)

export type LoginProviderProps = {
    login: RawLoginOps
    children: React.ReactNode
}

export function addListeners(login: RawLoginOps, listeners: LoginOutListener[]): RawLoginOps {
    return {
        ...login,
        refeshLogin: async () => {
            await login.refeshLogin()
            listeners.forEach(l => l(true))
        },
        login: async () => {
            await login.login()
            listeners.forEach(l => l(true))
        },
        logout: async () => {
            await login.logout()
            listeners.forEach(l => l(false))
        }
    }
}

export function LoginProvider({login: original, children}: LoginProviderProps) {
    const [email, setEmail] = React.useState<string | undefined>(undefined)
    const listeners: LoginOutListener[] = [() => {
        setEmail(original.findEmail());
    }]
    const delegate = useMemo(() => addListeners(original, listeners), [original, listeners])

    useEffect(() => {
        console.log('LoginProvider useEffect')
        delegate.refeshLogin()
    }, [delegate])
    return <LoginContext.Provider value={{...delegate, email}}>{children}</LoginContext.Provider>
}

export function useLogin() {
    const login = useContext(LoginContext)
    if (!login) throw new Error('useLogin must be used within a LoginProvider')
    return login
}