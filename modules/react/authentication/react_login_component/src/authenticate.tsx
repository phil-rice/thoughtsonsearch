import {authenticateDebug, useLogin, useUserData} from "@enterprise_search/authentication";
import {LoadingOr} from "@enterprise_search/loading";
import {delay} from "@enterprise_search/recoil_utils";
import React, {ReactNode} from "react";
import {useLoginComponents} from "./react.login";
import {useDebug} from "@enterprise_search/react_utils";


export type AuthenticateProps = {
    children: React.ReactNode

};

/** When we load the page we need to refresh any logged in tokens for authenticating.
 * If we set notLoggedIn then we will show the notLoggedIn component until we have refreshed the login.
 * */
export function Authenticate({children = null}: AuthenticateProps) {
    const {refeshLogin} = useLogin();
    const {NotLoggedIn} = useLoginComponents();
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
    const userData = useUserData()
    const debug = useDebug(authenticateDebug)
    debug('MustBeLoggedIn', userData)
    return (
        <MustBeLoggedInWrapper
            loggedIn={userData?.loggedIn}
            children={children}
            notLoggedIn={notLoggedIn}
        />
    );
}

// The wrapper that decides which content to show
function MustBeLoggedInWrapper({
                                   loggedIn,
                                   children,
                                   notLoggedIn,
                               }: {
    loggedIn: boolean;
    children: ReactNode;
    notLoggedIn: () => ReactNode;
}) {
    // We do not conditionally skip any hooks here.
    // If we had more hooks, they'd always be called.

    // We only conditionally show different content.
    if (loggedIn) {
        // If children is a component that uses hooks, that's fine,
        // we always render children in the "loggedIn" path consistently
        return <>{children}</>;
    } else {
        // If notLoggedIn uses hooks, it is always used in the "loggedOut" path consistently
        return <>{notLoggedIn()}</>;
    }
}
