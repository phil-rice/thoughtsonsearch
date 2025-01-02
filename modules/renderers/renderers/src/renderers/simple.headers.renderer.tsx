import React from "react";
import {idFrom, Render} from "../renderers";

export const SimpleH1Renderer: Render = ({rootId, attribute, value}) => {
    const id = idFrom(rootId, attribute);
    return <h1 id={id} data-testid={id}>{value}</h1>
}

export const SimpleH2Renderer: Render = ({rootId, attribute, value}) => {
    const id = idFrom(rootId, attribute);
    return <h2 id={id} data-testid={id}>{value}</h2>
}

export const SimpleH3Renderer: Render = ({rootId, attribute, value}) => {
    const id = idFrom(rootId, attribute);
    return <h3 id={id} data-testid={id}>{value}</h3>
}