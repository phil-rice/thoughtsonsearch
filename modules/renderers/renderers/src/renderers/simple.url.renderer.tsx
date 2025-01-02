import {idFrom, Render} from "../renderers";
import React from "react";
import {ellipsesInMiddle} from "@enterprise_search/recoil_utils";


export const SimpleUrlRenderer: Render = ({attribute, rootId, value}) => {
    const id = idFrom(rootId, attribute);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const displayUrl = ellipsesInMiddle(value, 70); // Truncate URLs longer than 50 characters

    return (
        <a
            id={id}
            data-testid={id}
            href={isValidUrl(value) ? value : '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={value}  // Full URL for screen readers
            title={value}       // Tooltip for mouse users
        >{displayUrl}</a>
    );
};
