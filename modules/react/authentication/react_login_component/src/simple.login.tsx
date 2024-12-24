import {DisplayLogin, DisplayLoginProps} from "./react.login";
import {useLogin, useUserData} from "@enterprise_search/authentication";
import React, {ReactElement} from "react";

export const SimpleDisplayLogin: DisplayLogin = (props: DisplayLoginProps) => {
    const {login, logout} = useLogin()
    const {loggedIn} = useUserData() || {}
    const {email, isAdmin, isDev} = useUserData() || {}
    return <div>
        {loggedIn ? <div>
            <div>Logged in as {email}{isAdmin ? ' - Admin' : ''}{isDev ? ' - Dev' : ''}</div>
            <button onClick={logout}>Logout</button>
        </div> : <button onClick={login}>Login</button>}
    </div>
};

export function SimpleMustBeLoggedIn(): ReactElement {
    const {login} = useLogin()
    const {loggedIn} = useUserData()

    return loggedIn ?
        <span>SimpleMustBeLoggedIn called in error: actually logged in</span> :
        <div>Must be logged in
            <button onClick={login}>Login</button>
        </div>;
}
