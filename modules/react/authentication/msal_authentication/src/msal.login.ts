import {AuthenticationResult, PublicClientApplication} from "@azure/msal-browser";

export type MsalLogin = {
    name: string;
    login: (scopes: string[]) => (msal: PublicClientApplication) => Promise<AuthenticationResult | null>;
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
        await msal.acquireTokenRedirect({scopes,prompt: "select_account",});
        return Promise.resolve(null); // This will never resolve due to redirect
    },
};

export const noLogin: MsalLogin = {
    name: "noLogin",
    login: () => async () => null,
}
export type MsalLoginFn = (msal: PublicClientApplication) => (scopes: string[]) => Promise<AuthenticationResult | null>;

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
export function chainLogin(msal: PublicClientApplication, ...logins: MsalLogin[]): (scopes: string[]) => Promise<AuthenticationResult | null> {
    let lastError: any = undefined
    return async (scopes) => {
        for (const acquire of logins) {
            lastError = undefined
            try {
                const result = await acquire.login(scopes)(msal);
                if (result) {
                    console.log(`Login succeeded with method: ${acquire.name}`);
                    return result;
                }
            } catch (e: any) {
                //we expect errors, if for example we are doing a popup on a mobile... so we just remember the last error
                lastError = e
            }
        }
        const names = logins.map(a => a.name).join(", ");
        if (lastError)
            console.error(`All acquisition methods failed. ${names}. User is assumed to be not logged in`, lastError);
        else
            console.log(`All acquisition methods failed. ${names}. User is assumed to be not logged in`);
        return null;
    }
}
