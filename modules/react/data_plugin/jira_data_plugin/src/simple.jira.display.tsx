import {DisplayData, DisplayDataProps} from "@enterprise_search/react_data/src/react.data";
import {JiraData} from "./jira.data";
import React from "react";

export const SimpleJiraDisplay: DisplayData<JiraData> =
    ({data}: DisplayDataProps<JiraData>) => {
        return <span>{JSON.stringify(data)}</span>
    }
export const SimpleOneLineJiraDisplay: DisplayData<JiraData> =
    ({data}: DisplayDataProps<JiraData>) => {
        return <span>{data.type} {data.summary}</span>
    }