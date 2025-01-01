import {Render} from "../renderers";
import React from "react";

export const SimpleDateRenderer: Render = ({id, value}) => {
    function asDate(value: string): string {
        if (!value) return "Invalid date";

        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid date";

        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString(undefined, {month: 'short'});  // Use browser locale
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const formattedDate = asDate(value);

    const thisId = `${id}-value`;
    return (
        <time
            id={thisId}
            data-testid={thisId}
            dateTime={value}
            aria-label={`Formatted date: ${formattedDate}`}
            title={formattedDate}
        >{formattedDate}</time>
    );
};
