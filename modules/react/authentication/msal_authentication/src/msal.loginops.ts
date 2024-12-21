import {PublicClientApplication} from "@azure/msal-browser";
import {msalLogin, MsalLoginFn, msalRefreshLogin} from "./msal.login";
import {MsalLogout, msalLogout} from "./msal.logout";
import {LoginConfig, LoginOutFn, UserDataGetter} from "@enterprise_search/authentication";


/**
 * Creates an MSAL-based login handler.
 * @param msalInstance - The MSAL PublicClientApplication instance.
 * @param scopes - The scopes to request during login. Defaults to ["openid", "profile", "user.read", "offline_access"].
 */
type MsalLoginConfig = {
    msal: PublicClientApplication;
    scopes?: string[];
    _msalLogin?: MsalLoginFn
    _msalLogout?: MsalLogout,

}

/**
 * Configuration for MSAL-based login handler.
 * @property msal - The MSAL PublicClientApplication instance.
 * @property scopes - The scopes to request during login. Defaults to ["openid", "profile", "user.read", "offline_access"].
 * @property _msalLogin - The login function to use. Defaults to `msalLogin`. Only override if you know what you're doing (i.e. testing)
 * @property _msalLogout - The logout function to use. Defaults to `msalLogout`. Only override if you know what you're doing (i.e. testing)
 */
export function loginUsingMsal({
                                   msal,
                                   scopes = ["openid", "profile", "user.read", "offline_access"],
                                   _msalLogin = msalLogin,
                                   _msalLogout = msalLogout,

                               }: MsalLoginConfig): LoginConfig {
    const login: LoginOutFn = async (callback) => {
        await _msalLogin(msal)(scopes);
        callback()
    };
    const logout: LoginOutFn = async (callback) => {
        const accounts = msal.getAllAccounts();
        const account = accounts[0];
        if (!account) {
            return;
        }
        await _msalLogout.logout(msal, account)
        callback();
    };
    const isLoggedIn = (): boolean => {
        const accounts = msal.getAllAccounts();
        return accounts.length > 0;
    };
    const refeshLogin = async () => {await msalRefreshLogin(msal)(scopes)};
    const userData: UserDataGetter = () => {
        const accounts = msal.getAllAccounts();
        const account = accounts[0];
        const email = account ? account.username : undefined;
        const isDev = window.location.href.includes("dev=true");
        const isAdmin = window.location.href.includes("admin=true");
        return {email, isDev, isAdmin};
    }
    return {login, logout, isLoggedIn, refeshLogin, userData};
}


