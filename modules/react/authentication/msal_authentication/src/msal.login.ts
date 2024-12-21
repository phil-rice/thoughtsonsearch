import {AuthenticationResult, PublicClientApplication} from "@azure/msal-browser";

export type MsalLogin = {
    name: string;
    login: (scopes: string[], debug: boolean) => (msal: PublicClientApplication) => Promise<AuthenticationResult | null>;
};


export const fromPreviousRedirectLogin: MsalLogin = {
    name: "acquireFromRedirect",
    login: () => async (msal) => msal.handleRedirectPromise(),
};

export const silentLogin: MsalLogin = {
    name: "acquireSilent",
    login: scopes => msal => msal.acquireTokenSilent({scopes}),
};

export const popupLogin: MsalLogin = {
    name: "acquirePopup",
    login: scopes => msal =>
        msal.acquireTokenPopup({scopes, prompt: "select_account",}),
};

export const redirectLogin: MsalLogin = {
    name: "acquireRedirect",
    login: scopes => async msal => {
        await msal.acquireTokenRedirect({scopes, prompt: "select_account",});
        return Promise.resolve(null); // This will never resolve due to redirect
    },
};

export const noLogin: MsalLogin = {
    name: "noLogin",
    login: () => async () => null,
}
export type MsalLoginFn = (msal: PublicClientApplication) => (scopes: string[], debug: boolean) => Promise<AuthenticationResult | null>;

export const msalLogin: MsalLoginFn =
    (msal: PublicClientApplication) =>
        chainLogin(msal, fromPreviousRedirectLogin, silentLogin, popupLogin, redirectLogin);


export const msalRefreshLogin: MsalLoginFn =
    (msal: PublicClientApplication) =>
        chainLogin(msal, fromPreviousRedirectLogin, silentLogin, noLogin);

/**
 * Chains multiple MsalLogin methods into a single strategy.
 * Attempts each method in order until one succeeds or all fail.
 * Logs the first success or the last failure for debugging.
 */
export function chainLogin(msal: PublicClientApplication, ...logins: MsalLogin[]): (scopes: string[], debug: boolean) => Promise<AuthenticationResult | null> {
    let lastError: any = undefined
    return async (scopes, debug) => {
        const accounts = msal.getAllAccounts();
        const account0 = accounts[0];
        if (account0) msal.setActiveAccount(account0);
        for (const acquire of logins) {
            lastError = undefined
            try {
                if (debug) console.log('trying login method', acquire.name)
                const result = await acquire.login(scopes, debug)(msal);
                if (result) {
                    if (debug) console.log(`Login succeeded with method: ${acquire.name}`);
                    msal.setActiveAccount(result.account);
                    return result;
                }
            } catch (e: any) {
                if (debug) {
                    console.error(`Login failed for method: ${acquire.name}`, e);
                }
                //we expect errors, if for example we are doing a popup on a mobile... so we just remember the last error
                lastError = e
            }
        }
        const names = logins.map(a => a.name).join(", ");
        if (debug)
            if (lastError)
                console.error(`All acquisition methods failed. ${names}. User is assumed to be not logged in`, lastError);
            else
                console.log(`All acquisition methods failed. ${names}. User is assumed to be not logged in`);
        return null;
    }
}
