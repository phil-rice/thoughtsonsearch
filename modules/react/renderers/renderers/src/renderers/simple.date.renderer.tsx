import {Render} from "../renderers";
import React from "react";

export const SimpleDateRenderer: Render = ({ id, value }) => {
    function asDate(value: string): string {
        const date = new Date(value);
        if (isNaN(date.getTime())) return value

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    return <span id={`${id}-value`}>{asDate(value)}</span>;
};
