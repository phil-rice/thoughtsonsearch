import {PublicClientApplication} from "@azure/msal-browser";
import {msalLogin, MsalLoginFn, msalRefreshLogin} from "./msal.login";
import {MsalLogout, msalLogout} from "./msal.logout";
import {RawLoginOps} from "@enterprise_search/authentication";


/**
 * Creates an MSAL-based login handler.
 * @param msalInstance - The MSAL PublicClientApplication instance.
 * @param scopes - The scopes to request during login. Defaults to ["openid", "profile", "user.read", "offline_access"].
 */
type MsalLoginConfig = {
    msal: PublicClientApplication;
    scopes?: string[];
    login?: MsalLoginFn
    logout?: MsalLogout
}

/**
 * Configuration for MSAL-based login handler.
 * @property msal - The MSAL PublicClientApplication instance.
 * @property scopes - The scopes to request during login. Defaults to ["openid", "profile", "user.read", "offline_access"].
 * @property login - The login function to use. Defaults to `msalLogin`. Only override if you know what you're doing (i.e. testing)
 * @property logout - The logout function to use. Defaults to `msalLogout`. Only override if you know what you're doing (i.e. testing)
 */
export function loginUsingMsal({
                                   msal,
                                   scopes = ["openid", "profile", "user.read", "offline_access"],
                                   login = msalLogin,
                                   logout = msalLogout,
                               }: MsalLoginConfig): RawLoginOps {
    return {
        refeshLogin: async () => {await msalRefreshLogin(msal)(scopes)},
        login: async () => {await login(msal)(scopes)},
        logout: async () => {
            const accounts = msal.getAllAccounts();
            const account = accounts[0];
            if (!account) {
                return;
            }
            await logout.logout(msal, account)
        },

        isLoggedIn: (): boolean => {
            const accounts = msal.getAllAccounts();
            return accounts.length > 0;
        },
        findEmail: () => {
            const accounts = msal.getAllAccounts();
            const account = accounts[0];
            return account ? account.username : undefined;
        }
    };
}


