import {DisplayLogin, DisplayLoginProps} from "./react.login";

import React, {ReactElement} from "react";
import {useLogin, useUserData} from "./authenticationProvider";

export const SimpleDisplayLogin: DisplayLogin = (props: DisplayLoginProps) => {
    const {login, logout} = useLogin()
    const userData = useUserData()
    const {loggedIn, email, isAdmin, isDev} = userData
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
