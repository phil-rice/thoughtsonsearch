import {DisplayLoginProps} from "./react.login";
import {useLogin, useUserData} from "@enterprise_search/authentication";
import React, {ReactElement} from "react";

export function SimpleDisplayLogin(props: DisplayLoginProps) {
    const {login, isLoggedIn, logout} = useLogin()
    const {email, isAdmin, isDev} = useUserData()
    return <div>
        {isLoggedIn() ? <div>
            <div>Logged in as {email}{isAdmin ? ' - Admin' : ''}{isDev ? ' - Dev' : ''}</div>
            <button onClick={logout}>Logout</button>
        </div> : <button onClick={login}>Login</button>}
    </div>
}

export function SimpleMustBeLoggedIn(): ReactElement {
    const {isLoggedIn, login} = useLogin()

    return isLoggedIn() ?
        <span>SimpleMustBeLoggedIn called in error: actually logged in</span> :
        <div>Must be logged in
            <button onClick={login}>Login</button>
        </div>;
}