import React from "react";
import {Render} from "../renderers";

export const SimpleTextRenderer: Render = ({id, value}) => {
    return <span id={`${id}-value`}>{value}</span>
}