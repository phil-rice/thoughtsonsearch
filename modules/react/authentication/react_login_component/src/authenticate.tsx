import {useLogin, UserDataContext, useUserData} from "@enterprise_search/authentication";
import {LoadingOr} from "@enterprise_search/loading";
import {delay} from "@enterprise_search/recoil_utils";
import React, {ReactNode, useContext} from "react";
import {useNotLoggedIn} from "./react.login";

export type AuthenticateProps = {
    children: React.ReactNode

};

/** When we load the page we need to refresh any logged in tokens for authenticating.
 * If we set notLoggedIn then we will show the notLoggedIn component until we have refreshed the login.
 * */
export function Authenticate({children = null}: AuthenticateProps) {
    const {refeshLogin} = useLogin();
    const {NotLoggedIn} = useNotLoggedIn();
    const kleisli = async () => {
        await delay(3000)
        await refeshLogin()
    }
    return <LoadingOr kleisli={kleisli} input={undefined}>{() =>
        NotLoggedIn ? <MustBeLoggedIn notLoggedIn={NotLoggedIn}>{children}</MustBeLoggedIn> : children
    }</LoadingOr>

}

export type MustBeLoggedInProps = {
    notLoggedIn: () => ReactNode,
    children: ReactNode
};

export type MustBeLoggedInDisplay = (props: MustBeLoggedInProps) => React.ReactElement;

export function MustBeLoggedIn({children, notLoggedIn}: MustBeLoggedInProps): ReactNode {
    const {loggedIn} = useContext(UserDataContext) //no idea why useUserData doesn't work here.
    // const {loggedIn} = useUserData()
    return loggedIn ? children : notLoggedIn();
}

