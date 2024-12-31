import {Render} from "../renderers";
import React from "react";

export const SimpleUrlRenderer: Render = ({id, value}) => {
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    return <a id={`${id}-value`} href={isValidUrl(value) ? value : '#'} target="_blank" rel="noopener noreferrer">{value}</a>;
};
