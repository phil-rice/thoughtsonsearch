import {useLogin} from "./authenticationProvider";
import {LoadingOr} from "@enterprise_search/loading";
import {delay} from "@enterprise_search/recoil_utils";
import React, {ReactElement} from "react";

export type AuthenticateProps = {
    children: React.ReactElement
    NotLoggedIn?: () => React.ReactElement
};

/** When we load the page we need to refresh any logged in tokens for authenticating.
 * If we set notLoggedIn then we will show the notLoggedIn component until we have refreshed the login.
 * */
export function Authenticate({children, NotLoggedIn}: AuthenticateProps) {
    const {refeshLogin} = useLogin();
    const kleisli = (isLoggedIn: boolean) => delay(3000).then(() => refeshLogin());
    return <LoadingOr kleisli={kleisli} input={undefined}>{() =>
        NotLoggedIn ? <MustBeLoggedIn notLoggedIn={NotLoggedIn}>{children}</MustBeLoggedIn> : children
    }</LoadingOr>

}

export type MustBeLoggedInProps = {
    notLoggedIn: () => React.ReactElement,
    children: React.ReactElement
};

export type MustBeLoggedInDisplay = (props: MustBeLoggedInProps) => React.ReactElement;

export function MustBeLoggedIn({children, notLoggedIn}: MustBeLoggedInProps): ReactElement {
    const {isLoggedIn} = useLogin();
    return isLoggedIn() ? children : notLoggedIn();
}

