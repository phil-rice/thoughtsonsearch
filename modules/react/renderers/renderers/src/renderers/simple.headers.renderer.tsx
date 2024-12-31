import React from "react";
import {Render} from "../renderers";

export const SimpleH1Renderer: Render = ({id, value}) => {
    return <h1 id={`${id}-value`}>{value}</h1>
}

export const SimpleH2Renderer: Render = ({id, value}) => {
    return <h2 id={`${id}-value`}>{value}</h2>
}
export const SimpleH3Renderer: Render = ({id, value}) => {
    return <h3 id={`${id}-value`}>{value}</h3>
}