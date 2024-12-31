import { Render } from "../renderers";
import React from "react";
import {ellipsesInMiddle} from "@enterprise_search/recoil_utils";


export const SimpleUrlRenderer: Render = ({ id, value }) => {
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
            id={`${id}-value`}
            href={isValidUrl(value) ? value : '#'}
            target="_blank"
            rel="noopener noreferrer"
        >
            {displayUrl}
        </a>
    );
};
