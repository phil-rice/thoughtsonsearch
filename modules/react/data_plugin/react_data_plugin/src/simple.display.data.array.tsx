import {DisplayDataArrayProps} from "./react.data";
import React from "react";

export function SimpleDisplayDataArray<Data>({id, title, Display, data}: DisplayDataArrayProps<Data>) {
    return (
        <div id={`${id}-data-array`}>
            <h1>{title}</h1>
            {
                data.map(({data}, index) => {
                    return <Display key={index} id={`${id}-item-${index}`} data={data}/>
                })}

        </div>)
}


