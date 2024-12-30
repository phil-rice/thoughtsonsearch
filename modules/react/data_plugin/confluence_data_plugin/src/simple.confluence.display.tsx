import {DisplayData, DisplayDataProps} from "@enterprise_search/react_data/src/react.data";
import {ConfluenceData} from "./confluence.data";
import React from "react";

export const SimpleConfluenceDisplay: DisplayData<ConfluenceData> =
    ({data}: DisplayDataProps<ConfluenceData>) => {
        return <span>{JSON.stringify(data)}</span>
    }

export const SimpleConfluenceOneLineDisplay: DisplayData<ConfluenceData> =
    ({data}: DisplayDataProps<ConfluenceData>) => {
        return <span>{data.type} {data.title}</span>
    }