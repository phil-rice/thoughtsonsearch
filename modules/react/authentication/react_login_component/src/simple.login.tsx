import {DisplayLoginProps} from "./react.login";
import {useLogin} from "@enterprise_search/authentication";
import React from "react";
import {PublicClientApplication} from "@azure/msal-browser";

export function SimpleDisplayLogin(props: DisplayLoginProps) {
    const {login, isLoggedIn, logout, email} = useLogin()
    return <div>
        {isLoggedIn() ? <div>
            <div>Logged in as {email}</div>
            <button onClick={logout}>Logout</button>
        </div> : <button onClick={login}>Login</button>}
    </div>

}
