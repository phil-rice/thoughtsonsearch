import {useUserData} from "@enterprise_search/react_login_component";
import React from "react";

export function DevModeUserData() {
    const userData = useUserData()
    return <pre>{JSON.stringify(userData, null, 2)}</pre>
}