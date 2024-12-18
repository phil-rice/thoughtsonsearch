import React from "react";
import {createRoot} from "react-dom/client";
import {Configuration, PublicClientApplication} from "@azure/msal-browser";
import {LoginProvider} from "@enterprise_search/authentication";
import {loginUsingMsal} from "@enterprise_search/msal_authentication";
import {useDisplayLogin} from "@enterprise_search/react_login_component/src/react.login";

export const exampleMsalConfig: Configuration = {
    auth: {
        clientId: process.env.REACT_MSAL_CLIENT_ID ?? "ec963ff8-b8c7-411e-80b1-9473d0390b3b",
        authority: `https://login.microsoftonline.com/b914a242-e718-443b-a47c-6b4c649d8c0a`,
        redirectUri: "/tile",
        postLogoutRedirectUri: "/",
    },
};
const msal = new PublicClientApplication(exampleMsalConfig);
const login = loginUsingMsal({msal})
const root = createRoot(document.getElementById('root') as HTMLElement);

msal.initialize({}).then(() => {
    function SearchApp() {
        const {DisplayLogin} = useDisplayLogin()
        return <div>
            <DisplayLogin/>
            <div>hello world</div>
        </div>
    }

    root.render(<React.StrictMode>
        <LoginProvider login={login}>
            <SearchApp/>
        </LoginProvider>
    </React.StrictMode>);
})

