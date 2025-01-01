import React from "react";
import {Render} from "../renderers";

export const SimpleH1Renderer: Render = ({id, value}) => {
    const thisId = `${id}-value`;
    return <h1 id={thisId} data-testid={thisId}>{value}</h1>
}

export const SimpleH2Renderer: Render = ({id, value}) => {
    return <h2 id={`${id}-value`}>{value}</h2>
}
export const SimpleH3Renderer: Render = ({id, value}) => {
    return <h3 id={`${id}-value`}>{value}</h3>
}