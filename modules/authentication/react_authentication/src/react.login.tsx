import React from "react";
import {SimpleDisplayLogin} from "./simple.login";
import {makeContextFor} from "@enterprise_search/react_utils";


export type DisplayLoginProps = {}
export type DisplayLogin = (props: DisplayLoginProps) => React.ReactElement
export type NotLoggedIn = (() => React.ReactElement) | undefined

export const {Provider: LoginComponentsProvider, use: useLoginComponents} = makeContextFor('loginComponents', {DisplayLogin: SimpleDisplayLogin, NotLoggedIn: undefined as NotLoggedIn})


